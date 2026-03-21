-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_slug" TEXT NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_slug_key" ON "categories"("name_slug");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_category_id_name_slug_key" ON "sub_categories"("category_id", "name_slug");

-- CreateIndex
CREATE INDEX "sub_categories_category_id_idx" ON "sub_categories"("category_id");

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable customers: add business_ref and new columns
ALTER TABLE "customers" ADD COLUMN "business_ref" TEXT;
UPDATE "customers" SET "business_ref" = 'CR-' || REPLACE("id"::text, '-', '') WHERE "business_ref" IS NULL;
ALTER TABLE "customers" ALTER COLUMN "business_ref" SET NOT NULL;
ALTER TABLE "customers" ADD COLUMN "category_id" TEXT;
ALTER TABLE "customers" ADD COLUMN "sub_category_id" TEXT;
ALTER TABLE "customers" ADD COLUMN "location" TEXT;
ALTER TABLE "customers" ADD COLUMN "sales_agent_id" TEXT;
ALTER TABLE "customers" ADD COLUMN "next_review_date" TIMESTAMP(3);
ALTER TABLE "customers" ADD COLUMN "media_pack_id" TEXT;
ALTER TABLE "customers" ADD COLUMN "status" TEXT;
ALTER TABLE "customers" ADD COLUMN "holiday_status" TEXT;
ALTER TABLE "customers" ADD COLUMN "studio_visit" TEXT;
ALTER TABLE "customers" ADD COLUMN "other_media_campaign" TEXT;
ALTER TABLE "customers" ADD COLUMN "source_from_media_monitoring" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "customers" ADD COLUMN "in_person_update" TIMESTAMP(3);

-- CreateIndex for business_ref
CREATE UNIQUE INDEX "customers_business_ref_key" ON "customers"("business_ref");
CREATE INDEX "customers_category_id_idx" ON "customers"("category_id");
CREATE INDEX "customers_sub_category_id_idx" ON "customers"("sub_category_id");
CREATE INDEX "customers_sales_agent_id_idx" ON "customers"("sales_agent_id");
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- AddForeignKey for customers (after categories table exists)
ALTER TABLE "customers" ADD CONSTRAINT "customers_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "customers" ADD CONSTRAINT "customers_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "customers" ADD CONSTRAINT "customers_sales_agent_id_fkey" FOREIGN KEY ("sales_agent_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "customers" ADD CONSTRAINT "customers_media_pack_id_fkey" FOREIGN KEY ("media_pack_id") REFERENCES "media_packs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "communication_logs" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "log_date" TIMESTAMP(3) NOT NULL,
    "sales_agent_id" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communication_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_monitoring_records" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "sponsor_name" TEXT NOT NULL,
    "show_name" TEXT,
    "time_slot" TEXT,
    "monitoring_date" TIMESTAMP(3) NOT NULL,
    "status_with_abbay" TEXT,
    "contact_info" TEXT,
    "program_name" TEXT,
    "customer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_monitoring_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_segment_slots" (
    "id" TEXT NOT NULL,
    "show_id" TEXT NOT NULL,
    "business_ref" TEXT NOT NULL,
    "key_industry" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "show_segment_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_show_suitabilities" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "show_segment_slot_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_show_suitabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "communication_logs_customer_id_idx" ON "communication_logs"("customer_id");
CREATE INDEX "communication_logs_sales_agent_id_idx" ON "communication_logs"("sales_agent_id");
CREATE INDEX "communication_logs_log_date_idx" ON "communication_logs"("log_date");

-- CreateIndex
CREATE INDEX "media_monitoring_records_channel_idx" ON "media_monitoring_records"("channel");
CREATE INDEX "media_monitoring_records_customer_id_idx" ON "media_monitoring_records"("customer_id");
CREATE INDEX "media_monitoring_records_sponsor_name_idx" ON "media_monitoring_records"("sponsor_name");

-- CreateIndex
CREATE UNIQUE INDEX "show_segment_slots_show_id_business_ref_key" ON "show_segment_slots"("show_id", "business_ref");
CREATE INDEX "show_segment_slots_show_id_idx" ON "show_segment_slots"("show_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_show_suitabilities_customer_id_show_segment_slot_id_key" ON "customer_show_suitabilities"("customer_id", "show_segment_slot_id");
CREATE INDEX "customer_show_suitabilities_customer_id_idx" ON "customer_show_suitabilities"("customer_id");
CREATE INDEX "customer_show_suitabilities_show_segment_slot_id_idx" ON "customer_show_suitabilities"("show_segment_slot_id");

-- AddForeignKey
ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_sales_agent_id_fkey" FOREIGN KEY ("sales_agent_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_monitoring_records" ADD CONSTRAINT "media_monitoring_records_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_segment_slots" ADD CONSTRAINT "show_segment_slots_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_show_suitabilities" ADD CONSTRAINT "customer_show_suitabilities_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "customer_show_suitabilities" ADD CONSTRAINT "customer_show_suitabilities_show_segment_slot_id_fkey" FOREIGN KEY ("show_segment_slot_id") REFERENCES "show_segment_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
