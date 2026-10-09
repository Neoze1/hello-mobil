const CACHE='otoiz-offline-v2';
const offlineAssets=['/offline.html','/offline.css','/favicon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(offlineAssets))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('vitra-offline-')||key.startsWith('otoiz-offline-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
  if(request.mode==='navigate')event.respondWith(fetch(request).catch(()=>caches.match('/offline.html')));
  else if(offlineAssets.includes(url.pathname))event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
