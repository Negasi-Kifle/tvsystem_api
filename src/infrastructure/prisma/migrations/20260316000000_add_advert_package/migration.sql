-- CreateTable
CREATE TABLE "advert_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_slug" TEXT NOT NULL,
    "media_pack_id" TEXT NOT NULL,
    "show_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "advertisements_count" INTEGER NOT NULL,
    "announcements_count" INTEGER NOT NULL,
    "pop_ups_count" INTEGER NOT NULL,
    "bonuses_count" INTEGER NOT NULL,
    "price_before_vat" DOUBLE PRECISION NOT NULL,
    "other_taxes" DOUBLE PRECISION NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "advertisements_rerun_count" INTEGER NOT NULL DEFAULT 0,
    "announcements_rerun_count" INTEGER NOT NULL DEFAULT 0,
    "pop_ups_rerun_count" INTEGER NOT NULL DEFAULT 0,
    "bonuses_rerun_count" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advert_packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advert_packages_media_pack_id_name_slug_key" ON "advert_packages"("media_pack_id", "name_slug");

-- CreateIndex
CREATE INDEX "advert_packages_media_pack_id_idx" ON "advert_packages"("media_pack_id");

-- CreateIndex
CREATE INDEX "advert_packages_is_active_idx" ON "advert_packages"("is_active");

-- AddForeignKey
ALTER TABLE "advert_packages" ADD CONSTRAINT "advert_packages_media_pack_id_fkey" FOREIGN KEY ("media_pack_id") REFERENCES "media_packs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
