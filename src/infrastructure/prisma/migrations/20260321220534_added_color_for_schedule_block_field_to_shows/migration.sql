-- AlterTable
ALTER TABLE "shows" ADD COLUMN     "color_for_schedule_block" TEXT;

-- CreateIndex
CREATE INDEX "customers_business_ref_idx" ON "customers"("business_ref");

-- RenameIndex
ALTER INDEX "customer_show_suitabilities_customer_id_show_segment_slot_id_ke" RENAME TO "customer_show_suitabilities_customer_id_show_segment_slot_i_key";
