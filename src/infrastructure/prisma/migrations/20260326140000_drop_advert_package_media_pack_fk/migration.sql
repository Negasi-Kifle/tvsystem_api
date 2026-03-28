-- Backfill junction from legacy advert_packages.media_pack_id (idempotent)
INSERT INTO "advert_package_media_packs" ("id", "advert_package_id", "media_pack_id", "created_at", "updated_at")
SELECT gen_random_uuid()::text, ap."id", ap."media_pack_id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "advert_packages" ap
WHERE ap."media_pack_id" IS NOT NULL
ON CONFLICT ("advert_package_id", "media_pack_id") DO NOTHING;

-- Drop old composite unique + FK + index on advert_packages.media_pack_id
DROP INDEX IF EXISTS "advert_packages_media_pack_id_name_slug_key";

DROP INDEX IF EXISTS "advert_packages_media_pack_id_idx";

ALTER TABLE "advert_packages" DROP CONSTRAINT IF EXISTS "advert_packages_media_pack_id_fkey";

-- Global slug uniqueness (fails if duplicate name_slug rows exist)
CREATE UNIQUE INDEX "advert_packages_name_slug_key" ON "advert_packages"("name_slug");

ALTER TABLE "advert_packages" DROP COLUMN "media_pack_id";
