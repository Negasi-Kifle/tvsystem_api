-- AlterTable: replace total_amount with package price, discount, and final price
ALTER TABLE "advert_sales" ADD COLUMN "ad_package_price" DOUBLE PRECISION;
ALTER TABLE "advert_sales" ADD COLUMN "discount_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "advert_sales" ADD COLUMN "final_price" DOUBLE PRECISION;

UPDATE "advert_sales"
SET
  "ad_package_price" = "total_amount",
  "final_price" = "total_amount",
  "discount_percentage" = 0
WHERE "ad_package_price" IS NULL;

ALTER TABLE "advert_sales" ALTER COLUMN "ad_package_price" SET NOT NULL;
ALTER TABLE "advert_sales" ALTER COLUMN "final_price" SET NOT NULL;
ALTER TABLE "advert_sales" DROP COLUMN "total_amount";
