# Batch 01 — Teslim Denetimi

Denetim tarihi: 9 Ekim 2026. Kaynak: [hafta 3 görevleri](tasks/week-3/), kaynak commit `2974254c0660248001bb42d7812e10cb3cc09a80`. Batch 01 son teslimi kaynak görev 09'da 09.10.2026 23:59; fork/fikir için görev 01/02'de belirtilen tarih 07.10.2026 23:59'dur. Geçmiş teslim zamanları doğrulanamadı.

## Başlangıç denetimi
Gerçek uygulama kökü vitra/; Node.js/HTML/CSS/JavaScript. Başlangıçta Git çalışma ağacı temiz, dal main ve origin https://github.com/Neoze1/vitra-app.git idi. Kullanıcı ayrıca https://github.com/Neoze1/hello-mobil deposuna aktarım istedi; hedef deponun ana dalı git üzerinden master olarak saptandı. Remote değiştirilmedi. Hedefin mevcut Astro/Tauri kaynakları korunarak OTOİZ otoiz/ altında aktarılır.

| Görev | Başlangıç | Yapılan iş / gerçek sınır |
|---|---|---|
| 01 fork/davet/teslim | doğrulanamadı | Fork ilişkisi GitHub API ile doğrulandı. Öğretmen aktif collaborator değil; bekleyen davet de yok. Davet, ekip ekleme ve Blackboard gönderimi yapılmadı |
| 01.2 dallar/PR/merge | eksik | Ayrı feature/02–09 dalları ve conventional commitler hazır; hedef PR kanıtları ayrıca kaydedilir |
| 02 proje fikri | eksik | tamamlandı: öğrenci, üç ekran, hedef, kapsam; Rust kod üretimi eksik |
| 03 README | eksik | tamamlandı: gerçek Node komutları, kurum logosu, üç gerçek teknoloji/kurum rozeti ve belge linkleri; Tauri/Astro/Svelte kullandığı iddia edilmez |
| 04 ajan dosyaları | eksik | tamamlandı: AGENTS.md, CLAUDE.md, GEMINI.md; tek kaynak ve Git kuralları |
| 05 markalama | kısmen tamamlandı | Logo/tema/web ikonları korundu; ortak tokenlar ve ölçülen kontrast tablosu eklendi. Tauri native ikon setleri ve yapılandırma eksik |
| 06 bilgi sayfaları | eksik | tamamlandı: dört HTML bilgi sayfası, TR/EN/AR/FA, RTL ve demo form. Hocanın MDX/Astro/Svelte dosya formatı şartı eksik |
| 07 mimari | eksik | tamamlandı: gerçek sayfa/klasör yapısı ve beş platform matrisi; native paketler eksik |
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
| 9 | bun run build statik çıktı | eksik | Node uygulaması derleme kullanmıyor; bun run build çalıştırılmadı |

## Doğrulama
- npm run check ve npm test gerçekten çalıştırıldı; npm yerelde olmadığından teslim dışı .tools içine npm 10.9.2 indirildi. Check başarılı ve test sonucu 15/15.
- Mevcut testler: 15/15 başarılı; üyelik, sahiplik, oturum, görsel doğrulama, kalıcılık, Türkçe filtreler ve 37 marka/178 model korunuyor.
- Tarayıcı: 4 bilgi sayfası × 4 dil × 375/768/1440 px; dil saklama, yenileme, açık/koyu tema kalıcılığı, sayfa geçişi, RTL, e-posta LTR, demo form temizleme, etkileşimli kapsam ve mobil menü geçti. Türkçe BMW filtresi, favori ve üçlü karşılaştırma geçti; tarayıcı istisnası yok.
- [RTL mobil ekran kanıtı](proofs/rtl-mobile.png) test tarafından üretildi.
- Yerel belge/anchor bağlantıları ve AGENTS indeksi check-docs.mjs ile doğrulandı. Harici kaynak URL'lerinin tamamı ayrıca erişim testi yapılmış sayılmaz.
- İzole test sunucusu 127.0.0.1 ve geçici data klasörü kullandı; mevcut kullanıcı verilerine dokunulmadı.
- Ajan uyumu: renk görevi branding.md/CSS tokenlarında, sayfa görevi mimari rota/izin listesinde tamamlandı. Ayrı bir ikinci ajan ile uyum testi yapılmadı.
- Kontrast oranları [marka tablosunda](branding.md); ilk koyu accent/beyaz kombinasyonu 4.14:1 idi. Görev 05 düzeltmesinde on-accent tokenı eklendi; buton metni açık 4.92:1, koyu 8.75:1. Accent bağlantıları bg üzerinde açık 4.58:1, koyu 8.75:1. Ana ve soluk metin de AA üzerinde.

## Git ve teslim
Yerel görev dalları: feature/02-proje-fikri, feature/03-readme, feature/04-agent-rules, feature/05-branding, feature/06-info-pages, feature/07-architecture, feature/08-document-index, feature/09-batch-01. Bunlar sıralı bağımlı dallardır. Yerel main'e doğrudan commit atılmadı; geçmiş silinmedi.
GitHub API erişimi Neoze1 hesabıyla doğrulandı. Aşağıdaki PR’lar gerçek GitHub PR’larıdır ve master dalına merge edilmiştir. Görev 09 PR’ı bu belgeyi tamamlayacaktır.

| Görev | Hedef dal / commit | PR | Durum |
|---|---|---|---|
| 01 | feature/01-otoiz-transfer / 37cb884c302f | [PR #1](https://github.com/Neoze1/hello-mobil/pull/1) | merge edildi |
| 02 | feature/02-proje-fikri / bcfad2559bde | [PR #2](https://github.com/Neoze1/hello-mobil/pull/2) | merge edildi |
| 03 | feature/03-readme / 614cba03ccc2 | [PR #3](https://github.com/Neoze1/hello-mobil/pull/3) | merge edildi |
| 04 | feature/04-agent-rules / 06c8d41631f9 | [PR #4](https://github.com/Neoze1/hello-mobil/pull/4) | merge edildi |
| 05 | feature/05-branding / 3e7488f0e9ad | [PR #5](https://github.com/Neoze1/hello-mobil/pull/5) | merge edildi |
| 06 | feature/06-info-pages / 3ef525ff1089 | [PR #6](https://github.com/Neoze1/hello-mobil/pull/6) | merge edildi |
| 07 | feature/07-architecture / 77600b0ea768 | [PR #7](https://github.com/Neoze1/hello-mobil/pull/7) | merge edildi |
| 08 | feature/08-document-index / 5180aed1f06d | [PR #8](https://github.com/Neoze1/hello-mobil/pull/8) | merge edildi |

Tüm Batch 01 şartları karşılanmadığından v0.1.0-batch-01 etiketi oluşturulmadı. Eksik native/MDX/build şartları eğitmenle netleştirilmeden tamamlandı etiketi verilmemeli.

## Kullanıcının teslim adımları
1. Değerlendirme deposundaki OTOİZ README ve PR sonuçlarını kontrol et; öğretmenin Node.js karşılığını kabul edip etmediğini netleştir.
2. Öğretmen davetini ve fork ilişkisini kendin kontrol et. Davet veya mesaj bu çalışma tarafından gönderilmedi.
3. GitHub profil/repo ve proje fikrinin Blackboard teslim durumunu kontrol et.
4. Eksik şartlar tamamlanınca GitHub Code → Download ZIP üzerinden final ZIP'i Blackboard'a yükle. .env, data/, node_modules/ ve taşınabilir araçlar paket içinde bulunmamalı.
5. Render yayını başlatılmadı. İncelenen iki depoda render.yaml bulunmadı; mevcut Render dashboard ayarlarına erişim doğrulanmadı. Yayın için kök, komutlar ve ortam değişkenleri önce kontrol edilmeli.
