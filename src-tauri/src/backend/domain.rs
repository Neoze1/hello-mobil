//! OTOİZ iş işlevleri: ilan doğrulama ve yayınlama (hız sınırlı), arama, favori, şikâyet → moderasyon vakası,
//! moderasyon kararı (ilan kaldırma, uyarı, satıcı askıya alma), katalog fotoğraf onayı, panel özeti.
//! Doğrulama kuralları `otoiz/server.mjs` ile aynıdır. Katalog kaydı satış teklifi değildir: model alanlarında
//! fiyat/yıl/yakıt yoktur ve doğrulanmamış fiyat uydurulmaz.
use crate::backend::audit;
use crate::backend::crud::{self, ListQuery};
use crate::backend::error::{AppError, AppResult, FieldError};
use crate::backend::policy::authorize;
use crate::backend::rbac::{self, ModelRef};
use crate::backend::schema;
use crate::backend::state::AppState;
use crate::backend::util::{new_id, now_iso};
use rusqlite::{params, Connection, OptionalExtension};
use serde_json::{json, Map, Value};
use tauri::State;

pub const YAKIT: [&str; 5] = ["Benzin", "Dizel", "Hibrit", "Elektrik", "LPG"];
pub const VITES: [&str; 2] = ["Otomatik", "Manuel"];
pub const KASA: [&str; 5] = ["Sedan", "SUV", "Hatchback", "Coupe", "Diğer"];
pub const SATICI: [&str; 2] = ["Bireysel", "Galeri"];
pub const SIRALAMA: [&str; 5] = ["newest", "price-asc", "price-desc", "km", "year"];

fn uzunluk(s: &str, min: usize, max: usize) -> bool {
    let n = s.trim().chars().count();
    n >= min && n <= max
}

fn tam_sayi(v: &Value, min: i64, max: i64) -> bool {
    v.as_i64().map(|n| n >= min && n <= max).unwrap_or(false)
}

/// Tam base64 çözücü olmadan, ilk 16 karakterden ilk 12 bayt (dosya imzası denetimi için).
fn base64_on_bayt(s: &str) -> Vec<u8> {
    const A: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let v: Vec<u8> = s.bytes().take(16).filter_map(|b| A.iter().position(|a| *a == b).map(|p| p as u8)).collect();
    let mut out = Vec::new();
    for ch in v.chunks(4) {
        if ch.len() < 4 {
            break;
        }
        out.push((ch[0] << 2) | (ch[1] >> 4));
        out.push((ch[1] << 4) | (ch[2] >> 2));
        out.push((ch[2] << 6) | ch[3]);
    }
    out
}

/// `data:image/(jpeg|png|webp);base64,...` biçimi, boyut (≤ 2 MB) ve dosya imzası. Dönen: tahmini bayt sayısı.
pub fn fotograf_dogrula(s: &str) -> Result<usize, String> {
    let rest = s.strip_prefix("data:image/").ok_or("Fotoğraf geçerli değil.")?;
    let (tur, veri) = rest.split_once(";base64,").ok_or("Fotoğraf geçerli değil.")?;
    if !["jpeg", "png", "webp"].contains(&tur) {
        return Err("Yalnızca JPEG, PNG ve WebP fotoğrafları kabul edilir.".into());
    }
    if !veri.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'+' || b == b'/' || b == b'=') {
        return Err("Fotoğraf geçerli değil.".into());
    }
    let dolgu = veri.bytes().rev().take_while(|b| *b == b'=').count();
    let bayt = veri.len() / 4 * 3 - dolgu.min(2);
    if bayt < 12 || bayt > 2 * 1024 * 1024 {
        return Err("Her fotoğraf en fazla 2 MB olmalı.".into());
    }
    let b = base64_on_bayt(veri);
    let imza_ok = match tur {
        "jpeg" => b.starts_with(&[0xFF, 0xD8, 0xFF]),
        "png" => b.starts_with(&[137, 80, 78, 71, 13, 10, 26, 10][..b.len().min(8)]) && b.len() >= 8 || b.starts_with(&[137, 80, 78, 71]),
        _ => b.starts_with(b"RIFF"),
    };
    if !imza_ok {
        return Err("Fotoğraf içeriği dosya türüyle uyuşmuyor.".into());
    }
    Ok(bayt)
}

/// İlan alanlarını doğrular; hata listesi boşsa geçerlidir. `bu_yil`: yıl üst sınırı için (bu yıl + 1).
pub fn ilan_dogrula(g: &Value, bu_yil: i64) -> Vec<FieldError> {
    let mut e = Vec::new();
    let mut hata = |f: &str, m: &str| e.push(FieldError { field: f.into(), message: m.into() });
    let s = |k: &str| g.get(k).and_then(Value::as_str).unwrap_or("");
    if !uzunluk(s("brand"), 2, 50) { hata("brand", "Marka 2–50 karakter olmalı."); }
    if !uzunluk(s("model"), 2, 100) { hata("model", "Model 2–100 karakter olmalı."); }
    if !g.get("price").map(|v| tam_sayi(v, 1000, 100_000_000)).unwrap_or(false) { hata("price", "Fiyat 1.000–100.000.000 aralığında olmalı."); }
    if !g.get("year").map(|v| tam_sayi(v, 1950, bu_yil + 1)).unwrap_or(false) { hata("year", &format!("Yıl 1950–{} aralığında olmalı.", bu_yil + 1)); }
    if !g.get("km").map(|v| tam_sayi(v, 0, 3_000_000)).unwrap_or(false) { hata("km", "Kilometre 0–3.000.000 aralığında olmalı."); }
    if !uzunluk(s("city"), 2, 50) { hata("city", "Şehir 2–50 karakter olmalı."); }
    if !uzunluk(s("color"), 2, 30) { hata("color", "Renk 2–30 karakter olmalı."); }
    if !uzunluk(s("description"), 30, 5000) { hata("description", "Açıklama 30–5000 karakter olmalı."); }
    if !uzunluk(s("damage"), 5, 500) { hata("damage", "Hasar bilgisi 5–500 karakter olmalı."); }
    let tel = s("phone");
    if !uzunluk(tel, 10, 20) || !tel.chars().all(|c| c.is_ascii_digit() || " +()-".contains(c)) { hata("phone", "Geçerli bir telefon numarası gir."); }
    if !YAKIT.contains(&s("fuel")) { hata("fuel", "Yakıt seçimi geçerli değil."); }
    if !VITES.contains(&s("gear")) { hata("gear", "Vites seçimi geçerli değil."); }
    if !KASA.contains(&s("body")) { hata("body", "Kasa tipi seçimi geçerli değil."); }
    if !SATICI.contains(&s("sellerType")) { hata("sellerType", "Satıcı tipi seçimi geçerli değil."); }
    match g.get("images").and_then(Value::as_array) {
        Some(a) if (1..=5).contains(&a.len()) => {
            let mut toplam = 0usize;
            for (i, im) in a.iter().enumerate() {
                match im.as_str().map(fotograf_dogrula) {
                    Some(Ok(b)) => toplam += b,
                    Some(Err(m)) => hata(&format!("images[{i}]"), &m),
                    None => hata(&format!("images[{i}]"), "Fotoğraf geçerli değil."),
                }
            }
            if toplam > 6 * 1024 * 1024 { hata("images", "Fotoğraflar toplam 6 MB sınırını aşamaz."); }
        }
        _ => hata("images", "1–5 fotoğraf eklemelisin."),
    }
    e
}

/// Asistan/arama süzgeçleri doğrulaması: aralıklar sınırlı, alt sınır üst sınırdan büyük olamaz.
pub fn filtre_dogrula(f: &Value) -> Result<(), String> {
    let lim = [("minPrice", 1e8), ("maxPrice", 1e8), ("minKm", 3e6), ("maxKm", 3e6), ("minYear", 2027.0), ("maxYear", 2027.0)];
    for (k, max) in lim {
        if let Some(v) = f.get(k).filter(|v| !v.is_null()) {
            let n = v.as_f64().filter(|n| n.fract() == 0.0 && *n >= 0.0 && *n <= max);
            if n.is_none() || (k.contains("Year") && n.unwrap_or(0.0) < 1950.0) {
                return Err("Fiyat, kilometre veya yıl aralığı geçerli değil.".into());
            }
        }
    }
    for (a, b) in [("minPrice", "maxPrice"), ("minKm", "maxKm"), ("minYear", "maxYear")] {
        if let (Some(x), Some(y)) = (f.get(a).and_then(Value::as_f64), f.get(b).and_then(Value::as_f64)) {
            if x > y {
                return Err("Alt sınır üst sınırdan büyük olamaz.".into());
            }
        }
    }
    if let Some(s) = f.get("sort").and_then(Value::as_str) {
        if !SIRALAMA.contains(&s) {
            return Err("Sıralama geçerli değil.".into());
        }
    }
    Ok(())
}

/// Fotoğraf onayı koşulu: onaylı + kaynak adresi eşleşir + fotoğrafçı var + lisans var + yerel yol biçimi doğru.
/// Dönen: eksik koşulların listesi (boşsa onaylanabilir).
pub fn medya_eksikleri(media: &Value, kaynak_url: &str) -> Vec<&'static str> {
    let mut e = Vec::new();
    if media.is_null() {
        return vec!["Katalog kaydında fotoğraf bilgisi (media) yok."];
    }
    if media["sourceUrl"].as_str() != Some(kaynak_url) || kaynak_url.is_empty() {
        e.push("Kaynak adresi fotoğraf kaydındakiyle eşleşmiyor.");
    }
    if media["photographer"].as_str().map(|s| s.trim().is_empty()).unwrap_or(true) {
        e.push("Fotoğrafçı bilgisi yok.");
    }
    if media["license"].as_str().map(|s| s.trim().is_empty()).unwrap_or(true) {
        e.push("Lisans bilgisi yok.");
    }
    let yol = media["file"].as_str().unwrap_or("");
    let uygun = yol.strip_prefix("/araclar/").map(|r| (r.ends_with(".jpg") || r.ends_with(".png")) && r.len() > 4 && r[..r.len() - 4].bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-')).unwrap_or(false);
    if !uygun {
        e.push("Dosya yolu /araclar/<ad>.jpg|png biçiminde değil.");
    }
    e
}

pub fn sikayet_onceligi(ayni_ilan_sayisi: i64) -> &'static str {
    if ayni_ilan_sayisi >= 3 { "yuksek" } else { "normal" }
}

fn bu_yil(c: &Connection) -> AppResult<i64> {
    Ok(now_iso(c)?[..4].parse().unwrap_or(2026))
}

/// Kullanıcı başına dakikalık hız sınırı (`rate_limits` tablosu; sayım denetim günlüğünden).
fn hiz_siniri(c: &Connection, uid: i64, anahtar: &str, eylem: &str) -> AppResult<()> {
    let limit: i64 = c.query_row("SELECT perMinute FROM rate_limits WHERE key = ?1", [anahtar], |r| r.get(0)).optional()?.unwrap_or(i64::MAX);
    let n: i64 = c.query_row(
        "SELECT COUNT(*) FROM audit_logs WHERE actorId = ?1 AND action = ?2 AND at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 minutes')",
        params![uid.to_string(), eylem],
        |r| r.get(0),
    )?;
    if n >= limit {
        return Err(AppError::Conflict("Çok fazla deneme yaptın. Bir dakika sonra tekrar dene.".into()));
    }
    Ok(())
}

fn kullanici_adi(c: &Connection, uid: i64) -> AppResult<String> {
    Ok(c.query_row("SELECT name FROM users WHERE id = ?1", [uid], |r| r.get(0))?)
}

/// İlan ver (giriş gerekli; dakikada `listing` sınırı). `girdi`: ilan alanları (`id`, sahip ve durum sunucuda atanır).
pub fn do_ilan_olustur(app: &AppState, girdi: &Value) -> AppResult<Value> {
    let uid = app.user().ok_or(AppError::Unauthenticated)?;
    app.db.with(|c| {
        hiz_siniri(c, uid, "listing", "Listing.create")?;
        let hatalar = ilan_dogrula(girdi, bu_yil(c)?);
        if !hatalar.is_empty() {
            return Err(AppError::Validation(hatalar));
        }
        let mut kayit = girdi.as_object().cloned().unwrap_or_default();
        for k in ["id", "ownerId", "sellerName", "createdAt", "demo", "state"] {
            kayit.remove(k);
        }
        kayit.insert("ownerId".into(), json!(uid));
        kayit.insert("sellerName".into(), json!(kullanici_adi(c, uid)?));
        let l = crud::insert(c, &schema::LISTING, &Value::Object(kayit))?;
        audit::record(c, Some(uid), "Listing.create", "Listing", l["id"].as_str().unwrap_or(""), None, None, None)?;
        Ok(l)
    })
}

fn sahip_mi(l: &Value, uid: i64) -> bool {
    l["ownerId"].as_i64() == Some(uid)
}

/// İlanı kaldır: yalnız sahibi ya da `Delete:Listing` izni olan. Sahibin ilanı silinince favorileri de silinir (CASCADE).
pub fn do_ilan_sil(app: &AppState, id: &str) -> AppResult<()> {
    let uid = app.user().ok_or(AppError::Unauthenticated)?;
    app.db.with(|c| {
        let l = crud::find(c, &schema::LISTING, &json!(id))?;
        if !sahip_mi(&l, uid) && !rbac::can(c, ModelRef::user(uid), "Delete:Listing")? {
            return Err(AppError::Forbidden("Bu ilanı kaldırma yetkin yok.".into()));
        }
        crud::delete(c, &schema::LISTING, &json!(id))?;
        audit::record(c, Some(uid), "Listing.delete", "Listing", id, None, Some(&l), None)?;
        Ok(())
    })
}

/// İlan detayı: telefon yalnız girişli kullanıcıya; yayında olmayan ilanı yalnız sahibi ve yetkililer görür.
pub fn do_ilan_detay(app: &AppState, id: &str) -> AppResult<Value> {
    app.db.with(|c| {
        let mut l = crud::find(c, &schema::LISTING, &json!(id))?;
        let uid = app.user();
        let yetkili = match uid {
            Some(u) => sahip_mi(&l, u) || rbac::can(c, ModelRef::user(u), "View:Listing")?,
            None => false,
        };
        if l["state"] != json!("published") && !yetkili {
            return Err(AppError::NotFound("İlan bulunamadı.".into()));
        }
        if uid.is_none() {
            l.as_object_mut().map(|m| m.remove("phone"));
        }
        Ok(l)
    })
}

/// İlan araması (herkese açık): yalnız yayındaki ilanlar; telefon ve ek fotoğraflar çıkarılır.
/// `filtreler`: marka, model, şehir, yakıt, vites, kasa, köken (origin), minPrice/maxPrice/minKm/maxKm/minYear/maxYear, sort, page.
pub fn do_ilan_ara(app: &AppState, f: &Value) -> AppResult<Value> {
    filtre_dogrula(f).map_err(|m| AppError::validation("filtreler", &m))?;
    app.db.with(|c| {
        let mut fl = Map::new();
        fl.insert("state".into(), json!("published"));
        for (k, hedef) in [("brand", "brand"), ("model", "model"), ("city", "city"), ("fuel", "fuel"), ("gear", "gear"), ("body", "body"), ("sellerType", "sellerType")] {
            if let Some(v) = f.get(k).filter(|v| !v.is_null()) {
                fl.insert(hedef.into(), v.clone());
            }
        }
        for (k, hedef) in [("minPrice", "priceMin"), ("maxPrice", "priceMax"), ("minKm", "kmMin"), ("maxKm", "kmMax"), ("minYear", "yearMin"), ("maxYear", "yearMax")] {
            if let Some(v) = f.get(k).filter(|v| !v.is_null()) {
                fl.insert(hedef.into(), v.clone());
            }
        }
        if let Some(koken) = f.get("origin").and_then(Value::as_str) {
            let mut st = c.prepare("SELECT name FROM catalog_brands WHERE origin = ?1")?;
            let markalar: Vec<String> = st.query_map([koken], |r| r.get::<_, String>(0))?.collect::<Result<Vec<_>, _>>()?;
            fl.insert("brand".into(), json!(markalar));
        }
        let sort = match f.get("sort").and_then(Value::as_str).unwrap_or("newest") {
            "price-asc" => ("price", "asc"),
            "price-desc" => ("price", "desc"),
            "km" => ("km", "asc"),
            "year" => ("year", "desc"),
            _ => ("createdAt", "desc"),
        };
        let q: ListQuery = serde_json::from_value(json!({ "filters": fl, "sort": { "key": sort.0, "dir": sort.1 }, "page": f.get("page"), "pageSize": 25 }))?;
        let mut p = crud::list(c, &schema::LISTING, &q)?;
        for it in p.items.iter_mut() {
            if let Some(m) = it.as_object_mut() {
                m.remove("phone");
                let ilk = m.get("images").and_then(|a| a.get(0)).cloned();
                let adet = m.get("images").and_then(Value::as_array).map(Vec::len).unwrap_or(0);
                m.remove("images");
                m.insert("image".into(), ilk.unwrap_or(Value::Null));
                m.insert("imageCount".into(), json!(adet));
            }
        }
        Ok(json!(p))
    })
}

/// Favori aç/kapa: eklendiyse true, çıkarıldıysa false.
pub fn do_favori_degistir(app: &AppState, listing_id: &str) -> AppResult<bool> {
    let uid = app.user().ok_or(AppError::Unauthenticated)?;
    app.db.with(|c| {
        crud::find(c, &schema::LISTING, &json!(listing_id))?;
        let var: bool = c.query_row("SELECT EXISTS(SELECT 1 FROM favorites WHERE userId = ?1 AND listingId = ?2)", params![uid, listing_id], |r| r.get(0))?;
        if var {
            c.execute("DELETE FROM favorites WHERE userId = ?1 AND listingId = ?2", params![uid, listing_id])?;
        } else {
            c.execute("INSERT INTO favorites (userId, listingId) VALUES (?1, ?2)", params![uid, listing_id])?;
        }
        Ok(!var)
    })
}

/// İlan şikâyeti (giriş gerekli; dakikada `report` sınırı). Şikâyetle birlikte açık bir moderasyon vakası oluşur.
pub fn do_sikayet_olustur(app: &AppState, listing_id: &str, neden: &str) -> AppResult<Value> {
    let uid = app.user().ok_or(AppError::Unauthenticated)?;
    app.db.with(|c| {
        hiz_siniri(c, uid, "report", "ListingReport.create")?;
        if !uzunluk(neden, 10, 1000) {
            return Err(AppError::validation("reason", "Şikâyet açıklaması 10–1000 karakter olmalı."));
        }
        crud::find(c, &schema::LISTING, &json!(listing_id))?;
        let tx = c.unchecked_transaction()?;
        let r = crud::insert(&tx, &schema::LISTING_REPORT, &json!({ "userId": uid, "listingId": listing_id, "reason": neden.trim(), "status": "pending" }))?;
        crud::insert(&tx, &schema::MODERATION_CASE, &json!({ "reportId": r["id"], "listingId": listing_id, "durum": "acik" }))?;
        tx.commit()?;
        audit::record(c, Some(uid), "ListingReport.create", "ListingReport", r["id"].as_str().unwrap_or(""), None, None, None)?;
        Ok(r)
    })
}

/// Vakayı incelemeye al (`Decide:ModerationCase`).
pub fn do_moderasyon_incele(app: &AppState, case_id: &str) -> AppResult<Value> {
    app.db.with(|c| {
        let uid = authorize(c, app.user(), "Decide:ModerationCase")?;
        let v = crud::find(c, &schema::MODERATION_CASE, &json!(case_id))?;
        if v["durum"] != json!("acik") {
            return Err(AppError::Conflict("Yalnız açık vaka incelemeye alınır.".into()));
        }
        let sonra = crud::update(c, &schema::MODERATION_CASE, &json!(case_id), &json!({ "durum": "inceleniyor", "isleyen": uid.to_string() }))?;
        c.execute("UPDATE listing_reports SET status = 'reviewing' WHERE id = ?1", [v["reportId"].as_str()])?;
        audit::record(c, Some(uid), "ModerationCase.review", "ModerationCase", case_id, None, Some(&v), Some(&sonra))?;
        Ok(sonra)
    })
}

/// Moderasyon kararı (`Decide:ModerationCase`): `ilan-kaldir | uyar | reddet | satici-askiya-al`. Not (≥ 5 karakter) zorunludur.
pub fn do_moderasyon_karar(app: &AppState, case_id: &str, karar: &str, not: &str) -> AppResult<Value> {
    app.db.with(|c| {
        let uid = authorize(c, app.user(), "Decide:ModerationCase")?;
        if !["ilan-kaldir", "uyar", "reddet", "satici-askiya-al"].contains(&karar) {
            return Err(AppError::validation("karar", "Karar geçersiz."));
        }
        if not.trim().chars().count() < 5 {
            return Err(AppError::validation("not", "Karar notu en az 5 karakter olmalı."));
        }
        let v = crud::find(c, &schema::MODERATION_CASE, &json!(case_id))?;
        if v["durum"] == json!("karar") {
            return Err(AppError::Conflict("Bu vaka zaten karara bağlanmış.".into()));
        }
        let ilan = crud::find(c, &schema::LISTING, &v["listingId"])?;
        let tx = c.unchecked_transaction()?;
        let rapor = if karar == "reddet" { "dismissed" } else { "actioned" };
        tx.execute("UPDATE listing_reports SET status = ?2 WHERE id = ?1", params![v["reportId"].as_str(), rapor])?;
        if karar == "ilan-kaldir" || karar == "satici-askiya-al" {
            tx.execute("UPDATE listings SET state = 'removed' WHERE id = ?1", [v["listingId"].as_str()])?;
        }
        if karar == "uyar" || karar == "satici-askiya-al" {
            let tur = if karar == "uyar" { "uyari" } else { "askiya" };
            tx.execute(
                "INSERT INTO user_sanctions (id, userId, tur, neden) VALUES (?1, ?2, ?3, ?4)",
                params![new_id(), ilan["ownerId"].as_i64(), tur, not.trim()],
            )?;
            if karar == "satici-askiya-al" {
                tx.execute("UPDATE users SET status = 'suspended' WHERE id = ?1 AND status = 'active'", [ilan["ownerId"].as_i64()])?;
            }
        }
        let sonra = crud::update(&tx, &schema::MODERATION_CASE, &json!(case_id), &json!({ "durum": "karar", "karar": karar, "note": not.trim(), "isleyen": uid.to_string(), "tarih": now_iso(&tx)? }))?;
        tx.commit()?;
        audit::record(c, Some(uid), "ModerationCase.decide", "ModerationCase", case_id, Some(not.trim()), Some(&v), Some(&sonra))?;
        Ok(sonra)
    })
}

/// Katalog fotoğrafını onayla / reddet (`Approve:MediaReview`). Onay için `medya_eksikleri` boş olmalı.
pub fn do_medya_incele(app: &AppState, model_id: &str, onayla: bool, kaynak_url: &str, not: Option<&str>) -> AppResult<Value> {
    app.db.with(|c| {
        let uid = authorize(c, app.user(), "Approve:MediaReview")?;
        let m = crud::find(c, &schema::CATALOG_MODEL, &json!(model_id))?;
        if onayla {
            let eksik = medya_eksikleri(&m["media"], kaynak_url);
            if !eksik.is_empty() {
                return Err(AppError::Validation(eksik.into_iter().map(|e| FieldError { field: "media".into(), message: e.into() }).collect()));
            }
        }
        c.execute(
            "INSERT INTO media_reviews (modelId, approved, sourceUrl, note) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(modelId) DO UPDATE SET approved = ?2, sourceUrl = ?3, note = ?4",
            params![model_id, onayla, kaynak_url, not],
        )?;
        let sonra = if onayla {
            crud::update(c, &schema::CATALOG_MODEL, &json!(model_id), &json!({ "image": m["media"]["file"], "mediaResearch": "model_family_reviewed" }))?
        } else {
            crud::update(c, &schema::CATALOG_MODEL, &json!(model_id), &json!({ "image": null, "mediaResearch": "not_researched" }))?
        };
        audit::record(c, Some(uid), if onayla { "MediaReview.approve" } else { "MediaReview.reject" }, "CatalogModel", model_id, not, Some(&m), Some(&sonra))?;
        Ok(sonra)
    })
}

/// Panel özeti: üye, yayındaki ilan, bekleyen şikâyet, günlük yeni ilan, marka/yakıt/şehir dağılımı.
pub fn do_otoiz_dashboard(app: &AppState) -> AppResult<Value> {
    app.db.with(|c| {
        authorize(c, app.user(), "ViewAny:Listing")?;
        let sayi = |sql: &str| -> AppResult<i64> { Ok(c.query_row(sql, [], |r| r.get(0))?) };
        let grup = |sql: &str| -> AppResult<Vec<Value>> {
            let mut st = c.prepare(sql)?;
            let rows = st.query_map([], |r| Ok(json!({ "value": r.get::<_, Option<String>>(0)?, "count": r.get::<_, i64>(1)? })))?;
            Ok(rows.collect::<Result<Vec<_>, _>>()?)
        };
        Ok(json!({
            "uyeler": sayi("SELECT COUNT(*) FROM users")?,
            "yayindakiIlan": sayi("SELECT COUNT(*) FROM listings WHERE state = 'published'")?,
            "bekleyenSikayet": sayi("SELECT COUNT(*) FROM listing_reports WHERE status IN ('pending', 'reviewing')")?,
            "gunlukYeniIlan": grup("SELECT substr(createdAt, 1, 10), COUNT(*) FROM listings GROUP BY 1 ORDER BY 1 DESC LIMIT 14")?,
            "markalar": grup("SELECT brand, COUNT(*) FROM listings WHERE state = 'published' GROUP BY brand ORDER BY 2 DESC LIMIT 10")?,
            "yakitlar": grup("SELECT fuel, COUNT(*) FROM listings WHERE state = 'published' GROUP BY fuel ORDER BY 2 DESC")?,
            "sehirler": grup("SELECT city, COUNT(*) FROM listings WHERE state = 'published' GROUP BY city ORDER BY 2 DESC LIMIT 10")?,
        }))
    })
}

// ───────────────────────── Tauri komutları ─────────────────────────

#[tauri::command]
pub fn ilan_olustur(state: State<'_, AppState>, girdi: Value) -> AppResult<Value> {
    do_ilan_olustur(&state, &girdi)
}
#[tauri::command]
pub fn ilan_sil(state: State<'_, AppState>, id: String) -> AppResult<()> {
    do_ilan_sil(&state, &id)
}
#[tauri::command]
pub fn ilan_detay(state: State<'_, AppState>, id: String) -> AppResult<Value> {
    do_ilan_detay(&state, &id)
}
#[tauri::command]
pub fn ilan_ara(state: State<'_, AppState>, filtreler: Option<Value>) -> AppResult<Value> {
    do_ilan_ara(&state, &filtreler.unwrap_or(json!({})))
}
#[tauri::command]
pub fn favori_degistir(state: State<'_, AppState>, listing_id: String) -> AppResult<bool> {
    do_favori_degistir(&state, &listing_id)
}
#[tauri::command]
pub fn sikayet_olustur(state: State<'_, AppState>, listing_id: String, neden: String) -> AppResult<Value> {
    do_sikayet_olustur(&state, &listing_id, &neden)
}
#[tauri::command]
pub fn moderasyon_incele(state: State<'_, AppState>, case_id: String) -> AppResult<Value> {
    do_moderasyon_incele(&state, &case_id)
}
#[tauri::command]
pub fn moderasyon_karar(state: State<'_, AppState>, case_id: String, karar: String, not: String) -> AppResult<Value> {
    do_moderasyon_karar(&state, &case_id, &karar, &not)
}
#[tauri::command]
pub fn medya_incele(state: State<'_, AppState>, model_id: String, onayla: bool, kaynak_url: String, not: Option<String>) -> AppResult<Value> {
    do_medya_incele(&state, &model_id, onayla, &kaynak_url, not.as_deref())
}
#[tauri::command]
pub fn otoiz_dashboard(state: State<'_, AppState>) -> AppResult<Value> {
    do_otoiz_dashboard(&state)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::backend::boot_memory;
    use crate::backend::controllers as c;

    // 1x1 piksel PNG (geçerli imza + yeterli uzunluk)
    const PNG: &str = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    fn ilan() -> Value {
        json!({ "brand": "BMW", "model": "320i M Sport", "price": 2485000, "year": 2022, "km": 42000, "city": "İstanbul", "color": "Gri",
                "fuel": "Benzin", "gear": "Otomatik", "body": "Sedan", "sellerType": "Bireysel",
                "description": "Bu bir örnek ilandır; ayrıntılar deneme amaçlıdır ve gerçek bir satış teklifi değildir.",
                "damage": "Örnek veri — rapor yok", "phone": "+90 500 000 00 00", "images": [PNG] })
    }

    #[test]
    fn dogrulama_kurallari() {
        assert!(ilan_dogrula(&ilan(), 2026).is_empty());
        let mut kisa = ilan();
        kisa["description"] = json!("çok kısa"); // 29 karakterden az
        assert!(ilan_dogrula(&kisa, 2026).iter().any(|e| e.field == "description"));
        let mut f = ilan();
        f["images"] = json!(["data:image/gif;base64,AAAA"]);
        assert!(!ilan_dogrula(&f, 2026).is_empty());
        let mut y = ilan();
        y["year"] = json!(2028);
        assert!(ilan_dogrula(&y, 2026).iter().any(|e| e.field == "year"));
        assert!(fotograf_dogrula(PNG).is_ok());
        assert!(fotograf_dogrula("data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAA").is_err()); // imza türle uyuşmuyor
        assert!(filtre_dogrula(&json!({ "minPrice": 100, "maxPrice": 50 })).is_err());
        assert!(filtre_dogrula(&json!({ "minYear": 1900 })).is_err());
        assert!(filtre_dogrula(&json!({ "minPrice": 100, "maxPrice": 500, "sort": "km" })).is_ok());
        assert_eq!(sikayet_onceligi(3), "yuksek");
        assert_eq!(sikayet_onceligi(2), "normal");
    }

    #[test]
    fn medya_kosullari() {
        let m = json!({ "file": "/araclar/bmw-3.jpg", "sourceUrl": "https://commons.wikimedia.org/x", "photographer": "Ali", "license": "CC BY-SA 4.0" });
        assert!(medya_eksikleri(&m, "https://commons.wikimedia.org/x").is_empty());
        assert_eq!(medya_eksikleri(&m, "https://baska.org").len(), 1);
        assert!(!medya_eksikleri(&json!({ "file": "/x/y.jpg" }), "").is_empty());
        assert!(!medya_eksikleri(&Value::Null, "").is_empty());
    }

    #[test]
    fn ilan_sikayet_moderasyon() {
        let app = boot_memory().unwrap();
        c::auth_register(&app, "Yönetici", "y@ornek.com", "gizli-parola-1").unwrap();
        c::auth_logout(&app);
        // satıcı (member)
        c::auth_register(&app, "Satıcı", "s@ornek.com", "gizli-parola-2").unwrap();
        let l = do_ilan_olustur(&app, &ilan()).unwrap();
        let id = l["id"].as_str().unwrap().to_string();
        assert_eq!(l["state"], json!("published"));
        assert_eq!(do_ilan_ara(&app, &json!({ "brand": "BMW", "minPrice": 1000000, "sort": "price-asc" })).unwrap()["total"], json!(1));
        assert!(do_ilan_ara(&app, &json!({ "origin": "Alman" })).unwrap()["total"].as_i64().unwrap() >= 1);
        assert_eq!(do_ilan_ara(&app, &json!({ "origin": "Japon" })).unwrap()["total"], json!(0));
        assert!(do_ilan_ara(&app, &json!({ "minPrice": 5, "maxPrice": 1 })).is_err());
        assert!(do_favori_degistir(&app, &id).unwrap());
        assert!(!do_favori_degistir(&app, &id).unwrap());
        // alıcı şikâyet eder
        c::auth_logout(&app);
        c::auth_register(&app, "Alıcı", "a@ornek.com", "gizli-parola-3").unwrap();
        assert!(do_sikayet_olustur(&app, &id, "kısa").is_err());
        let r = do_sikayet_olustur(&app, &id, "Fotoğraflar farklı bir araca ait görünüyor.").unwrap();
        assert_eq!(r["status"], json!("pending"));
        let vakalar = {
            c::auth_logout(&app);
            c::auth_login(&app, "y@ornek.com", "gizli-parola-1").unwrap();
            c::crud_index(&app, "ModerationCase", Default::default()).unwrap()
        };
        assert_eq!(vakalar.total, 1);
        let vid = vakalar.items[0]["id"].as_str().unwrap().to_string();
        assert!(do_moderasyon_karar(&app, &vid, "ilan-kaldir", "x").is_err()); // not kısa
        do_moderasyon_incele(&app, &vid).unwrap();
        let k = do_moderasyon_karar(&app, &vid, "satici-askiya-al", "Yanıltıcı fotoğraf, tekrar eden ihlal.").unwrap();
        assert_eq!(k["durum"], json!("karar"));
        assert_eq!(c::crud_show(&app, "Listing", &json!(id)).unwrap()["state"], json!("removed"));
        assert_eq!(c::crud_show(&app, "ListingReport", &r["id"]).unwrap()["status"], json!("actioned"));
        assert_eq!(do_moderasyon_karar(&app, &vid, "reddet", "tekrar dene").unwrap_err().code(), "conflict");
        // kaldırılan ilan anonim kullanıcıya görünmez; satıcı askıda
        c::auth_logout(&app);
        assert_eq!(do_ilan_detay(&app, &id).unwrap_err().code(), "not_found");
        assert!(c::auth_login(&app, "s@ornek.com", "gizli-parola-2").is_err());
        // üye moderasyon kararı veremez
        c::auth_login(&app, "a@ornek.com", "gizli-parola-3").unwrap();
        assert_eq!(do_moderasyon_incele(&app, &vid).unwrap_err().code(), "forbidden");
    }

    #[test]
    fn hiz_siniri_ilan() {
        let app = boot_memory().unwrap();
        c::auth_register(&app, "Yönetici", "y@ornek.com", "gizli-parola-1").unwrap();
        for _ in 0..8 {
            do_ilan_olustur(&app, &ilan()).unwrap();
        }
        assert_eq!(do_ilan_olustur(&app, &ilan()).unwrap_err().code(), "conflict"); // dakikada 8
    }
}
