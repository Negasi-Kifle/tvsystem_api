-- Rename legacy sales agent (rep) columns to sales rep naming
ALTER TABLE "advert_sales" RENAME COLUMN "sales_agent_id" TO "sales_rep_id";
ALTER TABLE "advert_sales" RENAME COLUMN "agent_commission_percentage" TO "sales_rep_commission_percentage";

ALTER INDEX "advert_sales_sales_agent_id_idx" RENAME TO "advert_sales_sales_rep_id_idx";

ALTER TABLE "advert_sales" RENAME CONSTRAINT "advert_sales_sales_agent_id_fkey" TO "advert_sales_sales_rep_id_fkey";

-- Remove deprecated string fields
ALTER TABLE "advert_sales" DROP COLUMN "industry";
ALTER TABLE "advert_sales" DROP COLUMN "advert_agency";

-- Optional category/subcategory and optional external sales agent (User)
ALTER TABLE "advert_sales"
ADD COLUMN "category_id" TEXT,
ADD COLUMN "sub_category_id" TEXT,
ADD COLUMN "sales_agent_id" TEXT,
ADD COLUMN "sales_agent_commission_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "advert_sales" ADD CONSTRAINT "advert_sales_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "advert_sales" ADD CONSTRAINT "advert_sales_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "advert_sales" ADD CONSTRAINT "advert_sales_sales_agent_id_fkey" FOREIGN KEY ("sales_agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "advert_sales_category_id_idx" ON "advert_sales"("category_id");

CREATE INDEX "advert_sales_sub_category_id_idx" ON "advert_sales"("sub_category_id");

CREATE INDEX "advert_sales_sales_agent_id_idx" ON "advert_sales"("sales_agent_id");
