-- Roller ve izinler (spatie/laravel-permission + Filament Shield düzeni). Veri-yalnız ve yinelenebilir.

INSERT OR IGNORE INTO roles (name, guard_name, created_at, updated_at) VALUES
    ('admin', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('moderator', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('catalog_editor', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('support', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('content', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('viewer', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('member', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));

WITH actions(action) AS (VALUES ('ViewAny'), ('View'), ('Create'), ('Update'), ('Delete'), ('DeleteAny')),
     resources(resource) AS (VALUES ('Listing'), ('Favorite'), ('ListingReport'), ('CatalogBrand'), ('CatalogModel'), ('MediaReview'), ('ModerationCase'), ('UserSanction'), ('RateLimit'), ('ContactMessage'), ('ContentPage'), ('AuditLog'), ('User'), ('Role'), ('Permission'))
INSERT OR IGNORE INTO permissions (name, guard_name, created_at, updated_at)
SELECT action || ':' || resource, 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now') FROM actions, resources;

INSERT OR IGNORE INTO permissions (name, guard_name, created_at, updated_at) VALUES
    ('Decide:ModerationCase', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('Approve:MediaReview', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ('Reveal:PII', 'web', strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));

-- moderator
INSERT OR IGNORE INTO role_has_permissions (permission_id, role_id)
SELECT p.id, r.id FROM permissions p JOIN roles r ON r.name = 'moderator' AND r.guard_name = 'web'
WHERE p.guard_name = 'web' AND p.name IN (
    'ViewAny:ModerationCase', 'View:ModerationCase', 'Create:ModerationCase', 'Update:ModerationCase',
    'Delete:ModerationCase', 'DeleteAny:ModerationCase', 'ViewAny:UserSanction', 'View:UserSanction',
    'Create:UserSanction', 'Update:UserSanction', 'Delete:UserSanction', 'DeleteAny:UserSanction',
    'ViewAny:Listing', 'View:Listing', 'Update:Listing', 'Delete:Listing',
    'ViewAny:ListingReport', 'View:ListingReport', 'Update:ListingReport', 'Delete:ListingReport',
    'Decide:ModerationCase'
);

-- catalog_editor
INSERT OR IGNORE INTO role_has_permissions (permission_id, role_id)
SELECT p.id, r.id FROM permissions p JOIN roles r ON r.name = 'catalog_editor' AND r.guard_name = 'web'
WHERE p.guard_name = 'web' AND p.name IN (
    'ViewAny:CatalogBrand', 'View:CatalogBrand', 'Create:CatalogBrand', 'Update:CatalogBrand',
    'Delete:CatalogBrand', 'DeleteAny:CatalogBrand', 'ViewAny:CatalogModel', 'View:CatalogModel',
    'Create:CatalogModel', 'Update:CatalogModel', 'Delete:CatalogModel', 'DeleteAny:CatalogModel',
    'ViewAny:MediaReview', 'View:MediaReview', 'Create:MediaReview', 'Update:MediaReview',
    'Delete:MediaReview', 'DeleteAny:MediaReview', 'Approve:MediaReview'
);

-- support
INSERT OR IGNORE INTO role_has_permissions (permission_id, role_id)
SELECT p.id, r.id FROM permissions p JOIN roles r ON r.name = 'support' AND r.guard_name = 'web'
WHERE p.guard_name = 'web' AND p.name IN (
    'ViewAny:ContactMessage', 'View:ContactMessage', 'Create:ContactMessage', 'Update:ContactMessage',
    'Delete:ContactMessage', 'DeleteAny:ContactMessage', 'ViewAny:Listing', 'View:Listing',
    'ViewAny:ListingReport', 'View:ListingReport'
);

-- content
INSERT OR IGNORE INTO role_has_permissions (permission_id, role_id)
SELECT p.id, r.id FROM permissions p JOIN roles r ON r.name = 'content' AND r.guard_name = 'web'
WHERE p.guard_name = 'web' AND p.name IN (
    'ViewAny:ContentPage', 'View:ContentPage', 'Create:ContentPage', 'Update:ContentPage',
    'Delete:ContentPage', 'DeleteAny:ContentPage'
);

-- viewer
INSERT OR IGNORE INTO role_has_permissions (permission_id, role_id)
SELECT p.id, r.id FROM permissions p JOIN roles r ON r.name = 'viewer' AND r.guard_name = 'web'
WHERE p.guard_name = 'web' AND p.name IN (
    'ViewAny:Listing', 'View:Listing', 'ViewAny:Favorite', 'View:Favorite',
    'ViewAny:ListingReport', 'View:ListingReport', 'ViewAny:CatalogBrand', 'View:CatalogBrand',
    'ViewAny:CatalogModel', 'View:CatalogModel', 'ViewAny:MediaReview', 'View:MediaReview',
    'ViewAny:ModerationCase', 'View:ModerationCase', 'ViewAny:UserSanction', 'View:UserSanction',
    'ViewAny:RateLimit', 'View:RateLimit', 'ViewAny:ContactMessage', 'View:ContactMessage',
    'ViewAny:ContentPage', 'View:ContentPage'
);
