-- AlterTable
ALTER TABLE "communication_logs" ADD COLUMN "media_pack_id" TEXT;

-- AddForeignKey
ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_media_pack_id_fkey" FOREIGN KEY ("media_pack_id") REFERENCES "media_packs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "communication_logs_media_pack_id_idx" ON "communication_logs"("media_pack_id");

-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_media_pack_id_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "media_pack_id";
