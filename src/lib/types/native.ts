export type NativeHataKodu = 'GECERSIZ_KIMLIK' | 'PLATFORM_DESTEKLENMIYOR' | 'KOMUT_HATASI';
export interface AracKontrolVerisi {
 id: string; // Kontrol edilen araç kimliği
 gecerli: boolean; // Geçerli kimlik sonucu
}
export interface NativeHata { kod: NativeHataKodu; mesaj: string; }
export type NativeSonuc<T> = { ok: true; veri: T } | { ok: false; hata: NativeHata };
