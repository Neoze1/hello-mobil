import http from 'node:http';
import {networkInterfaces} from 'node:os';
import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {resolve,extname,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,randomUUID,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {demoListings} from './public/demo.js';
import {searchAssistant,validateFilters} from './assistant.mjs';
import {catalog,brands,catalogPackage} from './catalog.mjs';
const scrypt=promisify(scryptCallback);
const root=dirname(fileURLToPath(import.meta.url));
const dataDir=resolve(process.env.VITRA_DATA_DIR || resolve(root,'data'));
await mkdir(dataDir,{recursive:true});
const dataPath=resolve(dataDir,'database.json');
let database;
try{database=JSON.parse(await readFile(dataPath,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;database={users:[],sessions:[],listings:[],favorites:[],reports:[]};}
let writeQueue=Promise.resolve();
function mutate(fn){const operation=writeQueue.then(async()=>{const next=structuredClone(database);const result=fn(next);const temporary=dataPath+'.tmp';await writeFile(temporary,JSON.stringify(next,null,2));await rename(temporary,dataPath);database=next;return result;});writeQueue=operation.catch(()=>{});return operation;}
const json=(res,status,value,extra={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra});res.end(JSON.stringify(value));};
const fail=(message,status=400)=>Object.assign(new Error(message),{status});
const publicUser=user=>user?{id:user.id,name:user.name,email:user.email}:null;
const hashToken=token=>createHash('sha256').update(token).digest('hex');
function identity(req){const raw=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('vitra_session='))?.slice(14);if(!raw)return null;const session=database.sessions.find(s=>s.tokenHash===hashToken(raw)&&s.expiresAt>Date.now());return session?database.users.find(u=>u.id===session.userId):null;}
function requireUser(req){const user=identity(req);if(!user)throw fail('Bu işlem için giriş yapmalısın.',401);return user;}
function cookie(req,value,age){return `vitra_session=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}${process.env.VITRA_HTTPS==='1'?'; Secure':''}`;}
async function body(req,maxBytes=9*1024*1024){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>maxBytes)throw fail('Gönderilen veri boyut sınırını aşıyor.',413);chunks.push(chunk);}try{const data=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!data||typeof data!=='object'||Array.isArray(data))throw new Error();return data;}catch{throw fail('Gönderilen veri geçerli değil.');}}
const limits=new Map();
function rateLimit(req,key,max=12){const bucketKey=`${req.socket.remoteAddress}:${key}`;const now=Date.now();if(limits.size>1000)for(const[k,v]of limits)if(v.until<now)limits.delete(k);let bucket=limits.get(bucketKey);if(!bucket||bucket.until<now){bucket={count:0,until:now+60000};limits.set(bucketKey,bucket);}if(++bucket.count>max)throw fail('Çok fazla deneme yaptın. Bir dakika sonra tekrar dene.',429);}
function textField(value,min,max,label){if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)throw fail(`${label} ${min}–${max} karakter arasında olmalı.`);return value.trim();}
function numberField(value,min,max,label){if(!Number.isSafeInteger(value)||value<min||value>max)throw fail(`${label} ${min}–${max} aralığında olmalı.`);return value;}
function enumField(value,options,label){if(!options.includes(value))throw fail(`${label} seçimi geçerli değil.`);return value;}
function validateImage(value){if(typeof value!=='string')throw fail('Fotoğraf geçerli değil.');const match=value.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);if(!match)throw fail('Yalnızca JPEG, PNG ve WebP fotoğrafları kabul edilir.');const bytes=Buffer.from(match[2],'base64');if(bytes.length<12||bytes.length>2*1024*1024)throw fail('Her fotoğraf en fazla 2 MB olmalı.');const valid=match[1]==='jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:match[1]==='png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';if(!valid)throw fail('Fotoğraf içeriği dosya türüyle uyuşmuyor.');return value;}
function allListings(){return [...database.listings,...demoListings];}
function summary(item){const{images,phone,...rest}=item;return{...rest,image:images[0],imageCount:images.length};}
const assistantKey=process.env.VITRA_ASSISTANT_MODE==='basic'?'':process.env.OPENAI_API_KEY;
let assistantRequests=0;
async function api(req,res,path){
 if(path==='/api/contact'&&req.method==='GET')return json(res,200,{email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.OTOIZ_CONTACT_EMAIL||'')?process.env.OTOIZ_CONTACT_EMAIL:null,phone:process.env.OTOIZ_CONTACT_PHONE||null,address:process.env.OTOIZ_CONTACT_ADDRESS||null});
 if(['/api/catalog/research/current','/api/catalog/export'].includes(path)&&req.method==='GET'){const csv=path.endsWith('current');const file=csv?'otoiz_arastirma_guncel.csv':'otoiz_katalog_guncel.json';const contents=await readFile(resolve(root,'catalogs',file));res.writeHead(200,{'Content-Type':csv?'text/csv; charset=utf-8':'application/json; charset=utf-8','Content-Disposition':`attachment; filename="${file}"`,'Cache-Control':'no-store'});return res.end(contents);}
 if(path==='/api/catalog/research'&&req.method==='GET'){const csv=await readFile(resolve(root,'catalogs','otoiz_arastirma.csv'));res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="otoiz_arastirma.csv"','Cache-Control':'no-store'});return res.end(csv);}
 if(path==='/api/catalog'&&req.method==='GET')return json(res,200,{schemaVersion:2,package:catalogPackage,brands,models:catalog});
 if(!['GET','HEAD'].includes(req.method)){if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)throw fail('İstek kaynağına izin verilmiyor.',403);if(!String(req.headers['content-type']||'').startsWith('application/json'))throw fail('JSON veri gerekli.',415);}
 if(path==='/api/assistant/config'&&req.method==='GET')return json(res,200,{mode:assistantKey?'ai':'basic'});
 if(path==='/api/assistant/search'&&req.method==='POST'){
  rateLimit(req,'assistant',10);
  const data=await body(req,8192);const message=textField(data.message,1,1500,'Mesaj');
  let previous;try{previous=validateFilters(data.filters||{});}catch(error){throw fail(error.message);}
  if(assistantRequests>=4)throw fail('Asistan şu an meşgul. Biraz sonra tekrar dene.',429);
  assistantRequests++;
  try{let result;try{result=await searchAssistant(message,previous,allListings(),{key:assistantKey,model:process.env.OPENAI_MODEL||'gpt-4o-mini'});}catch(error){throw fail(error.message);}return json(res,200,result);}finally{assistantRequests--;}
 }
 if(path==='/api/session'&&req.method==='GET'){const user=identity(req);return json(res,200,{user:publicUser(user),favorites:user?database.favorites.filter(f=>f.userId===user.id).map(f=>f.listingId):[]});}
 if(['/api/register','/api/login'].includes(path)&&req.method==='POST'){
  rateLimit(req,'auth');const data=await body(req);const email=textField(data.email,5,254,'E-posta').toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw fail('Geçerli bir e-posta adresi gir.');const password=textField(data.password,10,128,'Şifre');let user;
  if(path==='/api/register'){const name=textField(data.name,2,80,'Ad soyad');const salt=randomBytes(16).toString('hex');const passwordHash=(await scrypt(password,salt,64)).toString('hex');user=await mutate(db=>{if(db.users.some(u=>u.email===email))throw fail('Bu e-posta ile bir hesap mevcut.',409);const u={id:randomUUID(),name,email,salt,passwordHash,createdAt:new Date().toISOString()};db.users.push(u);return u;});}
  else{user=database.users.find(u=>u.email===email);const candidate=await scrypt(password,user?.salt||'invalid-salt',64);if(!user||!timingSafeEqual(candidate,Buffer.from(user.passwordHash,'hex')))throw fail('E-posta veya şifre hatalı.',401);}
  const token=randomBytes(32).toString('hex');await mutate(db=>{db.sessions=db.sessions.filter(s=>s.expiresAt>Date.now());db.sessions.push({tokenHash:hashToken(token),userId:user.id,expiresAt:Date.now()+7*86400000});});return json(res,200,{user:publicUser(user)},{'Set-Cookie':cookie(req,token,604800)});
 }
 if(path==='/api/logout'&&req.method==='POST'){const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('vitra_session='))?.slice(14);if(token)await mutate(db=>{db.sessions=db.sessions.filter(s=>s.tokenHash!==hashToken(token));});return json(res,200,{ok:true},{'Set-Cookie':cookie(req,'',0)});}
 if(path==='/api/listings'&&req.method==='GET')return json(res,200,{listings:allListings().map(summary)});
 if(path==='/api/listings'&&req.method==='POST'){
  const user=requireUser(req);rateLimit(req,'listing',8);const data=await body(req);
  const listing={id:randomUUID(),ownerId:user.id,sellerName:user.name,createdAt:new Date().toISOString(),demo:false,
   brand:textField(data.brand,2,50,'Marka'),model:textField(data.model,2,100,'Model'),price:numberField(data.price,1000,100000000,'Fiyat'),year:numberField(data.year,1950,new Date().getFullYear()+1,'Yıl'),km:numberField(data.km,0,3000000,'Kilometre'),city:textField(data.city,2,50,'Şehir'),color:textField(data.color,2,30,'Renk'),description:textField(data.description,30,5000,'Açıklama'),damage:textField(data.damage,5,500,'Hasar bilgisi'),phone:textField(data.phone,10,20,'Telefon'),fuel:enumField(data.fuel,['Benzin','Dizel','Hibrit','Elektrik','LPG'],'Yakıt'),gear:enumField(data.gear,['Otomatik','Manuel'],'Vites'),body:enumField(data.body,['Sedan','SUV','Hatchback','Coupe','Diğer'],'Kasa tipi'),sellerType:enumField(data.sellerType,['Bireysel','Galeri'],'Satıcı tipi')};
  if(!/^\+?[\d\s()-]+$/.test(listing.phone))throw fail('Geçerli bir telefon numarası gir.');if(!Array.isArray(data.images)||data.images.length<1||data.images.length>5)throw fail('1–5 fotoğraf eklemelisin.');listing.images=data.images.map(validateImage);if(listing.images.reduce((sum,img)=>sum+Buffer.from(img.split(',')[1],'base64').length,0)>6*1024*1024)throw fail('Fotoğraflar toplam 6 MB sınırını aşamaz.');await mutate(db=>db.listings.unshift(listing));return json(res,201,{listing:summary(listing)});
 }
 const detail=path.match(/^\/api\/listings\/([\w-]+)$/);
 if(detail&&req.method==='GET'){const listing=allListings().find(x=>x.id===detail[1]);if(!listing)throw fail('İlan bulunamadı.',404);const{phone,...safe}=listing;return json(res,200,{listing:{...safe,phone:identity(req)?phone:undefined}});}
 if(detail&&req.method==='DELETE'){const user=requireUser(req);await mutate(db=>{const item=db.listings.find(x=>x.id===detail[1]);if(!item)throw fail('İlan bulunamadı.',404);if(item.ownerId!==user.id)throw fail('Bu ilanı kaldırma yetkin yok.',403);db.listings=db.listings.filter(x=>x.id!==item.id);db.favorites=db.favorites.filter(x=>x.listingId!==item.id);});return json(res,200,{ok:true});}
 if(path==='/api/favorites'&&req.method==='POST'){const user=requireUser(req);const{listingId}=await body(req);if(!allListings().some(x=>x.id===listingId))throw fail('İlan bulunamadı.',404);const saved=await mutate(db=>{const found=db.favorites.find(x=>x.userId===user.id&&x.listingId===listingId);if(found)db.favorites=db.favorites.filter(x=>x!==found);else db.favorites.push({userId:user.id,listingId});return !found;});return json(res,200,{saved});}
 if(path==='/api/reports'&&req.method==='POST'){const user=requireUser(req);rateLimit(req,'report',5);const data=await body(req);if(!allListings().some(x=>x.id===data.listingId))throw fail('İlan bulunamadı.',404);const reason=textField(data.reason,10,1000,'Şikâyet açıklaması');const id=randomUUID();await mutate(db=>db.reports.push({id,userId:user.id,listingId:data.listingId,reason,createdAt:new Date().toISOString(),status:'pending'}));return json(res,201,{id});}
 throw fail('İşlem bulunamadı.',404);
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webmanifest':'application/manifest+json; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
 try{const path=new URL(req.url,'http://localhost').pathname;if(path.startsWith('/api/'))return await api(req,res,path);if(!['GET','HEAD'].includes(req.method))throw fail('Yönteme izin verilmiyor.',405);const files=new Set(['/index.html','/iletisim.html','/site.js','/contact.js','/brand.css','/logo-light.svg','/logo-dark.svg','/ilanlar.html','/catalog.js','/catalog-core.js','/premium.css','/hero.svg','/style.css','/chat.css','/mobile.css','/app.js','/chat.js','/search.js','/demo.js','/favicon.svg','/pwa.js','/sw.js','/manifest.webmanifest','/offline.html','/offline.css','/icons/icon-192.png','/icons/icon-512.png','/icons/apple-touch-icon.png']);const filename=['/','/araclar','/araclar/'].includes(path)?'/index.html':['/iletisim','/iletisim/'].includes(path)?'/iletisim.html':path;for(const item of catalog)if(item.image)files.add(item.image);if(!files.has(filename))throw fail('Sayfa bulunamadı.',404);let contents=await readFile(resolve(root,'public',filename.slice(1)));if(filename==='/index.html'&&path.startsWith('/araclar'))contents=Buffer.from(contents.toString().replace('data-page="home"','data-page="vehicles"').replace('<title>OTOİZ — Hayalindeki Otomobili Keşfet</title>','<title>Araçlar — OTOİZ</title>'));res.writeHead(200,{'Content-Type':mime[extname(filename)]||'application/octet-stream','Cache-Control':['/sw.js','/index.html','/manifest.webmanifest'].includes(filename)?'no-cache':'max-age=0, must-revalidate'});res.end(req.method==='HEAD'?undefined:contents);
 }catch(error){if(!error.status)console.error(error);if(!res.headersSent)json(res,error.status||500,{error:error.status?error.message:'Bir sorun oluştu. Bilgilerini koruyarak yeniden dene.'});else res.end();}
});
const port=Number(process.env.PORT||3000);
const host=process.env.VITRA_HOST||'0.0.0.0';
server.listen(port,host,()=>{
 const actualPort=server.address().port;
 console.log(`OTOİZ hazır: http://localhost:${actualPort}`);
 if(host==='0.0.0.0')for(const addresses of Object.values(networkInterfaces()))for(const address of addresses||[]){if(address.family==='IPv4'&&!address.internal&&!address.address.startsWith('169.254.'))console.log(`Aynı Wi-Fi ağındaki telefon: http://${address.address}:${actualPort}`);}
});
