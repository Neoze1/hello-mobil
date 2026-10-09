const installButton=document.querySelector('#install-app');
let pendingInstall=null;
if('serviceWorker' in navigator&&window.isSecureContext){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(error=>console.warn('Çevrimdışı ekran kaydedilemedi:',error.name)));
}
window.addEventListener('beforeinstallprompt',event=>{if(!installButton)return;event.preventDefault();pendingInstall=event;installButton.hidden=false;});
installButton?.addEventListener('click',async()=>{if(!pendingInstall)return;installButton.disabled=true;try{await pendingInstall.prompt();await pendingInstall.userChoice;}finally{pendingInstall=null;installButton.hidden=true;installButton.disabled=false;}});
window.addEventListener('appinstalled',()=>{pendingInstall=null;if(installButton){installButton.hidden=true;installButton.disabled=false;}});
document.querySelector('#mobile-new-listing')?.addEventListener('click',()=>document.querySelector('#new-listing').click());
document.querySelector('#mobile-account')?.addEventListener('click',()=>document.querySelector('#account-button').click());
