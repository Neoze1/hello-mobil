import {WebSocket} from './cdp-socket.mjs';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,access,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const temp=await mkdtemp(join(tmpdir(),'otoiz-browser-'));
let server,browser,ws;const pending=new Map();let sequence=0;const errors=[];
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(callback){for(let i=0;i<100;i++){if(await callback())return;await delay(100);}throw new Error('Browser check timed out');}
try{
 const candidates=[process.env.BROWSER_PATH,'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Microsoft/Edge/Application/msedge.exe','C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean);
 let executable;for(const candidate of candidates){try{await access(candidate);executable=candidate;break;}catch{}}
 if(!executable)throw new Error('Set BROWSER_PATH to a Chromium browser executable.');
 server=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:'0',VITRA_HOST:'127.0.0.1',VITRA_DATA_DIR:join(temp,'data'),VITRA_ASSISTANT_MODE:'basic'},windowsHide:true,stdio:['ignore','pipe','pipe']});
 const origin=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(new Error('Server startup timeout')),10000);server.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/http:\/\/localhost:(\d+)/);if(match){clearTimeout(timer);resolve('http://127.0.0.1:'+match[1]);}});server.on('error',reject);server.on('exit',code=>reject(new Error('Server exited '+code)));});
 browser=spawn(executable,['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=0','--user-data-dir='+join(temp,'profile'),'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
 const endpoint=await new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(new Error('Browser startup timeout')),15000);browser.stderr.on('data',chunk=>{output+=chunk;const match=output.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);if(match){clearTimeout(timer);resolve('http://127.0.0.1:'+match[1]);}});browser.on('error',reject);});
 const targets=await(await fetch(endpoint+'/json')).json();
 ws=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('DevTools WebSocket timeout')),10000);ws.onopen=()=>{clearTimeout(timer);resolve();};ws.onerror=()=>{clearTimeout(timer);reject(new Error('DevTools WebSocket connection failed'));};});
 ws.onmessage=event=>{const message=JSON.parse(event.data);if(message.id){const item=pending.get(message.id);pending.delete(message.id);message.error?item.reject(new Error(JSON.stringify(message.error))):item.resolve(message.result);}if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('DevTools timeout: '+method));},10000);pending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);},reject:error=>{clearTimeout(timer);reject(error);}});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(response.exceptionDetails)throw new Error(JSON.stringify(response.exceptionDetails));return response.result.value;};
 await send('Runtime.enable');await send('Page.enable');
 const navigate=async path=>{await send('Page.navigate',{url:origin+path});await until(()=>evaluate('!!document.querySelector("#language")'));};
 const selectLanguage=async code=>{await evaluate(`document.querySelector('#language').value=${JSON.stringify(code)};document.querySelector('#language').dispatchEvent(new Event('change',{bubbles:true}));`);};
 for(const path of ['/hakkinda','/iletisim','/kosullar','/gizlilik']){
  assert.equal((await fetch(origin+path)).status,200);
  console.log('Checking '+path);await navigate(path);
  for(const code of ['tr','en','ar','fa']){
   await selectLanguage(code);
   assert.equal(await evaluate('document.documentElement.lang'),code);
   assert.equal(await evaluate('document.documentElement.dir'),['ar','fa'].includes(code)?'rtl':'ltr');
   assert.equal(await evaluate(`localStorage.getItem('otoiz-language')`),code);
   assert.equal(await evaluate(`document.title.endsWith(' — OTOİZ')`),true);
   assert.ok(await evaluate(`[...document.querySelectorAll('[data-i18n]')].every(node=>node.textContent.trim().length>0)`));
   for(const width of [375,768,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),path+' '+code+' overflow at '+width);
   }
   if(path==='/iletisim'){
    assert.equal(await evaluate(`document.querySelector('input[type=email]').dir`),'ltr');
    assert.ok(await evaluate(`document.querySelector('label span[data-i18n=name]').textContent.length>0`));
   }
  }
  await send('Page.reload');await until(()=>evaluate('!!document.querySelector("#language")'));
  assert.equal(await evaluate('document.documentElement.lang'),'fa');
  for(const path of ['/hakkinda','/kosullar','/gizlilik'])assert.ok(await evaluate(`!!document.querySelector('footer a[href="${path}"]')`));
 }
 await navigate('/hakkinda');await selectLanguage('en');
 await evaluate(`document.querySelector('#scope-toggle').click()`);
 assert.equal(await evaluate(`document.querySelector('#scope-content').hidden`),false);
 assert.equal(await evaluate(`document.querySelector('#scope-toggle').getAttribute('aria-expanded')`),'true');
 await navigate('/iletisim');assert.equal(await evaluate('document.documentElement.lang'),'en');
 await until(()=>evaluate(`document.querySelector('#contact-info').textContent.includes('Not provided yet')`));
 await evaluate(`document.querySelector('[name=name]').value='Demo';document.querySelector('[name=email]').value='demo@example.com';document.querySelector('[name=subject]').value='Demo subject';document.querySelector('[name=message]').value='Example';document.querySelector('#contact-form').requestSubmit();`);
 assert.ok(await evaluate(`document.querySelector('#contact-result').textContent.includes('no message was sent')`));
 assert.equal(await evaluate(`document.querySelector('[name=name]').value`),'');
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:true});
 await selectLanguage('ar');await evaluate(`document.querySelector('#menu-toggle').click()`);
 assert.equal(await evaluate(`document.querySelector('#menu-toggle').getAttribute('aria-expanded')`),'true');
 assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
 await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`);
 assert.equal(await evaluate(`document.querySelector('#menu-toggle').getAttribute('aria-expanded')`),'false');
 await navigate('/araclar');await selectLanguage('tr');
 await until(()=>evaluate(`document.querySelector('#brand')?.options.length===38`));
 await evaluate(`document.querySelector('#brand').value='BMW';document.querySelector('#brand').dispatchEvent(new Event('input',{bubbles:true}));`);
 assert.equal(await evaluate(`document.querySelector('#count').textContent`),'5 model');
 await evaluate(`document.querySelector('#grid [data-favorite]').click();`);
 assert.equal(await evaluate(`document.querySelector('#fav-count').textContent`),'1');
 await evaluate(`for(let i=0;i<3;i++)document.querySelectorAll('#grid [data-compare]')[i].click();document.querySelector('#compare-open').click();`);
 assert.equal(await evaluate(`document.querySelector('#comparison').open`),true);
 await evaluate(`document.querySelector('#comparison').close()`);
 await selectLanguage('fa');await navigate('/araclar?brand=BMW');
 await until(()=>evaluate(`document.querySelector('#count')?.textContent==='5 model'`));
 assert.equal(await evaluate('document.documentElement.lang'),'fa');
 assert.equal(await evaluate(`document.querySelector('#fav-count').textContent`),'1');
 for(const width of [375,768,1440]){await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'catalog RTL overflow '+width);}
 await navigate('/hakkinda');await selectLanguage('ar');
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:true});
 await mkdir(join(root,'..','docs','proofs'),{recursive:true});
 await writeFile(join(root,'..','docs','proofs','rtl-mobile.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 assert.deepEqual(errors,[]);
 console.log('PASS: 4 information pages × 4 languages × 3 widths; RTL, reload, navigation, demo form, email LTR, scope toggle, mobile menu, Turkish catalog search, favorites and comparison. No browser exceptions.');
}finally{
 ws?.close();browser?.kill();server?.kill();await delay(500);await rm(temp,{recursive:true,force:true,maxRetries:5,retryDelay:200});
}
