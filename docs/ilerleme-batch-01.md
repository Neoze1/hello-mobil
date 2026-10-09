# OTOİZ — Batch 01 İlerleme Matrisi

Görev 09'daki dokuz maddelik kontrol matrisinin repodaki karşılığı. Durum 09.10.2026 itibarıyladır.

> **Kim yaptı** sütunu önemlidir: "eğitmen" yazan satırlar ilk değerlendirmede (09.10.2026) eksik olduğu için eğitmen tarafından eklendi. Bu satırların puanı değerlendirmede (`docs/k1/01.review.md`) kesilmiş olarak kalır.

| No | Kontrol | Durum | Kanıt | Kim yaptı |
|---|---|---|---|---|
| 1 | Fork ve `keyvanarasteh` collaborator daveti | ✅ | GitHub: `hello-mobil` fork'u; davet 09.10.2026 akşamı geldi | öğrenci |
| 2 | Blackboard'a kullanıcı adı ve fork linki | ✅ | Form 07.10.2026 23:59 | öğrenci |
| 3 | Proje fikri ve üç ekran | ✅ | [`proje-fikri.md`](proje-fikri.md) | öğrenci |
| 4 | Kurumsal README | ✅ | [`README.md`](../README.md); kurulum `otoiz/` uygulamasını anlatıyor | öğrenci |
| 5 | Üç ajan kural dosyası | ✅ | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | öğrenci |
| 6 | Markalama ve `app.css` renkleri | ✅ | [`branding.md`](branding.md); `src/styles/app.css`, ikon seti, favicon, üst bar ve `tauri.conf.json` [PR #12](https://github.com/Neoze1/hello-mobil/pull/12) | marka tanımı öğrenci; Tauri tarafı eğitmen |
| 7 | Bilgi sayfaları (MDX / Astro, 4 dil, RTL) | ✅ | `src/pages/` altında 16 sayfa [PR #13](https://github.com/Neoze1/hello-mobil/pull/13) | metinler ve çeviriler öğrenci; Astro / MDX'e taşıma eğitmen |
| 8 | Mimari ağaç ve platform matrisi | ✅ | [`mimari-agac.md`](mimari-agac.md) | öğrenci; Tauri rotaları bölümü eğitmen |
| 9 | `bun run build` 0 hata | ✅ | [`kanit/bun-run-build.txt`](kanit/bun-run-build.txt) | eğitmen |

## Derleme kanıtı

- `bun run build` çıktısı: [`kanit/bun-run-build.txt`](kanit/bun-run-build.txt) — **0 hata, 27 sayfa**.
- Profil ekranı ve bilgi sayfası bağlantıları (390×844): [`kanit/onizleme-profil.png`](kanit/onizleme-profil.png)
- Farsça Gizlilik sayfası, sağdan sola: [`kanit/onizleme-fa-gizlilik.png`](kanit/onizleme-fa-gizlilik.png)
- İngilizce İletişim sayfası: [`kanit/onizleme-en-iletisim.png`](kanit/onizleme-en-iletisim.png)
- Üç sayfada da yatay taşma ve konsol hatası yok.
- `otoiz/` tarafı: `node --test` 15/15 (öğrencinin kendi denetimi: [`teslim-batch-01.md`](teslim-batch-01.md)).
- `bun run tauri dev` ile masaüstü penceresinin ekran görüntüsü **eklenmedi**; yukarıdaki görüntüler derlenmiş arayüzün tarayıcı önizlemesidir. Pencere görüntüsünü öğrenci kendi bilgisayarında alıp `docs/kanit/` altına eklemelidir.

## Etiket

`v0.1.0-batch-01` etiketi öğrenci tarafından atıldı (09.10.2026). Etiket, eğitmenin eklediği PR'lardan önceki commit'i gösterir.
