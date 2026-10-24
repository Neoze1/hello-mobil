import type { Arac } from './arac';
export type IlanDurumu = 'taslak' | 'yayinda' | 'kaldirildi';
export interface Ilan {
 id: string; // İlan kimliği
 aracId: Arac['id']; // İlgili araç
 baslik: string; // İlan başlığı
 fiyat: number; // Türk lirası cinsinden fiyat
 durum: IlanDurumu; // Yayın durumu
 saticiId: string; // Sahibi olan kullanıcı
 aciklama?: string; // İsteğe bağlı açıklama
}
