export type EtiketTuru = 'bilgi' | 'basari' | 'uyari' | 'hata';
export interface KartGirdisi {
 baslik: string; // Kart başlığı
 altMetin?: string; // Açıklama
 gorsel?: string; // İsteğe bağlı görsel
 etiket?: string; // İsteğe bağlı rozet
 etiketTuru?: EtiketTuru; // Rozet tipi
 href?: string; // Kartın gidilecek adresi
}
