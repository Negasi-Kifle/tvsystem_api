-- Drop join table (referenced show_segment_slots)
DROP TABLE IF EXISTS "customer_show_suitabilities";

-- Old rows cannot be mapped to customer_id; clear before reshape
TRUNCATE TABLE "show_segment_slots";

-- Remove legacy unique and columns
DROP INDEX IF EXISTS "show_segment_slots_show_id_business_ref_key";
ALTER TABLE "show_segment_slots" DROP COLUMN "business_ref";
ALTER TABLE "show_segment_slots" DROP COLUMN "key_industry";

-- Required customer per slot (table is empty)
ALTER TABLE "show_segment_slots" ADD COLUMN "customer_id" TEXT NOT NULL;

-- Foreign keys and indexes
ALTER TABLE "show_segment_slots" ADD CONSTRAINT "show_segment_slots_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "show_segment_slots_show_id_customer_id_key" ON "show_segment_slots"("show_id", "customer_id");
CREATE INDEX "show_segment_slots_customer_id_idx" ON "show_segment_slots"("customer_id");
