export type Yakit = 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG';
export type Vites = 'Otomatik' | 'Manuel';
export interface Arac {
  id: string; // Sabit benzersiz kimlik
  marka: string; // Üretici
  model: string; // Model adı
  yil: number; // Üretim/model yılı
  kilometre: number; // Toplam kilometre
  yakit: Yakit; // Yakıt seçeneği
  vites: Vites; // Şanzıman seçeneği
  gorsel?: string; // İsteğe bağlı görsel URL'si
}
