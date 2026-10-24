
# OTOİZ — Görev Şartnamesi

## 1. Proje Amacı
OTOİZ, kullanıcıların ikinci el otomobil ilanlarını inceleyebildiği, araçları marka ve model bilgilerine göre filtreleyebildiği bir otomobil ilan platformudur.

Proje, MYO063 Mobil Programlama dersi kapsamında Astro, Svelte, TypeScript ve Tauri/Rust teknolojileri kullanılarak geliştirilmektedir.

## 2. Proje Kapsamı
- Otomobil ilanlarının listelenmesi
- Marka ve model bazlı filtreleme
- Araç detaylarının görüntülenmesi
- Tekrar kullanılabilir arayüz bileşenleri
- TypeScript veri modelleri
- Rust tabanlı masaüstü altyapısı
- Türkçe, İngilizce, Arapça ve Farsça dil desteği
- SQLite tabanlı arka uç ve yönetim paneli geliştirme çalışmaları

## 3. Kapsam Dışı
- Gerçek para ile ödeme altyapısı
- Resmî araç devir işlemleri
- Banka veya kredi entegrasyonları
- Gerçek kullanıcı verilerinin izinsiz kullanımı

## 4. Çalışma Yöntemi
1. Her görev için ayrı bir Git dalı oluşturulur.
2. Görev gereksinimleri incelenir.
3. Geliştirme sırasında kullanılan yapay zekâ istemleri docs/istemler/ klasörüne kaydedilir.
4. Mevcut çalışan özellikler korunarak geliştirme yapılır.
5. Kodlar test edilir.
6. GitHub üzerinde Pull Request oluşturulur.
7. PR incelendikten sonra master dalına birleştirilir.

## 5. Kabul Ölçütleri
- İlgili görevde istenen dosyalar oluşturulmalıdır.
- Kod mevcut projeyle uyumlu çalışmalıdır.
- Test ve derleme kontrolleri başarılı olmalıdır.
- Görev ayrı bir Git dalında geliştirilmelidir.
- Pull Request geçmişi GitHub üzerinde görünür olmalıdır.
- Göreve ait istem günlüğü bulunmalıdır.

## 6. Dokümantasyon
- docs/tasks/week-4/ — Batch 02 görevleri
- docs/istemler/ — Yapay zekâ istem günlükleri
- docs/veri-modeli.md — Veri sözleşmeleri
- docs/platform-destegi.md — Platform desteği
- docs/ilerleme-batch-02.md — Batch 02 ilerleme raporu

## 7. Güvenlik Kuralları
- Şifre ve erişim anahtarları GitHub'a yüklenmez.
- .env dosyaları commit edilmez.
- Gerektiğinde .env.example kullanılır.
- Kişisel veriler ve özel ders raporları repoya eklenmez.

## 8. Teslim
Batch 02 geliştirmeleri tamamlandıktan sonra v0.2.0-batch-02 etiketi oluşturulur.

Son teslim tarihi: 27 Ekim 2026, 23:59.
