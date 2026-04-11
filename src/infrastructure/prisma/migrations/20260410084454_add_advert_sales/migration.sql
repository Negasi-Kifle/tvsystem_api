-- CreateTable
CREATE TABLE "advert_sales" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "advert_package_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ad_start_date" TIMESTAMP(3) NOT NULL,
    "ad_end_date" TIMESTAMP(3) NOT NULL,
    "ad_length_seconds" INTEGER NOT NULL,
    "num_of_slots" INTEGER NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "contract_sign_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advert_sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advert_sales_reference_number_key" ON "advert_sales"("reference_number");

-- CreateIndex
CREATE INDEX "advert_sales_advert_package_id_idx" ON "advert_sales"("advert_package_id");

-- CreateIndex
CREATE INDEX "advert_sales_customer_id_idx" ON "advert_sales"("customer_id");

-- CreateIndex
CREATE INDEX "advert_sales_status_idx" ON "advert_sales"("status");

-- AddForeignKey
ALTER TABLE "advert_sales" ADD CONSTRAINT "advert_sales_advert_package_id_fkey" FOREIGN KEY ("advert_package_id") REFERENCES "advert_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advert_sales" ADD CONSTRAINT "advert_sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
