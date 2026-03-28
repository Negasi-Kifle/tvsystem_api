-- CreateTable
CREATE TABLE "advert_package_media_packs" (
    "id" TEXT NOT NULL,
    "advert_package_id" TEXT NOT NULL,
    "media_pack_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advert_package_media_packs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advert_package_media_packs_advert_package_id_media_pack_id_key" ON "advert_package_media_packs"("advert_package_id", "media_pack_id");

-- CreateIndex
CREATE INDEX "advert_package_media_packs_media_pack_id_idx" ON "advert_package_media_packs"("media_pack_id");

-- AddForeignKey
ALTER TABLE "advert_package_media_packs" ADD CONSTRAINT "advert_package_media_packs_advert_package_id_fkey" FOREIGN KEY ("advert_package_id") REFERENCES "advert_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advert_package_media_packs" ADD CONSTRAINT "advert_package_media_packs_media_pack_id_fkey" FOREIGN KEY ("media_pack_id") REFERENCES "media_packs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
