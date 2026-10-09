# OTOİZ — Ajan Uyum Testi

Görev 08'in son ölçütü: bir yapay zeka ajanına bir renk ve bir sayfa görevi verilir, `AGENTS.md` kurallarına uyup uymadığı denetlenir.

> Bu test 09.10.2026'da **eğitmen tarafında** yapıldı; öğrencinin kendi aracıyla yaptığı bir test değildir. Öğrenci aynı testi kendi aracıyla tekrarlayıp sonucu bu dosyaya eklemelidir.

## Verilen görevler

| Görev | İstenen | Sonuç |
|---|---|---|
| Renk görevi | OTOİZ renklerini Tauri uygulamasının `app.css` dosyasına taşı | Değerler `otoiz/public/brand.css` ile aynı; eşleme tablosu `docs/branding.md` içinde; yeni bileşenlerde sabit renk yok |
| Sayfa görevi | Bilgi sayfalarını MDX / Astro ile dört dilde kur | 16 sayfa üretildi; metinler mevcut çevirilerden alındı; `docs/mimari-agac.md` güncellendi; AR ve FA sayfaları `dir="rtl"` |

## Kural bazında denetim

| `AGENTS.md` kuralı | Uyuldu mu | Kanıt |
|---|---|---|
| Her iş ayrı dalda ve PR ile; `master`'a doğrudan commit yok | ✅ | `feature/05-otoiz-marka-tauri`, `feature/06-bilgi-sayfalari-astro`, `docs/09-batch-01-tamamlama` |
| Renk değişiminden önce `docs/branding.md` okunur; yalnız mevcut CSS değişkenleri kullanılır | ✅ | Bir yeni değişken eklendi (`--renk-ana-ustu`) ve belgeye yazıldı |
| Sayfa eklemeden önce `docs/mimari-agac.md` okunur; rota ve navigasyon uyumlu | ✅ | Tauri rotaları bölümü eklendi |
| Belgeler tekrarlanmaz, link edilir | ✅ | Yeni belgeler `AGENTS.md` ve `docs/index.md` indeksinde |
| Hocanın kaynak dosyaları değiştirilmez | ⚠️ | Şablonun `hakkinda.mdx` sayfası `/rehber` olarak yeniden adlandırıldı; içerik korundu |

## Bulgular

- **En önemli eksik:** OTOİZ'in asıl ekranları (katalog, model detayı, ilanlar, üyelik) hâlâ `otoiz/` altındaki Node.js uygulamasında. Tauri uygulamasının ana ekranları şablondaki bilet uygulaması. Hafta 04 görevleri (tipler, kart, liste, detay, Rust komutu) bu ekranları `src/` altına taşımak için kullanılmalı.
- `AGENTS.md` yalnız Node.js uygulamasını tarif ediyor; Tauri / Astro / Svelte tarafının komutları (`bun run dev`, `bun run tauri dev`, `bun run build`) ve kuralları eklenmeli.
- `README.md` kurulum bölümü `npm start` anlatıyor; Tauri uygulamasının kurulum adımları eklenmeli.
