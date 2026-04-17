-- Backfill junction rows from legacy show_ids where missing (only when show still exists).
INSERT INTO "advert_package_shows" ("id", "advert_package_id", "show_id")
SELECT gen_random_uuid()::text, ap."id", sid.show_id
FROM "advert_packages" ap
CROSS JOIN LATERAL unnest(COALESCE(ap."show_ids", ARRAY[]::text[])) AS sid(show_id)
INNER JOIN "shows" s ON s."id" = sid.show_id
WHERE NOT EXISTS (
  SELECT 1 FROM "advert_package_shows" aps
  WHERE aps."advert_package_id" = ap."id" AND aps."show_id" = sid.show_id
);

-- Drop redundant denormalized column; AdvertPackageShow is the source of truth.
ALTER TABLE "advert_packages" DROP COLUMN "show_ids";
