-- CreateTable RevenueShare
CREATE TABLE "revenue_shares" (
    "id" TEXT NOT NULL,
    "advert_sales_id" TEXT NOT NULL,
    "partner_id" TEXT NOT NULL,
    "show_host_id" TEXT,
    "share_percentage" DOUBLE PRECISION NOT NULL,
    "share_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "disbursed_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenue_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable AgentCommission
CREATE TABLE "agent_commissions" (
    "id" TEXT NOT NULL,
    "advert_sales_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "commission_percentage" DOUBLE PRECISION NOT NULL,
    "commission_amount" DOUBLE PRECISION NOT NULL,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "net_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "disbursed_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "revenue_shares_advert_sales_id_idx" ON "revenue_shares"("advert_sales_id");
CREATE INDEX "revenue_shares_partner_id_idx" ON "revenue_shares"("partner_id");
CREATE INDEX "agent_commissions_advert_sales_id_idx" ON "agent_commissions"("advert_sales_id");
CREATE INDEX "agent_commissions_agent_id_idx" ON "agent_commissions"("agent_id");

-- AddForeignKey
ALTER TABLE "revenue_shares" ADD CONSTRAINT "revenue_shares_advert_sales_id_fkey" FOREIGN KEY ("advert_sales_id") REFERENCES "advert_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "revenue_shares" ADD CONSTRAINT "revenue_shares_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_commissions" ADD CONSTRAINT "agent_commissions_advert_sales_id_fkey" FOREIGN KEY ("advert_sales_id") REFERENCES "advert_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_commissions" ADD CONSTRAINT "agent_commissions_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
