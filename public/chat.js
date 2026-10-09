import {emptyFilters} from './search.js';

export function initializeChat({request,readFilters,applyFilters,resetFilters}) {
  const $=selector=>document.querySelector(selector);
  const input=$('#chat-input'),messages=$('#chat-messages'),form=$('#chat-form');
  let busy=false,mode='basic';
  const welcome='Merhaba! Bütçeni ve kilometre aralığını yazabilirsin. Alman veya Japon gibi bir marka kökeni, otomatik vites ya da şehir tercihi de ekleyebilirsin.';
  function append(role,text){messages.hidden=false;const bubble=document.createElement('div');bubble.className='chat-message '+role;const label=document.createElement('strong');label.textContent=role==='user'?'Sen':'OTOİZ araç asistanı';bubble.append(label,document.createTextNode(text));messages.append(bubble);while(messages.children.length>16)messages.firstElementChild.remove();messages.scrollTop=messages.scrollHeight;}
  function setMode(next,notice){mode=next;$('#chat-mode').textContent=next==='ai'?'Yapay zekâ':'Temel arama';$('#chat-status').textContent=notice||(next==='ai'?'Mesajın arama tercihlerini anlamak için yapay zekâyla işlenir.':'Temel Türkçe arama etkin. Bütçe ve kilometre gibi açık ifadeler kullan.');}
  function setBusy(value){busy=value;$('#chat-send').disabled=value;$('#chat-send').textContent=value?'İlanlar aranıyor…':'İlanları bul';input.disabled=value;$('#chat-reset').disabled=value;document.querySelectorAll('[data-chat-example]').forEach(button=>button.disabled=value);messages.setAttribute('aria-busy',String(value));}
  function sync(filters=readFilters()){
    const holder=$('#chat-filters');holder.replaceChildren();
    const n=value=>new Intl.NumberFormat('tr-TR').format(value);
    const labels=[];
    for(const [key,label] of [['origin','Marka kökeni'],['brand','Marka'],['model','Model'],['city','Şehir'],['body','Kasa'],['fuel','Yakıt'],['gear','Vites']])if(filters[key])labels.push(`${label}: ${filters[key]}`);
    for(const [min,max,label,unit] of [['minPrice','maxPrice','Fiyat','₺'],['minKm','maxKm','Kilometre','km'],['minYear','maxYear','Yıl','']]){
      if(filters[min]!=null||filters[max]!=null)labels.push(`${label}: ${filters[min]!=null?n(filters[min]):'0'}–${filters[max]!=null?n(filters[max]):'sınırsız'} ${unit}`.trim());
    }
    const sorts={'price-asc':'Fiyat: düşükten yükseğe','price-desc':'Fiyat: yüksekten düşüğe',km:'Kilometre: düşükten yükseğe',year:'Model yılı: yeniden eskiye'};if(sorts[filters.sort])labels.push(sorts[filters.sort]);
    holder.hidden=!labels.length;
    for(const label of labels){const chip=document.createElement('span');chip.textContent=label;holder.append(chip);}
    if(filters.origin){const note=document.createElement('small');note.textContent='Marka kökeni, aracın üretildiği ülkeyi ifade etmez.';holder.append(note);}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy||!input.value.trim())return;
    const message=input.value.trim();const current=readFilters();
    $('#chat-error').hidden=true;
    if(!messages.children.length)append('assistant',welcome);
    append('user',message);setBusy(true);
    try{
      const result=await request('/assistant/search',{method:'POST',body:JSON.stringify({message,filters:current}),signal:AbortSignal.timeout(22000)});
      await applyFilters(result.filters);
      append('assistant',result.reply);setMode(result.mode,result.notice);sync();input.value='';
    }catch(error){$('#chat-error').textContent=error.name==='TimeoutError'?'Arama beklenenden uzun sürdü. Tercihlerin korundu; tekrar deneyebilirsin.':error.message;$('#chat-error').hidden=false;}
    finally{setBusy(false);input.focus();}
  });
  input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();form.requestSubmit();}});
  document.querySelectorAll('[data-chat-example]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.chatExample;form.requestSubmit();}));
  $('#chat-reset').addEventListener('click',()=>{messages.replaceChildren();messages.hidden=true;input.value='';$('#chat-error').hidden=true;resetFilters();sync(emptyFilters());setMode(mode);input.focus();});
  request('/assistant/config').then(config=>setMode(config.mode)).catch(()=>{setMode('basic','Asistana ulaşılamıyor. Sunucunun çalıştığından emin ol.');});
  return {sync};
}
