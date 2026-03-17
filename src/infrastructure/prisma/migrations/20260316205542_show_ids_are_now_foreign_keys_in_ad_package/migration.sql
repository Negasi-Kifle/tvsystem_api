-- CreateTable
CREATE TABLE "advert_package_shows" (
    "id" TEXT NOT NULL,
    "advert_package_id" TEXT NOT NULL,
    "show_id" TEXT NOT NULL,

    CONSTRAINT "advert_package_shows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "advert_package_shows_show_id_idx" ON "advert_package_shows"("show_id");

-- CreateIndex
CREATE UNIQUE INDEX "advert_package_shows_advert_package_id_show_id_key" ON "advert_package_shows"("advert_package_id", "show_id");

-- AddForeignKey
ALTER TABLE "advert_package_shows" ADD CONSTRAINT "advert_package_shows_advert_package_id_fkey" FOREIGN KEY ("advert_package_id") REFERENCES "advert_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advert_package_shows" ADD CONSTRAINT "advert_package_shows_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
