# OTOİZ — Marka ve Tasarım Kılavuzu

## Renkler ve kontrast
Tek uygulama kaynağı public/brand.css içindeki :root ve :root[data-theme=dark] tokenlarıdır. Mevcut tema mekanizması korunur. Tablo WCAG bağıl parlaklık formülüyle hesaplanmıştır; ink ve muted bg ile, on-accent buton metni accent ile karşılaştırılır. İlk koyu buton metni 4.14:1 idi; aşağıdaki tokenlarla AA düzeyine düzeltildi. Accent bağlantı metni bg üzerinde açık 4.58:1, koyu 8.75:1.

| Token | Açık hex | Koyu hex | Kullanım | Açık / koyu kontrast |
|---|---|---|---|---|
| --accent | #236cde | #82b4ff | Metin / kontrol | 4.92:1 (buton metni) / 8.75:1 (buton metni) |
| --on-accent | #ffffff | #101416 | Metin / kontrol | 4.92:1 (buton metni) / 8.75:1 (buton metni) |
| --green | #b2d0ff | #b2d0ff | Yüzey / kenar | Metin tokenı değil |
| --bg | #f7f7f4 | #101416 | Yüzey / kenar | Metin tokenı değil |
| --panel | #ffffff | #191e21 | Yüzey / kenar | Metin tokenı değil |
| --ink | #202326 | #f0f2ed | Metin / kontrol | 14.71:1 / 16.43:1 |
| --muted | #596164 | #a0a9aa | Metin / kontrol | 5.90:1 / 7.72:1 |
| --line | #e0e3df | #30383a | Yüzey / kenar | Metin tokenı değil |
| --wash | #ebeeea | #20282a | Yüzey / kenar | Metin tokenı değil |
| --dark | #171c1e | #171c1e | Yüzey / kenar | Metin tokenı değil |

## Logo, tipografi ve ikonlar
OTOİZ logoları public/logo-light.svg ve public/logo-dark.svg; favicon public/favicon.svg. Arial/Helvetica/sans-serif ve --radius:14px mevcut tasarıma uygundur. Türkçe, Arapça ve Farsçada sistem yazı tipi yedeği kullanılır. Renkleri yeni dosyalarda sabit hex ile tekrar etme.

Web manifestinde 192 ve 512 px PNG; iPhone için 180 px Apple Touch Icon mevcut. Bunlar web/PWA ikonlarıdır. Tauri macOS .icns, Windows .ico, Linux PNG seti, Android mipmap ve iOS AppIcon native setleri mevcut değildir; görev 05'in native ikon ve tauri.conf.json şartları eksiktir. Yeni Tauri projesi varmış gibi dosya üretilemez.

## Tauri uygulamasındaki karşılığı

Marka renkleri Tauri / Astro uygulamasında `src/styles/app.css` içindeki değişkenlerle kullanılır. Değerler `otoiz/public/brand.css` ile aynıdır.

| `brand.css` | `src/styles/app.css` | Açık | Koyu (`data-tema="gece"`) |
|---|---|---|---|
| `--accent` | `--renk-ana` | `#236cde` | `#82b4ff` |
| `--on-accent` | `--renk-ana-ustu` | `#ffffff` | `#101416` |
| `--bg` | `--zemin` | `#f7f7f4` | `#101416` |
| `--panel` | `--kart` | `#ffffff` | `#191e21` |
| `--ink` | `--yazi` | `#202326` | `#f0f2ed` |
| `--muted` | `--yazi-soluk` | `#596164` | `#a0a9aa` |
| `--line` | `--kenar` | `#e0e3df` | `#30383a` |
| `--dark` | `--renk-koyu` | `#171c1e` | `#171c1e` |

| Dosya | Kullanım |
|---|---|
| `public/otoiz-simge.svg` | Kare uygulama simgesi; üst barda ve tarayıcı simgesinde |
| `public/otoiz-logo-light.svg`, `public/otoiz-logo-dark.svg` | Yazılı logo (açık ve koyu zemin) |
| `public/favicon.png`, `public/apple-touch-icon.png` | Simgeden üretilen 128 px ve 180 px dosyalar |
| `src-tauri/icons/` | `bun run tauri icon` ile üretilen macOS, Windows, Linux, iOS ve Android ikon setleri |

`src-tauri/tauri.conf.json`: ürün adı `OTOIZ` (paket ve dosya adlarında sorun çıkmaması için ASCII), kimlik `edu.istinye.otoiz`, pencere başlığı `OTOİZ — Otomobil Platformu`.
