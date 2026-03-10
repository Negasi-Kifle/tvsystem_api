-- AlterTable
ALTER TABLE "shows" ADD COLUMN "total_duration_minutes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "shows" ADD COLUMN "parts_count" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "shows" ADD COLUMN "reruns_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "shows" ADD COLUMN "bonus_count" INTEGER NOT NULL DEFAULT 0;

-- Backfill total_duration_minutes from existing duration and ad length
UPDATE "shows" SET "total_duration_minutes" = "duration_minutes" + "max_ad_length_minutes" WHERE "total_duration_minutes" = 0;

-- Drop defaults now that data is backfilled to match Prisma schema
ALTER TABLE "shows" ALTER COLUMN "total_duration_minutes" DROP DEFAULT;
ALTER TABLE "shows" ALTER COLUMN "parts_count" DROP DEFAULT;
