-- otoiz tabloları. Sütun adları ön yüz tipleriyle birebir (camelCase); tablo adları snake_case.

CREATE TABLE "listings" (
    "id" TEXT PRIMARY KEY,
    "ownerId" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "sellerName" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    "demo" INTEGER NOT NULL DEFAULT 0 CHECK ("demo" IN (0, 1)),
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "km" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "fuel" TEXT NOT NULL CHECK ("fuel" IN ('Benzin', 'Dizel', 'Hibrit', 'Elektrik', 'LPG')),
    "gear" TEXT NOT NULL CHECK ("gear" IN ('Otomatik', 'Manuel')),
    "body" TEXT NOT NULL CHECK ("body" IN ('Sedan', 'SUV', 'Hatchback', 'Coupe', 'Diğer')),
    "sellerType" TEXT NOT NULL CHECK ("sellerType" IN ('Bireysel', 'Galeri')),
    "description" TEXT NOT NULL,
    "damage" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'published' CHECK ("state" IN ('published', 'under-review', 'removed', 'rejected')),
    CHECK ("price" BETWEEN 1000 AND 100000000),
    CHECK ("km" BETWEEN 0 AND 3000000),
    CHECK ("year" >= 1950)
);
CREATE INDEX listings_ownerId_index ON "listings" ("ownerId");
CREATE INDEX listings_state_index ON "listings" ("state");
CREATE INDEX listings_brand_index ON "listings" ("brand");

CREATE TABLE "favorites" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "listingId" TEXT NOT NULL REFERENCES "listings" ("id") ON DELETE CASCADE,
    UNIQUE ("userId", "listingId")
);

CREATE TABLE "listing_reports" (
    "id" TEXT PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "listingId" TEXT NOT NULL REFERENCES "listings" ("id") ON DELETE CASCADE,
    "reason" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    "status" TEXT NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'reviewing', 'actioned', 'dismissed'))
);
CREATE INDEX listing_reports_status_index ON "listing_reports" ("status");
CREATE INDEX listing_reports_listingId_index ON "listing_reports" ("listingId");

CREATE TABLE "catalog_brands" (
    "name" TEXT PRIMARY KEY,
    "modelCount" INTEGER NOT NULL DEFAULT 0,
    "origin" TEXT CHECK ("origin" IS NULL OR "origin" IN ('Alman', 'Japon', 'Fransız', 'İtalyan', 'Koreli', 'İsveçli', 'Amerikan', 'Türk', 'İspanyol', 'Çek', 'Çinli', 'İngiliz'))
);

CREATE TABLE "catalog_models" (
    "id" TEXT PRIMARY KEY,
    "brand" TEXT NOT NULL REFERENCES "catalog_brands" ("name") ON DELETE CASCADE,
    "model" TEXT NOT NULL,
    "priceVerified" INTEGER NOT NULL DEFAULT 0 CHECK ("priceVerified" IN (0, 1)),
    "image" TEXT,
    "media" TEXT,
    "mediaResearch" TEXT NOT NULL DEFAULT 'not_researched',
    "priceSamples" TEXT NOT NULL DEFAULT '[]',
    "priceStatus" TEXT NOT NULL DEFAULT 'Doğrulanmış fiyat bulunamadı',
    "source" TEXT NOT NULL DEFAULT '',
    "sourceId" TEXT NOT NULL UNIQUE
);
CREATE INDEX catalog_models_brand_index ON "catalog_models" ("brand");

CREATE TABLE "media_reviews" (
    "modelId" TEXT PRIMARY KEY,
    "approved" INTEGER NOT NULL DEFAULT 0 CHECK ("approved" IN (0, 1)),
    "sourceUrl" TEXT NOT NULL DEFAULT '',
    "note" TEXT
);

CREATE TABLE "moderation_cases" (
    "id" TEXT PRIMARY KEY,
    "reportId" TEXT NOT NULL REFERENCES "listing_reports" ("id") ON DELETE CASCADE,
    "listingId" TEXT NOT NULL REFERENCES "listings" ("id") ON DELETE CASCADE,
    "durum" TEXT NOT NULL DEFAULT 'acik' CHECK ("durum" IN ('acik', 'inceleniyor', 'karar')),
    "karar" TEXT CHECK ("karar" IS NULL OR "karar" IN ('ilan-kaldir', 'uyar', 'reddet', 'satici-askiya-al')),
    "note" TEXT,
    "isleyen" TEXT,
    "tarih" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE "user_sanctions" (
    "id" TEXT PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "tur" TEXT NOT NULL CHECK ("tur" IN ('uyari', 'askiya', 'yasak')),
    "neden" TEXT NOT NULL,
    "bitis" TEXT
);

CREATE TABLE "rate_limits" (
    "key" TEXT PRIMARY KEY,
    "perMinute" INTEGER NOT NULL,
    CHECK ("key" IN ('auth', 'listing', 'report', 'assistant'))
);
