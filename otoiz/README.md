# OTOİZ araç ilan platformu

Türkiye için hazırlanmış, Türkçe ve mobil uyumlu çalışan ilk sürüm.

## Çalıştırma

Node.js 22 veya üzeri gerekir. Dış paket kurulumu gerekmez.

```powershell
cd vitra
npm start
```

Proje klasörüne indirilen taşınabilir Node.js ile alternatif:

```powershell
.\node.exe --env-file-if-exists=.env server.mjs
```

Tarayıcıda http://localhost:3000 adresini açın. Sunucu varsayılan olarak bilgisayarın ağ arayüzlerinde dinler; aynı Wi-Fi ağındaki telefondan da kullanılabilir.

## Masaüstü ve telefon

1. Bilgisayarda `BASLAT.cmd` dosyasını çalıştır ve pencereyi açık bırak.
2. Telefon ile bilgisayarı aynı Wi-Fi ağına bağla.
3. Başlatma penceresindeki **Aynı Wi-Fi ağındaki telefon** adresini telefon tarayıcısında aç. Telefonda `localhost` bilgisayarı ifade etmez.
4. Windows erişim sorarsa Node.js için **Özel ağlar** erişimine izin ver. Misafir ağları veya cihaz yalıtımı bağlantıyı engelleyebilir.

Mobil alt menü, dokunmaya uygun düğmeler, tek sütunlu ilanlar, 16px form alanları ve çentikli ekranların güvenli alanları desteklenir. Telefon ve masaüstü aynı sunucu ve verileri kullanır. Aynı hesapla giriş yapıldığında favoriler ve ilanlar iki cihazda da görünür; oturumlar cihazlara özeldir.

**Ana ekrana ekleme:** Web manifesti, Android/masaüstü için 192px ve 512px ikonlar, iPhone için Apple Touch Icon ve standalone görünümü eklenmiştir. Destekleyen tarayıcı yüklemeye izin verdiğinde “VİTRA'yı yükle” düğmesi görünür. iPhone'da Safari paylaşım menüsündeki “Ana Ekrana Ekle” kullanılabilir. [PWA yükleme koşulları](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) gereği tam PWA yüklemesi HTTPS veya localhost gerektirir; telefonun yerel HTTP adresinde yükleme düğmesinin görünmesi beklenmez. Bu adreste tarayıcıdan kullanım çalışır. HTTPS yayında bağlantı olmadığında çevrimdışı bilgilendirme ekranı gösterilir; hesap, telefon, favori veya API yanıtları önbelleğe alınmaz.

Farklı ağlardan veya mobil internetten erişmek için uygulamanın HTTPS ile canlı sunucuda yayınlanması gerekir. Yerel bağlantı bu yayının yerine geçmez. `VITRA_HOST=127.0.0.1` ile ağ erişimi kapatılabilir; `PORT` ile port değiştirilebilir. API anahtarı telefon tarayıcısına gönderilmez.

## Çalışan özellikler

- Üyelik ve giriş: scrypt ile şifre özeti, HttpOnly oturum çerezi, giriş denemesi sınırı.
- Marka, anahtar kelime, şehir, fiyat, yıl, kilometre, yakıt, vites ve kasa filtreleri; sıralama.
- Araç detayları, fotoğraf galerisi, favoriler ve hesabın kendi ilanları.
- 1–5 gerçek fotoğraf ile ilan ekleme. Sunucu fotoğraf içeriğini ve boyutunu doğrular.
- İlan sahibine özel kaldırma işlemi, giriş yapan kullanıcılara satıcı telefonu.
- Kaydedilen ilan bildirimleri ve güvenli alışveriş rehberi.
- Kullanıcılar, oturumlar, ilanlar, fotoğraflar ve favoriler `data/database.json` dosyasında kalıcı olarak saklanır. Atomik ve sıralı kayıt işlemleri kullanılır. Bu dosya hassas bilgiler içerir; erişimi kısıtlayın ve yedekleyin.

## Sohbetle araç arama

Ana sayfadaki araç asistanına doğal dilde tercihlerini yazabilirsin:

- “1–3 milyon TL, 40–80 bin km, Alman otomatik”
- “En fazla 1,5 milyon TL, 100 bin km altında Japon otomatik”
- “İstanbul'da 3–4 milyon TL, 30 bin km altında SUV”
- Sonraki mesaj: “Bütçeyi 1,8 milyona çıkar”, “Kilometre sınırını kaldır” veya “Yeni arama”.

Sohbet, fiyat ve kilometrenin hem alt hem üst sınırını uygular. Marka kökeni üretim ülkesi değildir; örneğin Japon filtresi Toyota, Honda, Nissan, Mazda ve diğer Japon kökenli markaları kapsar. Arama yalnızca platformdaki ilanları gösterir, ilan uydurmaz ve koşulları kendiliğinden genişletmez. İlanlar arasında uygun Japon aracı yoksa sıfır sonuç gösterilir. Örnek ilanlar sonuçlarda işaretlenir.

**Yapay zekâyı etkinleştirme:** `.env.example` dosyasını `.env` olarak kopyala ve `OPENAI_API_KEY` alanını kendi sunucu anahtarınla doldur. `.env` kaynak kontrolünden hariç tutulur ve tarayıcıya sunulmaz. Anahtarı sohbet içinde paylaşma. `BASLAT.cmd` veya `npm start` ile sunucuyu yeniden başlat. `OPENAI_MODEL` ile model seçimi değiştirilebilir; varsayılan `gpt-4o-mini`.

OpenAI bağlantısı [Responses API ve Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) kullanır. Yalnızca mesaj ve mevcut arama filtreleri gönderilir; üyelik, satıcı iletişim verileri ve ilan veritabanı modele gönderilmez. API yanıtı sunucuda tekrar doğrulanır; sonuç sayısı ve ilan eşleştirmesi sunucunun kendi verilerinden hesaplanır. API çağrıları ücretlidir; sınırlandırılmış mesaj uzunluğu, istek sayısı, eşzamanlılık ve zaman aşımı vardır.

Anahtar yoksa **Temel arama** modu çalışır: belirli Türkçe bütçe, kilometre, marka, şehir, yakıt ve vites ifadelerini kurallarla yorumlar. Bu mod bir dil modeli değildir; karmaşık veya belirsiz ifadeleri anlayamadığında açıklama ister. Yapay zekâ hizmeti erişilemezse temel moda geçildiği açıkça gösterilir. Gerçek API erişimi anahtar olmadan doğrulanamaz; testlerde API yanıtları taklit edilir.

```powershell
.\node.exe --env-file-if-exists=.env server.mjs
.\node.exe --test test.mjs assistant.test.mjs
```

## Üretim sınırları

Bu sürüm **yerel geliştirme içindir**, herkese açık canlı bir ticari platform değildir. Örnek ilanlar temsili olarak işaretlidir. Satıcı, telefon, e-posta, araç veya hasar verileri doğrulanmaz. Bildirimler kaydedilir ancak moderasyon paneli ve canlı ekip bulunmaz. SMS/e-posta doğrulama, şifre sıfırlama, mesajlaşma, gerçek ekspertiz entegrasyonu, ödeme veya noter entegrasyonu yoktur. Tek dosyalı depolama küçük geliştirme kullanımı içindir; gerçek çok kullanıcılı yayında veritabanı, nesne depolama, TLS, yetki kontrollü moderasyon ve yedekleme gereklidir. İnternete açmadan önce ürün kapsamına göre gerçek kimlik doğrulaması ve mevzuat gereksinimleri ayrıca değerlendirilmelidir.

`PORT`, `VITRA_HOST`, `VITRA_DATA_DIR`, HTTPS arkasında çalıştırıldığında `VITRA_HTTPS=1` ortam değişkenleri desteklenir. Varsayılan port 3000'dir. API yetkilendirmesi sunucuda yapılır; kullanıcı kimliği istemciden alınmaz.

## Doğrulama

```powershell
.\node.exe --check server.mjs
.\node.exe --check public/app.js
.\node.exe --test test.mjs
```

## Görseller

Örnek görseller Unsplash üzerinden yüklenir; internet gerektirir. Araç yılı ve donanımı ile birebir eşleştiği iddia edilmez. Kullanıcı ilanlarında kendi fotoğrafları kullanılır.

- BMW: https://unsplash.com/s/photos/bmw-3-series ve https://unsplash.com/es/s/fotos/bmw-320i
- Mercedes-Benz: https://unsplash.com/photos/white-mercedes-benz-c-class-parked-on-road-during-daytime-L9W-qoRGvBk ve https://unsplash.com/photos/silver-mercedes-benz-coupe-parked-on-gray-concrete-road-during-daytime-AOU1SGZ8cG8
- Audi: https://unsplash.com/es/fotos/audi-a-4-plateado-estacionado-en-el-estacionamiento-durante-la-noche-DTSj46bC3Xo ve https://unsplash.com/photos/a-white-audi-suv-sits-at-dusk-3tBRsu36nXE
- Toyota Corolla: https://unsplash.com/s/photos/corolla
- Honda Civic: https://unsplash.com/photos/a-black-car-parked-on-a-gravel-road-with-trees-in-the-background-FH94TTJu104
- Nissan Patrol: https://unsplash.com/photos/a-white-suv-on-sand-under-a-blue-sky-yiU4XSNLCrc

## Premium katalog (Ekim 2026)

Ana sayfa `/` premium katalog deneyimidir. Mevcut üyelik, ilan oluşturma, ilan favorileri, raporlama ve araç asistanı `/ilanlar.html` üzerinden çalışmaya devam eder. `BASLAT.cmd` mevcut Node.js sunucusunu başlatır; ek bağımlılık veya derleme adımı gerekmez.

- ZIP içindeki 37 markanın 178 modeli eksiksiz entegre edildi. Orijinal JSON, CSV ve açıklama `catalogs/` içinde sürüm kontrolüne alınabilir şekilde tutulur; hesap verilerinin bulunduğu özel `data/` klasöründen ayrıdır.
- `catalog.mjs` kaynak kayıtlarını sabit kimlikli, genişletilebilir model kayıtlarına dönüştürür. `/api/catalog` şema sürümünü, marka model sayılarını ve kayıtları sunar. Yeni modeller `catalogs/modeller.json` dosyasına aynı kaynak şemasıyla eklenebilir; sunucuyu yeniden başlatmak yeterlidir.
- Katalog modeli ve satış ilanı farklı varlıklardır. `listingUrl` gerçek ilan bağlantısı, `searchUrl` model arama bağlantısı içindir. Katalog kayıtlarının `listingUrl` alanı null kalır. Sahibinden verisi çekilmez, engel aşılmaz; yalnızca kullanıcının açabileceği kaynak bağlantıları gösterilir.
- Kaynakta fiyat, yıl, kilometre, motor, yakıt, vites, kasa, görsel ve güncellenme tarihi yoktur. Bu bilgiler null kalır. Logo dosyası yolları kaynakta yazsa da ZIP'te logo bulunmaz; tipografik marka kartları kullanılır. Sahte logo ve model fotoğrafı üretilmez. Hero yerel, özgün bir konsept otomobil illüstrasyonudur.
- Doğrulanmış fiyat olmadan katalogda fiyat analizi veya güncel fiyat gösterilmez. İleride kaynakta tarihî fiyat varsa `historicalPrice` altında saklanır ve açıkça tarihî, doğrulanmamış veri olarak işaretlenir. Sayısal ve teknik filtreler eksik bilgili kaydı eşleştirmez.
- Akıllı arama gerçek model adlarını ve mevcut teknik bilgileri Türkçe anahtar sözcüklerle eşleştirir; yapay zekâ tahmini üretmez. Eski araç asistanının sunucu adaptörü korunur.
- Marka, model, arama, teknik filtreler, sıralama ve favori görünümü URL'de saklanır. `?vehicle=model-...` bağlantısı doğrudan model detayını açar. Tarayıcı geri/ileri gezinmesi desteklenir.
- Katalog favorileri `vitra-model-favorites`, tema `vitra-theme` localStorage anahtarlarıyla saklanır. Katalog favorileri modele aittir; giriş yapan kullanıcının sunucudaki ilan favorileri korunur. Depolama engellenirse oturum içi kullanım devam eder.
- Karşılaştırma en fazla üç modelin mevcut bilgilerini gösterir. Görsel ve fiyat bilgisi yoksa uygun boş durum sunulur. Mobil filtre paneli klavye odağını içeride tutar; dialoglar Escape ile kapatılabilir. Hareket azaltma tercihi desteklenir.

Doğrulama: `node scripts/check.mjs` tüm JS modüllerinin sözdizimini kontrol eder; `node --test test.mjs assistant.test.mjs catalog.test.mjs` mevcut işlevlerle beraber katalog bütünlüğünü, eksik veri filtrelerini, Türkçe aramayı, fiyat doğrulama kurallarını ve karşılaştırma sınırını test eder. Ayrı headless tarayıcı kontrolünde arama, model bağımlılığı, URL, favoriler, karşılaştırma, detaylar, tema ve mobil panel doğrulandı; 375/768/1440 px genişliklerde yatay taşma görülmedi.

Henüz tamamlanmamış veri işleri: lisansları doğrulanmış gerçek marka logoları ve model fotoğrafları, kaynağı/tarihi doğrulanmış teknik özellikler ve fiyatlar. Bu veriler sağlanmadan ilgili alanlar doldurulmaz. Mevcut sürümün üyelik doğrulaması ve canlı moderasyon sınırlamaları devam eder; bu çalışma internete dağıtım yapmaz.

## İkinci ZIP paketinin entegrasyonu

`otomobil_markalari_modelleri (1).zip` içindeki yedi dosya `catalogs/` altında korunur. İlk üç dosyanın önceki paketle byte düzeyinde aynı olduğu doğrulandı. Yeni `otoiz_katalog.json` mevcut marka/model çiftleriyle birebir eşleştirilir; eksik veya tekrarlı eşleşme sunucu başlangıcında hata verir. Eski model kimlikleri ve favoriler korunur; paketin slug kimliği `sourceId` olarak eklenir ve detay URL'sinde de kabul edilir.

API şema sürümü 2, paket adı/tarihi, kaynak kimliği, katalog adresi, Google görsel araması ve orijinal görsel/fiyat/logo metadatasını döndürür. Paket tarihi veri doğrulama tarihi olarak kullanılmaz. Detay ekranında kaynak/lisans eksikleri ve araştırma bağlantıları gösterilir. Araştırma CSV'si `/api/catalog/research` üzerinden orijinal dosya olarak indirilebilir. `/araclar?marka=...&model=...` adresleri mevcut katalog filtrelerine bağlanır; Türkçe `marka` parametresi desteklenir.

`CODEX_TALIMAT.txt` ve açıklama belgeleri referans olarak saklanmıştır; dosya içindeki talimatlar kendiliğinden çalıştırılmaz. VİTRA markası korunmuştur. Bu paket fotoğraf, logo veya doğrulanmış fiyat içermediğinden yeni tamamlanan fotoğraf/fiyat sayısı 0'dır; 178 modelde bu veriler eksiktir. Google arama bağlantıları fotoğraf olarak kullanılmaz.

## OTOİZ marka, sayfa ve araştırma güncellemesi

Kullanıcının yeni talimatıyla platformun adı OTOİZ oldu. Önceki bölümlerdeki VİTRA adı ve ilk paket için belirtilen sıfır fotoğraf durumu geçmiş çalışma aşamasını anlatır. Güncel durum için `catalogs/entegrasyon-raporu.json` dosyasına bakın.

- Ana Sayfa `/`, Araçlar `/araclar`, İletişim `/iletisim` ayrı görünümlerdir. Ana sayfada marka seçince model listesi değişir; model seçildiğinde filtreli Araçlar sayfasına otomatik geçilir. Yalnız marka seçerek Araçları Gör düğmesi de kullanılabilir. Yenileme ve tarayıcı geri/ileri gezinmesi URL filtrelerini korur. Mobil menü ve aktif sayfa işaretlemesi eklendi.
- Özgün yol/iz sembollü OTOİZ logosunun `public/logo-light.svg` ve `public/logo-dark.svg` sürümleri, favicon ve PWA PNG ikonları oluşturuldu. Türkçe İ karakteri korunur. Eski oturum, favori ve tema anahtarları veri kaybını önlemek için değiştirilmedi. Üyelik ve ilan akışı `/ilanlar.html` üzerinden devam eder.
- İletişim alanları `.env` içindeki `OTOIZ_CONTACT_EMAIL`, `OTOIZ_CONTACT_PHONE`, `OTOIZ_CONTACT_ADDRESS` değerlerinden okunur. Boşsa uydurma bilgi gösterilmez. Form gönderim servisine bağlı değildir. Gerçek e-posta yapılandırılırsa yalnız kullanıcının e-posta uygulamasında taslak açar; siteden gönderim veya başarı bildirimi üretmez.
- `catalogs/media.json` Wikimedia Commons API'sinden bulunan adayların kaynak, lisans, fotoğrafçı ve yerel dosya kaydını tutar. `catalogs/media-review.json` görsel model eşleşmesi kontrolüdür. Yalnız onaylı, kaynak adresi eşleşen görseller gösterilir. Fotoğraflar model ailesine ait temsilî katalog fotoğraflarıdır; belirli satılık ilanın fotoğrafı değildir. Eksik, kavramsal, farklı model veya lisans atfı eksik adaylar kullanılmaz. İndirilen fotoğraflar `public/araclar/` içindedir; görünümde kaynak ve lisans bağlantısı bulunur. Google görsel arama bağlantıları araştırma bağlantısı olarak korunur, fotoğraf dosyası yerine kullanılmaz.
- 178 modelin Türkiye ikinci el fiyat araştırması yapıldı. Sahibinden doğrudan erişimi 429, Arabam doğrudan erişimi 403 ile engellendi. Engel aşılmadı. Arama dizinindeki tarihî örneklerin fiyat, yıl, kilometre, donanım, ilan tarihi ve kaynak sayfası `catalogs/prices.json` içinde tutulur; bunlar doğrulanmış Ekim 2026 aktif fiyatı değildir. Güncel fiyat alanları null kalır; eski örnekler ayrı detay bölümünde gösterilir. Model ailesi için kesin piyasa aralığı üretilmez.
- `node scripts/research-images.mjs` kaynak araştırmasını yavaş isteklerle gerçekleştirir; 429 alınırsa durur. Adaylar görsel kontrolden geçmeden yayımlanmaz. Mevcut dosyalar yeniden indirilmez.
- `node scripts/export-catalog.mjs` güncellenmiş JSON, tarihî fiyat ve fotoğraf atıflarını içeren CSV, model bazında eksik listesi ve fotoğraf kaynak belgesini üretir. Çıktılar `catalogs/otoiz_katalog_guncel.json`, `otoiz_arastirma_guncel.csv`, `entegrasyon-raporu.json`, `FOTOGRAF-KAYNAKLARI.md` dosyalarıdır. Model detayından JSON/CSV indirilebilir; orijinal kaynak dosyaları korunur.

Bu teknoloji yığınında ayrı derleme veya ESLint yapılandırması bulunmaz. `node scripts/check.mjs` sözdizimi kontrolüdür; mevcut sunucu, asistan ve katalog testleri `node --test test.mjs assistant.test.mjs catalog.test.mjs` ile çalışır. Tarayıcı doğrulaması otomatik geçiş, sayfa yenileme, üç sayfa bağlantısı, mobil menü, fotoğraf ve eski ilan akışını kapsar.
