# AGENTS.md — OTOİZ

## Amaç ve tek kaynak kuralı
OTOİZ katalog ve ilan platformudur. [Proje fikrini](docs/proje-fikri.md) ve [README komutlarını](README.md) esas al. Belgeleri, renk tablolarını ve mimari ağaçları tekrar etme; tek kaynağa bağlantı ver.

| Belge | Kapsam ve bağlayıcı kural |
|---|---|
| [docs/index.md](docs/index.md) | Tüm kanonik belgelerin indeksi |
| [docs/proje-fikri.md](docs/proje-fikri.md) | Veri modeli ve içerik proje amacına uymalı |
| [docs/klasor-mimarisi.md](docs/klasor-mimarisi.md) | Klasör düzeninin tek kaynağı; ağacı başka belgeye kopyalama |
| [docs/branding.md](docs/branding.md) | Renk değişiminden önce oku; yalnızca mevcut CSS tokenlarını kullan |
| [docs/mimari-agac.md](docs/mimari-agac.md) | Sayfa eklemeden önce oku; rota ve navigasyonu bu haritaya ekle |
| [docs/teslim-batch-01.md](docs/teslim-batch-01.md) | Gerçek doğrulama, PR/merge kanıtı ve eksikler |
| [docs/tasks/week-3/](docs/tasks/week-3/) | Hocanın kaynak görevleri; teknoloji farkları gizlenmez |
| [docs/ilerleme-batch-01.md](docs/ilerleme-batch-01.md) | Batch 01 kontrol matrisi ve derleme kanıtı |
| [docs/ajan-uyum-testi.md](docs/ajan-uyum-testi.md) | Ajan uyum testi kaydı |

## Mimari ve kod kuralları
OTOİZ'in veri ve iş mantığı kaynağı otoiz/ altında kalır: otoiz/catalog.mjs, otoiz/catalogs/ ve otoiz/public/. Astro/Tauri ana yüzeyi src/pages/index.astro ve OtoizDocument bileşenidir; tarayıcıya sunulan kopyalar public/ altında tutulur, public/catalog.json otoiz/scripts/build-web-catalog.mjs tarafından üretilir ve Git'e eklenmez. Bun run dev/build bu statik katalog arayüzünü çalıştırır. otoiz/server.mjs ayrı Node.js 22+ API'sidir; Tauri içine dahil değildir. Hesap, kalıcı ilan, ilan favorisi, satıcı telefonu, rapor ve AI asistanı API gerektirir; statik Tauri görünümünde çalışıyor gibi sunulmaz. Gereksiz teknoloji değişimi ve dosya taşıma yapma. Mevcut katalog kimliklerini, API filtre değerlerini, VITRA_* ortam değişkenlerini ve vitra-* / otoiz-* yerel depolama anahtarlarını koru.

## Git ve doğrulama
Her görev için feature/<numara>-<isim> dalı oluştur. Ana dala doğrudan commit atma. npm run check ve npm test çalıştır; diff'i incele, conventional commit yap, PR aç ve kontroller geçince merge et. Ana dalı git üzerinden belirle. Force push, reset --hard ve geçmişi yeniden yazma yapma. Test sunucusu VITRA_HOST=127.0.0.1 ve geçici veri klasörü kullanmalı; normal yayın ayarlarını değiştirme. Yapılmayan PR, build veya merge'i yapılmış gösterme.

## Çeviri, RTL ve erişilebilirlik
Bilgi sayfalarında TR/EN/AR/FA, AR/FA için html lang ve dir=rtl kullan. Dil sayfalar arasında ve yenilemede korunmalı; localStorage hataları uygulamayı durdurmamalı. Metinleri textContent ile yerleştir, form label/aria ve klavye odaklarını koru. Yönlü ikonları ve CSS mantıksal yönlerini kontrol et; e-posta, URL ve sayıları LTR izole et. Türkçe araç araması ve marka/model adları değişmez. 375, 768 ve 1440 px görünümü doğrula.

## Veri ve kapsam
Eksik fiyat, öğrenci veya ekip bilgisini uydurma. Gizlilik metni gerçek sunucu depolamasını açıklamalı. .env, anahtarlar, data/, node_modules/, taşınabilir araçlar ve ZIP dosyalarını commit etme. Node'un izinli statik dosyalarını server.mjs listesine ekle; Astro rotaları ve public varlıkları Astro build'de doğrula. Hoca/ekip daveti veya mesaj gönderimi kullanıcı açıkça istemedikçe yapılmaz.

- [docs/kaynaklar.md](docs/kaynaklar.md) — önceki kaynak taslağının kanonik yönlendirmesi.

- [docs/kurallar.md](docs/kurallar.md) — önceki kaynak taslağının kanonik yönlendirmesi.

- [docs/kurulum.md](docs/kurulum.md) — önceki kaynak taslağının kanonik yönlendirmesi.

- [docs/teslim.md](docs/teslim.md) — önceki kaynak taslağının kanonik yönlendirmesi.
