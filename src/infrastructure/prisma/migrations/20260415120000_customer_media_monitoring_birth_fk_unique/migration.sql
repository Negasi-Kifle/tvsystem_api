-- Birth source enforcement: FK + unique on customers.media_monitoring_id
--
-- Prerequisite (run manually if migration fails): ensure no duplicate non-null
-- media_monitoring_id values exist on customers:
--   SELECT media_monitoring_id, COUNT(*) FROM customers
--   WHERE media_monitoring_id IS NOT NULL GROUP BY media_monitoring_id HAVING COUNT(*) > 1;

-- ForeignKey: customers.media_monitoring_id -> media_monitoring_records.id
ALTER TABLE "customers" ADD CONSTRAINT "customers_media_monitoring_id_fkey" FOREIGN KEY ("media_monitoring_id") REFERENCES "media_monitoring_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Unique: at most one customer may reference a given monitoring row as birth source
CREATE UNIQUE INDEX "customers_media_monitoring_id_key" ON "customers"("media_monitoring_id");
