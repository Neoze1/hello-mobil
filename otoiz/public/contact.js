import {t} from './i18n.js';
const info=document.querySelector('#contact-info'),form=document.querySelector('#contact-form');
let contact={},failed=false,resultKey='';
function render(){
 info.replaceChildren();
 if(failed)info.textContent=t('loadError');
 else for(const key of ['email','phone','address']){
  const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
  dt.textContent=t(key);dd.textContent=contact[key]||t('unavailable');
  if(['email','phone'].includes(key))dd.dir='ltr';
  div.append(dt,dd);info.append(div);
 }
 const button=form.querySelector('button');button.dataset.i18n=contact.email?'draftSend':'demoSend';button.textContent=t(button.dataset.i18n);
 if(resultKey)document.querySelector('#contact-result').textContent=t(resultKey);
}
document.addEventListener('otoiz:language',render);
async function load(){try{const response=await fetch('/api/contact');if(!response.ok)throw new Error('Contact unavailable');contact=await response.json();}catch{failed=true;}render();}
form.addEventListener('input',()=>{resultKey='';document.querySelector('#contact-result').textContent='';});
form.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const data=new FormData(form);
 if(contact.email){
  const subject='OTOİZ — '+data.get('subject');const body=`${t('name')}: ${data.get('name')}\n${t('email')}: ${data.get('email')}\n\n${data.get('message')}`;
  location.href=`mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;resultKey='draftResult';
 }else{resultKey='demoResult';form.reset();}
 document.querySelector('#contact-result').textContent=t(resultKey);
});
load();
