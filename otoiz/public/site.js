const page=document.body.dataset.page||'home';
document.querySelectorAll('[data-page-link]').forEach(link=>{if(link.dataset.pageLink===page)link.setAttribute('aria-current','page');});
const menu=document.querySelector('#menu-toggle'),nav=document.querySelector('#main-menu');
function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))closeMenu();});
if(['contact','about','terms','privacy'].includes(page)){
 let theme;try{theme=JSON.parse(localStorage.getItem('vitra-theme'));}catch{}
 theme=theme|| (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;
 document.querySelector('#theme').onclick=()=>{theme=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('vitra-theme',JSON.stringify(theme));}catch{}};
}

const scopeToggle=document.querySelector('#scope-toggle');
scopeToggle?.addEventListener('click',()=>{const content=document.querySelector('#scope-content');content.hidden=!content.hidden;scopeToggle.setAttribute('aria-expanded',String(!content.hidden));});
