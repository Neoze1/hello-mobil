# OTOİZ — Otomobil Platformu

Otomobil modellerini keşfet, karşılaştır ve kullanıcı ilanlarını incele.

[![İstinye Üniversitesi](otoiz/public/isu-logo.svg)](https://www.istinye.edu.tr)

[![Node.js](https://img.shields.io/badge/Node.js-22%2B-43853d)](https://nodejs.org) [![JavaScript](https://img.shields.io/badge/JavaScript-ES_modules-f7df1e)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![MYO063](https://img.shields.io/badge/MYO063-2026_Guz-002855)](https://www.istinye.edu.tr)

## İçindekiler
- [Akademik bilgiler](#akademik-bilgiler)
- [Kurulum](#kurulum)
- [Çalıştırma ve test](#çalıştırma-ve-test)
- [Özellikler ve sayfalar](#özellikler-ve-sayfalar)
- [Dil desteği](#dil-desteği)
- [Belgeler](#belgeler)
- [Sınırlamalar ve lisans](#sınırlamalar-ve-lisans)

## Akademik bilgiler
İstinye Üniversitesi · MYO063 Mobil Programlama · 2026–2027 Güz.
Öğrenci: **Ediz Davutoğlu — 2520171018**. Eğitmen: [Keyvan Arasteh](https://github.com/keyvanarasteh). İletişim: [GitHub Neoze1](https://github.com/Neoze1); kişisel e-posta paylaşılmadı.

## Kurulum
Astro/Tauri katalog arayüzü için Bun ve Rust araç zinciri gerekir. Node API'si ve mevcut Node web sunucusu için Node.js **22 veya üzeri** gerekir.

```powershell
git clone https://github.com/Neoze1/hello-mobil.git
cd hello-mobil
bun install
bun run tauri dev
```

OTOİZ'in kanonik veri, HTML ve istemci kodu otoiz/ altında; Astro/Tauri sayfaları ve Tauri kabuğu depo kökündedir. `bun run build` üretim derlemesini çalıştırır. Tauri görünümü statik katalog ve bilgi sayfalarını açar; Node API'si Tauri sürecinde başlatılmaz.

## Çalıştırma ve test
```powershell
npm start
npm run check
npm test
npm run check:docs
npm run test:browser
```
`npm start`, API özelliklerini içeren ayrı Node sunucusunu `http://localhost:3000` adresinde çalıştırır. `PORT` portu, `VITRA_HOST` dinleme adresini değiştirir. Windows'ta otoiz/BASLAT.cmd bu sunucuyu başlatır. Taşınabilir Node yerelde varsa .\node.exe --env-file-if-exists=.env server.mjs uygulamanın otoiz/ dizininden kullanılabilir; node.exe teslim edilmez. Tarayıcı testi Edge/Chrome gerektirir; BROWSER_PATH ile tarayıcı yolu belirtilebilir.

Tauri içindeki `/ilanlar.html` Node API erişilemediğinde demo ilanlarıyla “Önizleme modu” gösterir. Hesap açma/giriş, kalıcı ilan ve ilan favorileri, satıcı telefonunu gösterme, ilan raporlama, asistan API'si ve yapılandırılmış iletişim bilgileri için ayrı Node sunucusu gerekir; bu özellikler statik Tauri webview içinde etkin değildir.
otoiz/.env.example dosyasını otoiz/.env olarak kopyalamak isteğe bağlıdır. OPENAI_API_KEY sunucuda tutulur; anahtar yoksa Türkçe temel araç araması çalışır. API çağrıları ücretlidir.

## Özellikler ve sayfalar
37 marka, 178 model; kaynaklı görseller, filtreleme, yerel katalog favorileri, üçlü karşılaştırma, açık/koyu tema. Üyelik, fotoğraflı ilan, ilan favorileri ve sahiplik kontrolü mevcut.

| Adres | İşlev |
|---|---|
| / | Ana Sayfa |
| /araclar | Araç kataloğu |
| /ilanlar.html | Üyelik ve satıcı ilanları |
| /hakkinda | Proje amacı ve etkileşimli kapsam bilgisi |
| /iletisim | İletişim ve açıkça işaretlenmiş demo form |
| /kosullar | Kullanım koşulları |
| /gizlilik | Veri ve gizlilik açıklaması |

## Dil desteği
Bilgi sayfaları ve ortak menü TR/EN/AR/FA; Arapça ve Farsça RTL. Dil seçimi otoiz-language ile korunur. Araç araması ve ilan arayüzünün ayrıntıları Türkçedir; marka/model isimleri, katalog kimlikleri ve filtre değerleri çevrilmez. Tema ve eski VITRA_* teknik anahtarları veri uyumluluğu için korunur.

## Belgeler
[Belge indeksi](docs/index.md), [proje fikri](docs/proje-fikri.md), [klasör mimarisi](docs/klasor-mimarisi.md), [sayfa ve platform haritası](docs/mimari-agac.md), [marka kuralları](docs/branding.md), [görevler](docs/tasks/week-3/), [ajan kuralları](AGENTS.md), [teslim kontrolü](docs/teslim-batch-01.md).

## Sınırlamalar ve lisans
Yerel eğitim uygulaması; ödeme, doğrulanmış ekspertiz, SMS ve moderasyon yok. Hesaplar ve ilanlar data/database.json içinde sunucuda saklanır. Bu özel klasör Git ve teslimden hariçtir. İletişim demo formu mesaj iletmez; e-posta yapılandırılmışsa yalnızca taslak açar. Katalogda eksik fiyat ve bilgiler tahmin edilmez.
`bun run build` ve Windows Tauri geliştirme webview doğrulandı; yerel Tauri ikon seti mevcut, ancak MSI/EXE installer çıktısı ve Tauri içinde Node API sidecar henüz doğrulanmadı/eklenmedi. Kaynak deponun [Apache-2.0 lisansı](LICENSE) korunmuştur; görsellerin kendi lisansları ayrıca geçerlidir. Fotoğrafların kaynak ve lisansları [kaynak belgesinde](otoiz/catalogs/FOTOGRAF-KAYNAKLARI.md) tutulur; kaynak depodaki lisans aktarım sırasında korunur.
