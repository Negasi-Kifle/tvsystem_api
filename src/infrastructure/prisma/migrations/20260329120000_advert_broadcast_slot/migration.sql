-- AlterTable
ALTER TABLE "adverts" ADD COLUMN "broadcast_slot_id" TEXT;

-- CreateIndex
CREATE INDEX "adverts_broadcast_slot_id_idx" ON "adverts"("broadcast_slot_id");

-- AddForeignKey
ALTER TABLE "adverts" ADD CONSTRAINT "adverts_broadcast_slot_id_fkey" FOREIGN KEY ("broadcast_slot_id") REFERENCES "broadcast_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
