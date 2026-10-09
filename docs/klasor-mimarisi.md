# Klasör Mimarisi

Bu belge dizin yapısının tek kaynağıdır. Mevcut Node.js projesinde gereksiz taşıma yapılmaz.

```text
OTOİZ/
├── package.json       # Node sürümü ve start/check/test komutları
├── server.mjs         # HTTP, API, yetkilendirme, izinli statik dosyalar
├── catalog.mjs        # Kimlikleri koruyan katalog dönüşümü
├── assistant.mjs      # Türkçe arama ve isteğe bağlı AI
├── public/            # HTML, CSS, JS, logo, PWA ikonları ve araç görselleri
├── catalogs/          # Paylaşılabilir kaynak katalog, görsel/fiyat kanıtları
├── scripts/           # Doğrulama ve katalog dışa aktarma araçları
├── docs/              # Kanonik proje, marka, mimari ve teslim belgeleri
├── data/              # Özel hesap/ilan verileri; Git ve teslim dışında
└── .env               # Yerel sırlar; Git ve teslim dışında
```

Hocanın Astro/Tauri mimarisindeki layouts, pages, components, lib, types, styles ve src-tauri klasörleri OTOİZ'de mevcut değildir. HTML sayfaları public/ içinde, iş mantığı ES modüllerinde ve sunucuda, ortak stiller public/brand.css içinde tutulur. Sahte src/pages veya tauri yapılandırması eklenmez. hello-mobil aktarımında bu uygulama otoiz/ altında korunur; deponun mevcut Astro/Tauri kaynakları yerinde kalır. Teslim deposunda kanonik dokümanlar depo kökündeki docs/ altında, uygulama otoiz/ altında yer alır.
