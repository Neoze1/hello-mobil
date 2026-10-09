# Proje Fikri: OTOİZ

- **Öğrenci Adı Soyadı:** Ediz Davutoğlu
- **Öğrenci Numarası:** 2520171018
- **İlham Alınan Konsept:** Sahibinden / ikinci el otomobil ilanları ve otomobil katalogları.

## 1. Proje Özeti
OTOİZ, otomobil modellerini keşfetme ve kullanıcı ilanlarını inceleme platformudur. Dağınık model bilgilerini karşılaştırılabilir bir katalogda toplar; eksik fiyat veya teknik bilgiyi uydurmaz. Katalog modelleri ile satıcı ilanlarını ayrı gösterir.

## 2. Temel 3 Ekran ve İşlev
1. **Ana Liste Ekranı:** Ana sayfa ve Araçlar ekranında 37 marka, 178 model; marka/model, fiyat, yıl, yakıt ve teknik bilgi filtreleri bulunur.
2. **Detay ve Seçim Ekranı:** Model detay penceresi, kaynaklı fotoğraflar, favoriler ve en fazla üç modelin karşılaştırılması. Katalog kimlikleri korunur.
3. **Kayıt / Kod Üretme Ekranı:** İlanlar ekranında üyelik ve fotoğraflı ilan oluşturma; Node.js sunucusu UUID ilan kimliği üretir. Rust backend ve hocanın Rust kod üretimi şartı uygulanmamıştır. Gelecekteki takip kodu önerisi `OTO-XXXXXXXX`; mevcut kimlik yerine geçirilmez ve çalışan özellik olarak sunulmaz.

## 3. Hedef Kitle
Otomobil almayı düşünenler, model karşılaştırmak isteyen otomobil meraklıları ve kendi aracını ilan vermek isteyen bireysel kullanıcılar.

## 4. İlk Sürüm ve Teknolojiler
Node.js 22+, HTML, CSS ve JavaScript ES modülleri; harici paket kurulumu yok. Açık/koyu tema, yerel katalog favorileri, karşılaştırma, üyelik, ilan favorileri ve kalıcı JSON depolama mevcut. Bilgi sayfaları TR/EN/AR/FA dillerini destekler. Türkçe araç araması, marka/model adları ve API değerleri değişmez.

## 5. Sınırlamalar ve Sonraki Geliştirmeler
Yerel eğitim projesidir. İletişim formu bir demo veya e-posta taslağıdır; sunucudan mesaj göndermez. SMS doğrulaması, moderasyon, ödeme, gerçek ekspertiz ve native uygulama paketleri yok. Hesap/ilan verileri sunucuda saklanır; yalnızca tarayıcıda saklandığı iddia edilmez. Sonraki aşamada veritabanı, HTTPS yayın, doğrulama ve gerçek mesaj servisi planlanabilir.
