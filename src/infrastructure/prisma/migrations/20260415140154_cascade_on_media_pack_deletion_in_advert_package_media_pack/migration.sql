-- DropForeignKey
ALTER TABLE "advert_package_media_packs" DROP CONSTRAINT "advert_package_media_packs_media_pack_id_fkey";

-- AddForeignKey
ALTER TABLE "advert_package_media_packs" ADD CONSTRAINT "advert_package_media_packs_media_pack_id_fkey" FOREIGN KEY ("media_pack_id") REFERENCES "media_packs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
