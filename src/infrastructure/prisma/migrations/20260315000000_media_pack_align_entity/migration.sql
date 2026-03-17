/*
  Warnings:

  - You are about to drop the column `name` on the `media_packs` table. All the data in the column will be lost.
  - You are about to drop the column `versions` on the `media_packs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[version_slug]` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `version` to the `media_packs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version_slug` to the `media_packs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: add new columns (nullable first for existing data)
ALTER TABLE "media_packs" ADD COLUMN IF NOT EXISTS "version" TEXT;
ALTER TABLE "media_packs" ADD COLUMN IF NOT EXISTS "version_slug" TEXT;
ALTER TABLE "media_packs" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN DEFAULT true;

-- Backfill existing rows so new columns are non-null
UPDATE "media_packs" SET "version" = 'legacy', "version_slug" = "id" WHERE "version" IS NULL;

-- Make new columns required
ALTER TABLE "media_packs" ALTER COLUMN "version" SET NOT NULL;
ALTER TABLE "media_packs" ALTER COLUMN "version_slug" SET NOT NULL;
ALTER TABLE "media_packs" ALTER COLUMN "is_active" SET NOT NULL;
ALTER TABLE "media_packs" ALTER COLUMN "is_active" SET DEFAULT true;

-- Drop old columns
ALTER TABLE "media_packs" DROP COLUMN IF EXISTS "name";
ALTER TABLE "media_packs" DROP COLUMN IF EXISTS "versions";

-- Unique constraint on version_slug
CREATE UNIQUE INDEX "media_packs_version_slug_key" ON "media_packs"("version_slug");
