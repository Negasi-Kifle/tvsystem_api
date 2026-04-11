-- AlterTable
ALTER TABLE "advert_sales"
ADD COLUMN "advert_type" TEXT NOT NULL DEFAULT 'Paid',
ADD COLUMN "sales_agent_id" TEXT,
ADD COLUMN "agent_commission_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "industry" TEXT,
ADD COLUMN "festive_season" TEXT,
ADD COLUMN "referral_source" TEXT,
ADD COLUMN "advert_agency" TEXT,
ADD COLUMN "notes" TEXT;

-- CreateIndex
CREATE INDEX "advert_sales_sales_agent_id_idx" ON "advert_sales"("sales_agent_id");

-- AddForeignKey
ALTER TABLE "advert_sales" ADD CONSTRAINT "advert_sales_sales_agent_id_fkey" FOREIGN KEY ("sales_agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
