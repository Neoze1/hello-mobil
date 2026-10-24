export type KullaniciRolu = 'uye' | 'moderator' | 'yonetici';
export interface Kullanici {
 id: string; // Kullanıcı kimliği
 ad: string; // Görünen ad (örnek veri)
 rol: KullaniciRolu; // Sabit rol seçenekleri
 dogrulandi: boolean; // E-posta doğrulama durumu
 avatar?: string; // İsteğe bağlı profil görseli
}
