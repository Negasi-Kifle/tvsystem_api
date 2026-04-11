-- DropForeignKey (old Payment -> Advert)
ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_advert_id_fkey";

-- DropForeignKey (old Compensation -> Advert)
ALTER TABLE "compensations" DROP CONSTRAINT IF EXISTS "compensations_advert_id_fkey";

-- DropIndex (old adverts indexes)
DROP INDEX IF EXISTS "adverts_show_id_idx";
DROP INDEX IF EXISTS "adverts_customer_id_idx";
DROP INDEX IF EXISTS "adverts_broadcast_slot_id_idx";
DROP INDEX IF EXISTS "adverts_status_idx";

-- Rename table
ALTER TABLE "adverts" RENAME TO "advert_placements";

-- Drop old columns that are no longer needed
ALTER TABLE "advert_placements" DROP COLUMN IF EXISTS "customer_id";
ALTER TABLE "advert_placements" DROP COLUMN IF EXISTS "slot";
ALTER TABLE "advert_placements" DROP COLUMN IF EXISTS "contract_details";

-- Add new columns
ALTER TABLE "advert_placements" ADD COLUMN "advert_sales_id" TEXT;
ALTER TABLE "advert_placements" ADD COLUMN "date" TIMESTAMP(3);
ALTER TABLE "advert_placements" ADD COLUMN "date_eth" TEXT NOT NULL DEFAULT '';
ALTER TABLE "advert_placements" ADD COLUMN "position" TEXT NOT NULL DEFAULT 'Middle';
ALTER TABLE "advert_placements" ADD COLUMN "spot_index" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "advert_placements" ADD COLUMN "broadcast_code" TEXT;
ALTER TABLE "advert_placements" ADD COLUMN "planned_time_minutes" INTEGER;
ALTER TABLE "advert_placements" ADD COLUMN "actual_air_time" TIMESTAMP(3);
ALTER TABLE "advert_placements" ADD COLUMN "duration_seconds" INTEGER NOT NULL DEFAULT 0;

-- Update default status
ALTER TABLE "advert_placements" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';

-- CreateIndex for new columns
CREATE INDEX "advert_placements_advert_sales_id_idx" ON "advert_placements"("advert_sales_id");
CREATE INDEX "advert_placements_show_id_idx" ON "advert_placements"("show_id");
CREATE INDEX "advert_placements_broadcast_slot_id_idx" ON "advert_placements"("broadcast_slot_id");
CREATE INDEX "advert_placements_date_idx" ON "advert_placements"("date");
CREATE INDEX "advert_placements_status_idx" ON "advert_placements"("status");

-- AddForeignKey (AdvertPlacement -> AdvertSales)
ALTER TABLE "advert_placements" ADD CONSTRAINT "advert_placements_advert_sales_id_fkey" FOREIGN KEY ("advert_sales_id") REFERENCES "advert_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey (AdvertPlacement -> Show)
ALTER TABLE "advert_placements" ADD CONSTRAINT "advert_placements_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey (AdvertPlacement -> BroadcastSlot)
ALTER TABLE "advert_placements" ADD CONSTRAINT "advert_placements_broadcast_slot_id_fkey" FOREIGN KEY ("broadcast_slot_id") REFERENCES "broadcast_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ==================================================
-- Rework PAYMENTS: relink from advertId to advertSalesId
-- ==================================================
ALTER TABLE "payments" DROP COLUMN IF EXISTS "advert_id";
ALTER TABLE "payments" ADD COLUMN "advert_sales_id" TEXT;
ALTER TABLE "payments" ADD COLUMN "payment_request_ref" TEXT;
ALTER TABLE "payments" ADD COLUMN "installment_number" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "payments" ADD COLUMN "amount_before_vat" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "vat_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "withhold_tax" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "vat_withhold" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "bank_deposit" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "payments" ADD COLUMN "payment_date" TIMESTAMP(3);
ALTER TABLE "payments" ADD COLUMN "payment_method" TEXT;
ALTER TABLE "payments" ADD COLUMN "bank_deposit_date" TIMESTAMP(3);
ALTER TABLE "payments" ADD COLUMN "bank_confirmation" TEXT;
ALTER TABLE "payments" ADD COLUMN "fs_number" TEXT;
ALTER TABLE "payments" ADD COLUMN "request_sent_date" TIMESTAMP(3);

-- Drop old amount JSON column
ALTER TABLE "payments" DROP COLUMN IF EXISTS "amount";

-- Unique constraint on payment_request_ref
CREATE UNIQUE INDEX "payments_payment_request_ref_key" ON "payments"("payment_request_ref");

-- ReIndex payments
DROP INDEX IF EXISTS "payments_advert_id_idx";
CREATE INDEX "payments_advert_sales_id_idx" ON "payments"("advert_sales_id");

-- AddForeignKey (Payment -> AdvertSales)
ALTER TABLE "payments" ADD CONSTRAINT "payments_advert_sales_id_fkey" FOREIGN KEY ("advert_sales_id") REFERENCES "advert_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ==================================================
-- Rework COMPENSATIONS: relink from advertId to advertSalesId, add new fields
-- ==================================================
ALTER TABLE "compensations" DROP COLUMN IF EXISTS "advert_id";
ALTER TABLE "compensations" ADD COLUMN "advert_sales_id" TEXT;
ALTER TABLE "compensations" ADD COLUMN "advert_placement_id" TEXT;
ALTER TABLE "compensations" ADD COLUMN "missed_date" TIMESTAMP(3);
ALTER TABLE "compensations" ADD COLUMN "compensation_type" TEXT;
ALTER TABLE "compensations" ADD COLUMN "compensation_details" JSONB;
ALTER TABLE "compensations" ADD COLUMN "proposed_by_id" TEXT;
ALTER TABLE "compensations" ADD COLUMN "responded_at" TIMESTAMP(3);

-- ReIndex compensations
DROP INDEX IF EXISTS "compensations_advert_id_idx";
CREATE INDEX "compensations_advert_sales_id_idx" ON "compensations"("advert_sales_id");
CREATE INDEX "compensations_advert_placement_id_idx" ON "compensations"("advert_placement_id");

-- AddForeignKey (Compensation -> AdvertSales)
ALTER TABLE "compensations" ADD CONSTRAINT "compensations_advert_sales_id_fkey" FOREIGN KEY ("advert_sales_id") REFERENCES "advert_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey (Compensation -> AdvertPlacement)
ALTER TABLE "compensations" ADD CONSTRAINT "compensations_advert_placement_id_fkey" FOREIGN KEY ("advert_placement_id") REFERENCES "advert_placements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey (Compensation -> User as proposedBy)
ALTER TABLE "compensations" ADD CONSTRAINT "compensations_proposed_by_id_fkey" FOREIGN KEY ("proposed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
