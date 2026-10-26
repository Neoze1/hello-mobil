import type { Arac, Ilan, Kullanici } from '../types';
// Yalnız geliştirme ve Görev 11 gösterimi için tamamen kurgu kayıtlar.
export const araclar: Arac[] = [
 {id:'arac-1',marka:'Toyota',model:'Corolla',yil:2021,kilometre:44000,yakit:'Benzin',vites:'Otomatik'},
 {id:'arac-2',marka:'Volkswagen',model:'Golf',yil:2020,kilometre:65000,yakit:'Dizel',vites:'Manuel'},
 {id:'arac-3',marka:'Renault',model:'Clio',yil:2022,kilometre:29000,yakit:'Benzin',vites:'Otomatik'},
 {id:'arac-4',marka:'Hyundai',model:'Ioniq 5',yil:2023,kilometre:18000,yakit:'Elektrik',vites:'Otomatik'},
 {id:'arac-5',marka:'Honda',model:'Civic',yil:2019,kilometre:88000,yakit:'Benzin',vites:'Manuel'},
 {id:'arac-6',marka:'Toyota',model:'C-HR',yil:2022,kilometre:32000,yakit:'Hibrit',vites:'Otomatik'},
];
export const kullanicilar: Kullanici[] = Array.from({length:6},(_,i)=>({id:`ornek-kullanici-${i+1}`,ad:`Örnek kullanıcı ${i+1}`,rol:i===0?'yonetici':'uye',dogrulandi:false}));
export const ilanlar: Ilan[] = araclar.map((a,i)=>({id:`ilan-${i+1}`,aracId:a.id,baslik:`${a.marka} ${a.model}`,fiyat:750000+i*150000,durum:'yayinda',saticiId:kullanicilar[i].id,aciklama:'Eğitim amaçlı kurgusal ilan; gerçek satış teklifi değildir.'}));
