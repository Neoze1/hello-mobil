# Platform desteği (hedeflenen, cihaz testi bekliyor)
| Özellik | Android | iOS | macOS | Windows | Linux | Web |
|---|---|---|---|---|---|---|
| Statik katalog | hedef | hedef | hedef | hedef | hedef | var |
| `arac_kontrol` Rust komutu | hedef | hedef | hedef | hedef | hedef | yok |

Web'de Rust komutu gösterilmez; `destekleniyorMu` false döner. Web çağrısı yapılırsa çökmek yerine tanımlı hata döndürür. Tüm cihazlarda test yapılmadığı için 'destekleniyor' iddiası yerine 'hedef' yazıldı.
