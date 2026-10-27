import type { AracKontrolVerisi, NativeSonuc } from './types';
export type Platform='android'|'ios'|'macos'|'windows'|'linux'|'web';
export function platform(): Platform {
 if(typeof window==='undefined'||!('__TAURI_INTERNALS__' in window))return 'web';
 const ua=navigator.userAgent.toLowerCase();
 if(/android/.test(ua))return 'android';if(/iphone|ipad/.test(ua))return 'ios';
 if(/macintosh/.test(ua))return 'macos';if(/windows/.test(ua))return 'windows';if(/linux/.test(ua))return 'linux';return 'web';
}
export function destekleniyorMu(ozellik:'arac_kontrol'|'katalog'):boolean{return ozellik==='katalog'||platform()!=='web'}
export async function aracKontrol(id:string):Promise<NativeSonuc<AracKontrolVerisi>> {
 if(!id.trim())return {ok:false,hata:{kod:'GECERSIZ_KIMLIK',mesaj:'Araç kimliği boş olamaz.'}};
 if(!destekleniyorMu('arac_kontrol'))return {ok:false,hata:{kod:'PLATFORM_DESTEKLENMIYOR',mesaj:'Bu özellik masaüstü veya mobil uygulamada kullanılabilir.'}};
 try {const {invoke}=await import('@tauri-apps/api/core');return await invoke<NativeSonuc<AracKontrolVerisi>>('arac_kontrol',{id})}
 catch {return {ok:false,hata:{kod:'KOMUT_HATASI',mesaj:'Araç kontrolü tamamlanamadı.'}}}
}
