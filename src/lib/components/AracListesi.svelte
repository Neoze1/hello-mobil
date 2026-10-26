<script lang="ts">
 import Kart from './ui/Kart.svelte';
 import Yukleniyor from './ui/Yukleniyor.svelte';
 import BosDurum from './ui/BosDurum.svelte';
 import HataDurumu from './ui/HataDurumu.svelte';
 import {araclar} from '../veri/ornek';
 let {dil='tr'}:{dil?:'tr'|'en'|'ar'|'fa'}=$props();
 const ceviri={tr:{ara:'Araç ara',bos:'Araç bulunamadı',acik:'Başka bir arama dene.',temiz:'Filtreyi temizle',hata:'Araçlar yüklenemedi.',dene:'Tekrar dene',yuk:'Araçlar yükleniyor',not:'Eğitim amaçlı örnek veriler'},en:{ara:'Search cars',bos:'No cars found',acik:'Try another search.',temiz:'Clear filter',hata:'Could not load cars.',dene:'Retry',yuk:'Loading cars',not:'Sample data for learning'},ar:{ara:'ابحث عن سيارة',bos:'لا توجد سيارات',acik:'جرّب بحثًا آخر',temiz:'مسح البحث',hata:'تعذّر تحميل السيارات',dene:'إعادة المحاولة',yuk:'جار تحميل السيارات',not:'بيانات تجريبية للتعليم'},fa:{ara:'جستجوی خودرو',bos:'خودرویی یافت نشد',acik:'جستجوی دیگری انجام دهید',temiz:'پاک کردن فیلتر',hata:'بارگیری خودروها ناموفق بود',dene:'تلاش دوباره',yuk:'در حال بارگیری',not:'داده نمونه آموزشی'}};
 let t=$derived(ceviri[dil]);
 let q=$state('');let durum=$state<'yukleniyor'|'hata'|'bos'|'dolu'>('dolu');
 let sonuc=$derived(araclar.filter(a=>`${a.marka} ${a.model}`.toLocaleLowerCase('tr').includes(q.toLocaleLowerCase('tr'))));
 function yeniden(){durum='dolu'}
</script>
<section class="liste" dir={dil==='ar'||dil==='fa'?'rtl':'ltr'}>
 <label>{t.ara}<input bind:value={q} placeholder={t.ara} /></label>
 <small>{t.not}</small>
 {#if durum==='yukleniyor'}<Yukleniyor metin={t.yuk}/>
 {:else if durum==='hata'}<HataDurumu mesaj={t.hata} tekrarMetni={t.dene} onclick={yeniden}/>
 {:else if durum==='bos'||sonuc.length===0}<BosDurum baslik={t.bos} aciklama={t.acik} dugmeMetni={t.temiz} onclick={()=>{q='';durum='dolu'}}/>
 {:else}<div class="kartlar">{#each sonuc as arac (arac.id)}<Kart baslik={`${arac.marka} ${arac.model}`} altMetin={`${arac.yil} · ${arac.kilometre.toLocaleString('tr-TR')} km · ${arac.yakit}`} etiket={arac.vites} href={`/arac/${arac.id}?q=${encodeURIComponent(q)}`}/>{/each}</div>{/if}
</section>
<style>.liste{padding:var(--bosluk);max-width:1100px;margin:auto}.liste label{display:grid;gap:8px}.liste input{padding:12px;border:1px solid var(--kenar);border-radius:var(--radius);background:var(--kart)}small{display:block;margin:12px 0;color:var(--yazi-soluk)}.kartlar{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--bosluk)}</style>
