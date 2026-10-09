# Batch 01 — Teslim Denetimi

Denetim tarihi: 9 Ekim 2026. Kaynak: [hafta 3 görevleri](tasks/week-3/), kaynak commit `2974254c0660248001bb42d7812e10cb3cc09a80`. Batch 01 son teslimi kaynak görev 09'da 09.10.2026 23:59; fork/fikir için görev 01/02'de belirtilen tarih 07.10.2026 23:59'dur. Geçmiş teslim zamanları doğrulanamadı.

## Başlangıç denetimi
Gerçek uygulama kökü vitra/; Node.js/HTML/CSS/JavaScript. Başlangıçta Git çalışma ağacı temiz, dal main ve origin https://github.com/Neoze1/vitra-app.git idi. Kullanıcı ayrıca https://github.com/Neoze1/hello-mobil deposuna aktarım istedi; hedef deponun ana dalı git üzerinden master olarak saptandı. Remote değiştirilmedi. Hedefin mevcut Astro/Tauri kaynakları korunarak OTOİZ otoiz/ altında aktarıldı.

| Görev | Başlangıç | Yapılan iş / gerçek sınır |
|---|---|---|
| 01 fork/davet/teslim | doğrulanamadı | Fork ilişkisi GitHub API ile doğrulandı. Öğretmen aktif collaborator değil; bekleyen davet de yok. Davet, ekip ekleme ve Blackboard gönderimi yapılmadı |
| 01.2 dallar/PR/merge | eksik | tamamlandı: hedef depoda ayrı feature dalları, conventional commitler, dokuz gerçek PR ve başarılı merge; aşağıdaki tabloya bakın |
| 02 proje fikri | eksik | tamamlandı: öğrenci, üç ekran, hedef, kapsam; Rust kod üretimi eksik |
| 03 README | eksik | tamamlandı: gerçek Node komutları, kurum logosu, üç gerçek teknoloji/kurum rozeti ve belge linkleri; Tauri/Astro/Svelte kullandığı iddia edilmez |
| 04 ajan dosyaları | eksik | tamamlandı: AGENTS.md, CLAUDE.md, GEMINI.md; tek kaynak ve Git kuralları |
| 05 markalama | tamamlandı | Logo/tema/web ikonları ve ortak token/kontrast tablosu; Astro token eşlemesi, Tauri ikonları ve ürün kimliği mevcut. Installer çıktısı ayrıca doğrulanmadı |
| 06 bilgi sayfaları | tamamlandı | Dört bilgi sayfası Astro/MDX ve Svelte iletişim formu ile kök dil rotaları ve EN/AR/FA yollarında çalışıyor; AR/FA RTL. OTOİZ ana menüsündeki dil seçimi Astro sayfalarıyla senkron |
| 07 mimari | tamamlandı | Sayfa/klasör haritası ve platform matrisi güncel; Tauri geliştirme webview çalışıyor, native installer çıktısı ayrıca eksik |
| 08 ileri AGENTS | eksik | tamamlandı: tüm kanonik docs/*.md bağlantıları, tek kaynak, kontrol komutları |
| 09 Batch 01 | eksik | Aşağıdaki matriste; 9/9 tamamlanmış değildir |

## Batch 01 matrisi

| No | İstenen çıktı | Durum | Kanıt / eksik |
|---|---|---|---|
| 1 | Fork ve keyvanarasteh collaborator | eksik | Neoze1/hello-mobil, keyvanarasteh/hello-mobil fork'u olarak doğrulandı. Collaborator kontrolü HTTP 404; bekleyen öğretmen daveti yok. Daveti kullanıcı göndermeli |
| 2 | GitHub kullanıcı ve fork linki Blackboard | doğrulanamadı | Kullanıcının yapacağı işlem |
| 3 | Proje fikri ve üç ekran | tamamlandı | [proje-fikri.md](proje-fikri.md); Rust şartı ayrıca eksik |
| 4 | Kurumsal README | tamamlandı | Üniversite logosu, öğrenci kimliği, rozetler, komutlar; kişisel e-posta verilmedi |
| 5 | Üç kök ajan dosyası | tamamlandı | AGENTS tek kaynak; iki yönlendirme dosyası |
| 6 | Branding + app.css | eksik | Node karşılığı brand.css hazır; src/styles/app.css ve native ikon şartı karşılanmıyor |
| 7 | MDX/Astro bilgi sayfaları | eksik | HTML eşdeğerleri dört dilde çalışıyor; istenen çatı/format uygulanmadı |
| 8 | Mimari ağaç ve platform matrisi | tamamlandı | [mimari-agac.md](mimari-agac.md) |
| 9 | bun run build statik çıktı | tamamlandı | `bun run build` başarıyla 28 statik Astro rotası üretti |

## Doğrulama
- npm run check ve npm test gerçekten çalıştırıldı; npm yerelde olmadığından teslim dışı .tools içine npm 10.9.2 indirildi. Check başarılı ve test sonucu 15/15.
- Mevcut testler: 15/15 başarılı; üyelik, sahiplik, oturum, görsel doğrulama, kalıcılık, Türkçe filtreler ve 37 marka/178 model korunuyor.
- Tarayıcı: 4 bilgi sayfası × 4 dil × 375/768/1440 px; dil saklama, yenileme, açık/koyu tema kalıcılığı, sayfa geçişi, RTL, e-posta LTR, demo form temizleme, etkileşimli kapsam ve mobil menü geçti. Türkçe BMW filtresi, favori ve üçlü karşılaştırma geçti; tarayıcı istisnası yok.
- [RTL mobil ekran kanıtı](proofs/rtl-mobile.png) test tarafından üretildi.
- Yerel belge/anchor bağlantıları ve AGENTS indeksi check-docs.mjs ile doğrulandı: vitra deposunda 42, aktarılmış değerlendirme deposunda 56 bağlantı/anchor. Harici kaynak URL'lerinin tamamı ayrıca erişim testi yapılmış sayılmaz.
- İzole test sunucusu 127.0.0.1 ve geçici data klasörü kullandı; mevcut kullanıcı verilerine dokunulmadı.
- Ajan uyumu: renk görevi branding.md/CSS tokenlarında, sayfa görevi mimari rota/izin listesinde tamamlandı. Ayrı bir ikinci ajan ile uyum testi yapılmadı.
- Kontrast oranları [marka tablosunda](branding.md); ilk koyu accent/beyaz kombinasyonu 4.14:1 idi. Görev 05 düzeltmesinde on-accent tokenı eklendi; buton metni açık 4.92:1, koyu 8.75:1. Accent bağlantıları bg üzerinde açık 4.58:1, koyu 8.75:1. Ana ve soluk metin de AA üzerinde.

## Git ve teslim
Yerel görev dalları: feature/02-proje-fikri, feature/03-readme, feature/04-agent-rules, feature/05-branding, feature/06-info-pages, feature/07-architecture, feature/08-document-index, feature/09-batch-01. Bunlar sıralı bağımlı dallardır. Yerel main'e doğrudan commit atılmadı; geçmiş silinmedi.
GitHub API erişimi Neoze1 hesabıyla doğrulandı. Görev 01–09 için aşağıdaki gerçek PR’lar kontrolleri geçerek hello-mobil/master dalına merge edildi.

| Görev | Hedef dal | Feature commit | PR | Merge commit |
|---|---|---|---|---|
| 01 | feature/01-otoiz-transfer | 37cb884c302f | [PR #1](https://github.com/Neoze1/hello-mobil/pull/1) | 3f6971fa390b |
| 02 | feature/02-proje-fikri | bcfad2559bde | [PR #2](https://github.com/Neoze1/hello-mobil/pull/2) | be49ee380192 |
| 03 | feature/03-readme | 614cba03ccc2 | [PR #3](https://github.com/Neoze1/hello-mobil/pull/3) | 2f705938845b |
| 04 | feature/04-agent-rules | 06c8d41631f9 | [PR #4](https://github.com/Neoze1/hello-mobil/pull/4) | a61ede6cefc2 |
| 05 | feature/05-branding | 3e7488f0e9ad | [PR #5](https://github.com/Neoze1/hello-mobil/pull/5) | ab4932f9dc00 |
| 06 | feature/06-info-pages | 3ef525ff1089 | [PR #6](https://github.com/Neoze1/hello-mobil/pull/6) | 59891447d0cf |
| 07 | feature/07-architecture | 77600b0ea768 | [PR #7](https://github.com/Neoze1/hello-mobil/pull/7) | 16b05d50cce1 |
| 08 | feature/08-document-index | 5180aed1f06d | [PR #8](https://github.com/Neoze1/hello-mobil/pull/8) | bb5480098f25 |
| 09 | feature/09-batch-01 | 288f8e792490 | [PR #9](https://github.com/Neoze1/hello-mobil/pull/9) | c1bf450d580f |

`v0.1.0-batch-01` bu entegrasyon başlamadan önce mevcuttu; dal/master birleştirmesinde etiket taşınmadı veya üzerine yazılmadı. Batch 01'in tamamı için kalan dış teslim koşulları aşağıda ayrıca belirtilmiştir.

## Kullanıcının teslim adımları
1. Değerlendirme deposundaki OTOİZ README ve PR sonuçlarını kontrol et; öğretmenin Node.js karşılığını kabul edip etmediğini netleştir.
2. Öğretmen davetini ve fork ilişkisini kendin kontrol et. Davet veya mesaj bu çalışma tarafından gönderilmedi.
3. GitHub profil/repo ve proje fikrinin Blackboard teslim durumunu kontrol et.
4. Eksik şartlar tamamlanınca GitHub Code → Download ZIP üzerinden final ZIP'i Blackboard'a yükle. .env, data/, node_modules/ ve taşınabilir araçlar paket içinde bulunmamalı.
5. Render yayını başlatılmadı. İncelenen iki depoda render.yaml bulunmadı; mevcut Render dashboard ayarlarına erişim doğrulanmadı. Yayın için kök, komutlar ve ortam değişkenleri önce kontrol edilmeli.

## Birleştirilmiş sürümün son doğrulaması
hello-mobil/master üzerindeki gerçek aktarılmış uygulamada npm run check, npm test (15/15), npm run check:docs (56 bağlantı) ve dört dilli tarayıcı testi yeniden geçti. Tema kalıcılığı ve mobil RTL dahil. GitHub Actions node-checks sonuçları PR sayfalarında başarı durumunda. Katalog kaynakları yerel başlangıca göre değişmedi. Orijinal vitra-app main dalına doğrudan commit veya push yapılmadı.

Son kanıt PR’ı görev 09 kapsamında açılır; ana dalda doğrudan commit yapılmaz. Teslim ZIP’i birleştirilmiş Git dosyalarından üretilir; özel kullanıcı verileri ve yerel araçlar dahil edilmez.

## Astro/Tauri OTOİZ entegrasyonu (9 Ekim 2026)

Dal: `feature/otoiz-tauri-integration`. Önceki `v0.1.0-batch-01` etiketi değiştirilmedi.

| Kontrol | Gerçek sonuç |
|---|---|
| `bun run build` | Başarılı; Astro statik çıktısı 28 rota üretti. Katalog JSON'u `otoiz/catalog.mjs` üzerinden build öncesi üretildi. |
| `bun run tauri dev` | Başarılı; Astro `http://127.0.0.1:1420/` üzerinde açıldı, Rust debug uygulaması çalıştı ve webview ana sayfası OTOİZ oldu. |
| Katalog | Tarayıcıda 37 marka / 178 model; onaylı model görseli yüklendi. 178 yerel araç görseli Astro `public/araclar/` yoluna alındı. Kaynak fiyat kanıtları ve iki dışa aktarma dosyası korundu. Güncel doğrulanmış fiyat sayısı hâlâ 0. |
| Bilgi sayfaları ve diller | Hakkında, iletişim, koşullar ve gizlilik rotalarının her birinde TR/EN/AR/FA seçimi; AR/FA RTL, diğer diller LTR; yön ve seçim gezinmede korundu. 375, 768 ve 1440 px genişliklerinde taşma görülmedi. |
| Node API sınırı | Statik katalog, filtreler, detay, katalog favorileri ve karşılaştırma Tauri webview'de çalışır. Üyelik, kalıcı ilanlar, ilan favorileri, telefon/rapor, asistan ve sunucu iletişim ayarları ayrı `otoiz/server.mjs` API'si gerektirir; Tauri'de ilan sayfası açıkça demo “Önizleme modu” gösterir. Node backend Tauri'ye eklenmedi. |
| Testler | Bun test runner ile asistan/katalog testleri 14/14, Node API entegrasyon testi 1/1 geçti. `bun run check:docs` 55 yerel bağlantı/anchor için geçti; Astro dosyalarında tanı yok ve `git diff --check` temiz. |
| Node scriptleri | Ortamda Node.js/npm kurulu değil. Bu yüzden `bun run check` ve `bun run test` içindeki `node --check`/`node --test` çağrıları Bun uyumluluk hatası verdi; testler doğrudan `bun test` ile çalıştırıldı. |
| Paketleme | Tauri geliştirme penceresi ve OTOİZ native ikon dosyaları mevcut; native MSI/EXE çıktısı ve Tauri içinde Node sidecar doğrulanmadı/eklenmedi. |

PR #16: [OTOİZ Astro/Tauri entegrasyonu](https://github.com/Neoze1/hello-mobil/pull/16). Feature başı `eb5461d`; GitHub'daki iki `node-checks` koşusu başarılı ve PR `clean`/mergeable durumda. Bu kayıt merge öncesi kontrol noktasını gösterir; nihai merge sonucu PR zaman çizelgesindedir.
