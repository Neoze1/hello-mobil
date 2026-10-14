//! Bu uygulamanın tabloları ve kaynak tanımları.
//! Sütun adları `src/` altındaki TypeScript tipleriyle ve tasarım belgelerindeki alan adlarıyla birebir aynıdır.
use crate::backend::crud::{col, req, Entity, Kind};
use crate::backend::error::{AppError, AppResult};
pub use crate::backend::schema_common::*;

/// Kayıt olan (ilk kullanıcı dışındaki) herkese verilen rol; `None` ise rolsüz kalır.
pub const DEFAULT_ROLE: Option<&str> = Some("member");

pub static LISTING: Entity = Entity {
    resource: "Listing",
    table: "listings",
    pk: "id",
    pk_kind: Kind::Text,
    cols: &[
        req("ownerId", Kind::Int),
        req("sellerName", Kind::Text),
        col("createdAt", Kind::Date),
        col("demo", Kind::Bool),
        req("brand", Kind::Text),
        req("model", Kind::Text),
        req("price", Kind::Int),
        req("year", Kind::Int),
        req("km", Kind::Int),
        req("city", Kind::Text),
        req("color", Kind::Text),
        req("fuel", Kind::Text),
        req("gear", Kind::Text),
        req("body", Kind::Text),
        req("sellerType", Kind::Text),
        req("description", Kind::Text),
        req("damage", Kind::Text),
        req("phone", Kind::Text),
        req("images", Kind::Json),
        col("state", Kind::Text),
    ],
    search: &["brand", "model", "city", "description"],
    filters: &["ownerId", "brand", "model", "city", "fuel", "gear", "body", "sellerType", "demo", "state", "price", "year", "km"],
    order_by: "\"createdAt\" DESC",
    readonly: false,
};

pub static FAVORITE: Entity = Entity {
    resource: "Favorite",
    table: "favorites",
    pk: "id",
    pk_kind: Kind::Int,
    cols: &[
        req("userId", Kind::Int),
        req("listingId", Kind::Text),
    ],
    search: &[],
    filters: &["userId", "listingId"],
    order_by: "\"id\" DESC",
    readonly: false,
};

pub static LISTING_REPORT: Entity = Entity {
    resource: "ListingReport",
    table: "listing_reports",
    pk: "id",
    pk_kind: Kind::Text,
    cols: &[
        req("userId", Kind::Int),
        req("listingId", Kind::Text),
        req("reason", Kind::Text),
        col("createdAt", Kind::Date),
        col("status", Kind::Text),
    ],
    search: &["reason"],
    filters: &["userId", "listingId", "status", "createdAt"],
    order_by: "\"createdAt\" DESC",
    readonly: false,
};

pub static CATALOG_BRAND: Entity = Entity {
    resource: "CatalogBrand",
    table: "catalog_brands",
    pk: "name",
    pk_kind: Kind::Text,
    cols: &[
        col("modelCount", Kind::Int),
        col("origin", Kind::Text),
    ],
    search: &["name"],
    filters: &["origin"],
    order_by: "\"name\" ASC",
    readonly: false,
};

pub static CATALOG_MODEL: Entity = Entity {
    resource: "CatalogModel",
    table: "catalog_models",
    pk: "id",
    pk_kind: Kind::Text,
    cols: &[
        req("brand", Kind::Text),
        req("model", Kind::Text),
        col("priceVerified", Kind::Bool),
        col("image", Kind::Text),
        col("media", Kind::Json),
        col("mediaResearch", Kind::Text),
        col("priceSamples", Kind::Json),
        col("priceStatus", Kind::Text),
        col("source", Kind::Text),
        req("sourceId", Kind::Text),
    ],
    search: &["brand", "model"],
    filters: &["brand", "mediaResearch", "priceVerified"],
    order_by: "\"brand\" ASC, \"model\" ASC",
    readonly: false,
};

pub static MEDIA_REVIEW: Entity = Entity {
    resource: "MediaReview",
    table: "media_reviews",
    pk: "modelId",
    pk_kind: Kind::Text,
    cols: &[
        col("approved", Kind::Bool),
        col("sourceUrl", Kind::Text),
        col("note", Kind::Text),
    ],
    search: &[],
    filters: &["approved"],
    order_by: "\"modelId\" ASC",
    readonly: false,
};

pub static MODERATION_CASE: Entity = Entity {
    resource: "ModerationCase",
    table: "moderation_cases",
    pk: "id",
    pk_kind: Kind::Text,
    cols: &[
        req("reportId", Kind::Text),
        req("listingId", Kind::Text),
        col("durum", Kind::Text),
        col("karar", Kind::Text),
        col("note", Kind::Text),
        col("isleyen", Kind::Text),
        col("tarih", Kind::Date),
    ],
    search: &[],
    filters: &["reportId", "listingId", "durum", "karar"],
    order_by: "\"tarih\" DESC",
    readonly: false,
};

pub static USER_SANCTION: Entity = Entity {
    resource: "UserSanction",
    table: "user_sanctions",
    pk: "id",
    pk_kind: Kind::Text,
    cols: &[
        req("userId", Kind::Int),
        req("tur", Kind::Text),
        req("neden", Kind::Text),
        col("bitis", Kind::Date),
    ],
    search: &[],
    filters: &["userId", "tur"],
    order_by: "\"id\" DESC",
    readonly: false,
};

pub static RATE_LIMIT: Entity = Entity {
    resource: "RateLimit",
    table: "rate_limits",
    pk: "key",
    pk_kind: Kind::Text,
    cols: &[
        req("perMinute", Kind::Int),
    ],
    search: &[],
    filters: &[],
    order_by: "\"key\" ASC",
    readonly: false,
};

pub static PROJECT: &[&Entity] = &[&LISTING, &FAVORITE, &LISTING_REPORT, &CATALOG_BRAND, &CATALOG_MODEL, &MEDIA_REVIEW, &MODERATION_CASE, &USER_SANCTION, &RATE_LIMIT];

/// Bütün kaynaklar: ortak + bu uygulamanınkiler.
pub fn all() -> Vec<&'static Entity> {
    let mut v: Vec<&'static Entity> = vec![&CONTACT_MESSAGE, &CONTENT_PAGE, &AUDIT_LOG];
    v.extend(PROJECT.iter().copied());
    v
}

pub fn entity(resource: &str) -> AppResult<&'static Entity> {
    all().into_iter().find(|e| e.resource == resource)
        .ok_or_else(|| AppError::NotFound(format!("`{resource}` adında bir kaynak yok.")))
}
