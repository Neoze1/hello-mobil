# Klasör Mimarisi

Bu belge dizin yapısının tek kaynağıdır. OTOİZ kaynak kataloğu ile kök Astro/Tauri kullanıcı arayüzü ayrıdır; kaynak dosyalar kopyalanmadan değiştirilmez.

```text
repository/
├── package.json, astro.config.mjs, bun.lock  # Astro/Tauri geliştirme komutları
├── src/pages/                                # OTOİZ rotaları ve ana sayfa
├── src/components/OtoizDocument.astro        # otoiz/public HTML sayfalarını Astro'ya bağlar
├── public/                                   # Tarayıcı varlıkları ve build'de üretilen katalog.json
├── src-tauri/                                # Tauri v2 kabuk/yapılandırma
├── otoiz/server.mjs                          # Ayrı Node API ve tam web sunucusu
├── otoiz/catalog.mjs                         # Kaynak veriden kimlikleri koruyan katalog dönüşümü
├── otoiz/public/                             # Kanonik OTOİZ HTML, CSS, JS ve görsel kaynağı
├── otoiz/catalogs/                           # Katalog, lisans, fotoğraf ve fiyat kanıtları
├── otoiz/scripts/                            # Kontroller, export ve build-web-catalog.mjs
├── docs/                                     # Kanonik proje, marka, mimari ve teslim belgeleri
├── otoiz/data/                               # Özel hesap/ilan verileri; Git ve teslim dışında
└── otoiz/.env                                # Yerel sırlar; Git ve teslim dışında
```

Kök `/`, `/araclar` ve bilgi rotaları Astro'nun statik çıktısıdır. `bun run build` öncesi `otoiz/scripts/build-web-catalog.mjs`, `otoiz/catalog.mjs` verilerinden `public/catalog.json` üretir; `.gitignore` bu dosyayı dışarıda tutar. Kök `public/` içindeki OTOİZ varlıkları `otoiz/public/` kaynağıyla eş tutulur. Tauri statik web arayüzünü açar; Node API'sini veya kalıcı hesap/ilan hizmetlerini başlatmaz.
