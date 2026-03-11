-- Migration: add_show_host_and_drop_show_hostId
-- NOTE: This migration was generated manually. Review carefully before applying to non-dev environments.

-- 1) Create show_hosts table
CREATE TABLE IF NOT EXISTS "show_hosts" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "show_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "revenue_share_type" TEXT,
    "revenue_share_value" INTEGER,
    "is_primary" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Add indexes and uniqueness constraints
CREATE UNIQUE INDEX IF NOT EXISTS "show_hosts_show_id_user_id_key" ON "show_hosts"("show_id", "user_id");
CREATE INDEX IF NOT EXISTS "show_hosts_show_id_idx" ON "show_hosts"("show_id");
CREATE INDEX IF NOT EXISTS "show_hosts_user_id_idx" ON "show_hosts"("user_id");

-- 3) Add foreign keys
ALTER TABLE "show_hosts"
  ADD CONSTRAINT "show_hosts_show_id_fkey"
  FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "show_hosts"
  ADD CONSTRAINT "show_hosts_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4) Optional data backfill from shows.host into show_hosts
-- TODO: If you have existing data in the "host" column on "shows",
--       run a one-time backfill BEFORE dropping the column, e.g.:
--       INSERT INTO "show_hosts" ("show_id", "user_id", "is_primary")
--       SELECT "id", "host", TRUE FROM "shows" WHERE "host" IS NOT NULL;

-- 5) Drop obsolete host column from shows
ALTER TABLE "shows" DROP COLUMN IF EXISTS "host";

