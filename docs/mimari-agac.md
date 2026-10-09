# Sayfa, Özellik ve Platform Haritası

Dizin yapısı için [klasör mimarisine](klasor-mimarisi.md) bakın. Bu belge yalnızca sayfa ve platform haritasının kaynağıdır.

```text
OTOİZ
├── / — Ana Sayfa, marka/model seçimi ve katalog keşfi
├── /araclar — Filtreleme, katalog favorileri ve üçlü karşılaştırma
│   └── ?vehicle=<korunan-katalog-kimliği> — Model detay penceresi
├── /ilanlar.html — Türkçe ilanlar, üyelik ve hesap
│   ├── #yeni-ilan — Fotoğraflı ilan oluşturma
│   └── İlan detay penceresi — Satıcı bilgisi ve ilan favorileri
└── Bilgi Sayfaları — TR/EN/AR/FA; AR/FA RTL
    ├── /hakkinda — Amaç, öğrenci ve etkileşimli kapsam
    ├── /iletisim — Demo form ve isteğe bağlı e-posta taslağı
    ├── /kosullar — Eğitim projesi, sorumluluk ve fikri haklar
    └── /gizlilik — Tarayıcı/sunucu depolama ve veri koruma
```

Yeni sayfalar server.mjs izin listesinde; uzantısız ve .html adresleri doğrudan açılır. /araclar mevcut index.html üzerinden ayrı görünümle sunulur. Profil ayrı /profil rotası değildir; ilan arayüzündedir. Rust kod ekranı yoktur.

## Platform matrisi

| Platform | Mevcut çıktı | Hocanın native hedefi | Durum |
|---|---|---|---|
| macOS | Tarayıcı/PWA | .dmg, .app | Native OTOİZ paketi eksik |
| Windows 10/11 | Node.js sunucu + tarayıcı | .msi, .exe | Native OTOİZ paketi eksik |
| Linux | Node.js sunucu + tarayıcı | .deb, .AppImage | Native OTOİZ paketi eksik |
| iOS/iPadOS | Safari + web ana ekran ikonu | .ipa, Xcode | Native OTOİZ paketi eksik |
| Android | Tarayıcı/PWA | .apk, .aab | Native OTOİZ paketi eksik |

HTTPS veya localhost PWA kurulumunu destekler; telefonun yerel HTTP adresinde tam PWA kurulumu garanti edilmez. Native çıktı varmış gibi sunulmaz.

## Ekran ve gezinme

| Boyut | Davranış |
|---|---|
| Telefon 375–430 px | Tek sütun bilgi/form; açılır hamburger menü; görünür dil seçici |
| Tablet 768–1024 px | Katalogda çok sütun; gezinme satıra sarılır |
| Masaüstü 1200+ px | Çok sütun katalog; ortalanmış max-width:1360px |
| Büyük ekran 1600+ px | İçerik genişliği sınırlandırılır; bilgi metni en fazla 850px |

375, 768 ve 1440 px için dört dilde bilgi sayfaları tarayıcı testiyle doğrulanır. Büyük ekran ve native cihaz testleri ayrıca belirtilmeden yapılmış sayılmaz.
