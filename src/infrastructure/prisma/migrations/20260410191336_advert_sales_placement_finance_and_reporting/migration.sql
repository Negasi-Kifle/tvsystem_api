/*
  Warnings:

  - Made the column `advert_sales_id` on table `advert_placements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `advert_placements` required. This step will fail if there are existing NULL values in that column.
  - Made the column `advert_sales_id` on table `compensations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `advert_sales_id` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- RenameConstraint
ALTER TABLE "advert_placements" RENAME CONSTRAINT "adverts_pkey" TO "advert_placements_pkey";

-- AlterTable
ALTER TABLE "advert_placements"
ALTER COLUMN "advert_sales_id" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date_eth" DROP DEFAULT,
ALTER COLUMN "position" DROP DEFAULT,
ALTER COLUMN "duration_seconds" DROP DEFAULT;

-- AlterTable
ALTER TABLE "compensations" ALTER COLUMN "advert_sales_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'Pending',
ALTER COLUMN "advert_sales_id" SET NOT NULL;
