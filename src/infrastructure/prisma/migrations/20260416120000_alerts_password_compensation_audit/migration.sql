-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_reset_token_hash" TEXT,
ADD COLUMN     "password_reset_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_password_reset_token_hash_idx" ON "users"("password_reset_token_hash");

-- AlterTable
ALTER TABLE "advert_placements" ADD COLUMN     "air_alert_sent_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "advert_sales" ADD COLUMN     "campaign_end_alert_sent_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "compensations" ADD COLUMN     "customer_response_token_hash" TEXT,
ADD COLUMN     "customer_response_token_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "compensations_customer_response_token_hash_key" ON "compensations"("customer_response_token_hash");

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
