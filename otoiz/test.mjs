import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
test('Membership, ownership, photo validation, favorites and durable state',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'vitra-test-'));let child,origin;
 async function start(){child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:'0',VITRA_DATA_DIR:directory,VITRA_ASSISTANT_MODE:'basic'},stdio:['ignore','pipe','pipe']});origin=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(new Error('Server timeout')),10000);child.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/http:\/\/localhost:(\d+)/);if(match){clearTimeout(timer);resolve('http://127.0.0.1:'+match[1]);}});child.on('error',reject);child.on('exit',code=>{clearTimeout(timer);reject(new Error('Server exited: '+code));});});}
 async function stop(){if(child&&child.exitCode===null){await new Promise(resolve=>{child.once('exit',resolve);child.kill();});}}
 async function request(path,{method='GET',data,cookie,headers={}}={}){const response=await fetch(origin+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...headers},...(data?{body:JSON.stringify(data)}:{})});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};}
 try{
  await start();assert.equal((await fetch(origin)).status,200);
  const catalogResponse=await request('/catalog');assert.equal(catalogResponse.status,200);assert.equal(catalogResponse.data.models.length,178);assert.equal(catalogResponse.data.brands.length,37);assert.ok(catalogResponse.data.models.every(x=>x.price===null&&x.listingUrl===null));
  for(const path of ['/ilanlar.html','/catalog.js','/catalog-core.js','/premium.css','/hero.svg'])assert.equal((await fetch(origin+path)).status,200);
  assert.equal((await fetch(origin+'/araclar?marka=BMW&model=E30+3+Serisi')).status,200);
  const vehiclesHtml=await(await fetch(origin+'/araclar')).text();assert.match(vehiclesHtml,/data-page="vehicles"/);assert.match(vehiclesHtml,/Araçlar — OTOİZ/);
  const contactHtml=await(await fetch(origin+'/iletisim')).text();assert.match(contactHtml,/İletişim — OTOİZ/);assert.match(contactHtml,/Mesaj gönderim servisi henüz bağlı değil/);
  for(const item of catalogResponse.data.models.filter(x=>x.image)){const response=await fetch(origin+item.image);assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/image\/(jpeg|png)/);}
  const research=await fetch(origin+'/api/catalog/research');assert.equal(research.status,200);assert.match(research.headers.get('content-type'),/text\/csv/);assert.deepEqual(Buffer.from(await research.arrayBuffer()),await readFile(join(root,'catalogs','otoiz_arastirma.csv')));
  const manifestResponse=await fetch(origin+'/manifest.webmanifest');assert.match(manifestResponse.headers.get('content-type'),/application\/manifest\+json/);const manifest=await manifestResponse.json();assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'/');
  for(const image of manifest.icons){const response=await fetch(origin+image.src);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/png');const bytes=Buffer.from(await response.arrayBuffer());assert.equal(bytes.readUInt32BE(16),Number(image.sizes.split('x')[0]));}
  const serviceWorker=await fetch(origin+'/sw.js');assert.equal(serviceWorker.status,200);assert.equal(serviceWorker.headers.get('cache-control'),'no-cache');assert.equal((await fetch(origin+'/.env')).status,404);assert.equal((await fetch(origin+'/offline.html')).status,200);
  const assistantConfig=await request('/assistant/config');assert.equal(assistantConfig.data.mode,'basic');assert.equal(assistantConfig.data.key,undefined);
  const search=await request('/assistant/search',{method:'POST',data:{message:'1–3 milyon TL, 40–80 bin km, Alman otomatik',filters:{}}});assert.equal(search.status,200);assert.equal(search.data.filters.minKm,40000);assert.ok(search.data.ids.includes('demo-1'));assert.ok(!search.data.ids.includes('demo-4'));
  assert.equal((await request('/assistant/search',{method:'POST',data:{message:'Alman',filters:{maxKm:-1}}})).status,400);
  assert.equal((await request('/assistant/search',{method:'POST',data:{message:'x'.repeat(1501)}})).status,400);
  assert.equal((await request('/assistant/search',{method:'POST',data:null})).status,400);
  assert.equal((await request('/session')).data.user,null);
  const anonymous=await request('/listings',{method:'POST',data:{}});assert.equal(anonymous.status,401);
  const invalid=await request('/register',{method:'POST',data:{name:'Alıcı',email:'invalid',password:'test-password-2026'}});assert.equal(invalid.status,400);
  const seller=await request('/register',{method:'POST',data:{name:'Test Satıcı',email:'seller@example.test',password:'test-password-2026'}});assert.equal(seller.status,200);assert.ok(seller.cookie);assert.equal(seller.data.user.passwordHash,undefined);
  const buyer=await request('/register',{method:'POST',data:{name:'Test Alıcı',email:'buyer@example.test',password:'test-password-2026'}});assert.equal(buyer.status,200);
  const wrong=await request('/login',{method:'POST',data:{email:'seller@example.test',password:'wrong-password-2026'}});assert.equal(wrong.status,401);
  const login=await request('/login',{method:'POST',data:{email:'seller@example.test',password:'test-password-2026'}});assert.equal(login.status,200);
  const payload={brand:'BMW',model:'Test Model',price:1500000,year:2022,km:35000,city:'İstanbul',color:'Gri',description:'Test aracının bakım ve teknik özelliklerine dair yeterli açıklama.',damage:'Hasar bilgisi test beyanı.',phone:'0532 123 45 67',fuel:'Benzin',gear:'Otomatik',body:'Sedan',sellerType:'Bireysel',images:['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==']};
  const fake=await request('/listings',{method:'POST',cookie:seller.cookie,data:{...payload,images:['data:image/png;base64,SGVsbG8gdGhpcyBpcyBub3QgYW4gaW1hZ2U=']}});assert.equal(fake.status,400);
  const created=await request('/listings',{method:'POST',cookie:seller.cookie,data:payload});assert.equal(created.status,201);const id=created.data.listing.id;assert.equal(created.data.listing.ownerId,seller.data.user.id);
  assert.equal((await request('/listings/'+id)).data.listing.phone,undefined);
  assert.equal((await request('/listings/'+id,{cookie:buyer.cookie})).data.listing.phone,payload.phone);
  const favorite=await request('/favorites',{method:'POST',cookie:buyer.cookie,data:{listingId:id}});assert.equal(favorite.data.saved,true);
  assert.deepEqual((await request('/session',{cookie:buyer.cookie})).data.favorites,[id]);
  const denied=await request('/listings/'+id,{method:'DELETE',cookie:buyer.cookie,data:{}});assert.equal(denied.status,403);
  const crossOrigin=await request('/favorites',{method:'POST',cookie:buyer.cookie,data:{listingId:id},headers:{Origin:'https://evil.example'}});assert.equal(crossOrigin.status,403);
  const report=await request('/reports',{method:'POST',cookie:buyer.cookie,data:{listingId:id,reason:'Test şikâyet açıklaması yeterince uzun.'}});assert.equal(report.status,201);
  const stored=JSON.parse(await readFile(join(directory,'database.json'),'utf8'));assert.notEqual(stored.users[0].passwordHash,'test-password-2026');assert.equal(stored.users[0].password,undefined);assert.equal(stored.reports.length,1);
  await stop();await start();assert.equal((await request('/listings/'+id)).status,200);assert.deepEqual((await request('/session',{cookie:buyer.cookie})).data.favorites,[id]);
  const removed=await request('/listings/'+id,{method:'DELETE',cookie:seller.cookie,data:{}});assert.equal(removed.status,200);assert.equal((await request('/listings/'+id)).status,404);assert.deepEqual((await request('/session',{cookie:buyer.cookie})).data.favorites,[]);
  await request('/logout',{method:'POST',cookie:buyer.cookie,data:{}});assert.equal((await request('/session',{cookie:buyer.cookie})).data.user,null);
 }finally{await stop();await rm(directory,{recursive:true,force:true});}
});
