# OTOİZ veri modeli — eğitim örnekleri
| Tip | Temel alanlar | İlişki |
|---|---|---|
| `Arac` | `id`, `marka`, `model`, `yil`, `kilometre`, `yakit`, `vites`, `gorsel?` | `Ilan.aracId` ile bağlı |
| `Ilan` | `id`, `aracId`, `baslik`, `fiyat`, `durum`, `saticiId`, `aciklama?` | Araç ve kullanıcı referansı |
| `Kullanici` | `id`, `ad`, `rol`, `dogrulandi`, `avatar?` | `Ilan.saticiId` ile bağlı |

Durum, yakıt ve roller union tipleri ile sınırlandırılır. `src/lib/veri/ornek.ts` içindeki altışar kayıt tamamen kurgusaldır. Mevcut katalog/API verileri değiştirilmez.
