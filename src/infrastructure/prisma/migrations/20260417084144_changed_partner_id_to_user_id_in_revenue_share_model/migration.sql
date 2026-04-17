/*
  Warnings:

  - You are about to drop the column `partner_id` on the `revenue_shares` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `revenue_shares` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "revenue_shares" DROP CONSTRAINT "revenue_shares_partner_id_fkey";

-- DropIndex
DROP INDEX "revenue_shares_partner_id_idx";

-- AlterTable
ALTER TABLE "revenue_shares" DROP COLUMN "partner_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "revenue_shares_user_id_idx" ON "revenue_shares"("user_id");

-- AddForeignKey
ALTER TABLE "revenue_shares" ADD CONSTRAINT "revenue_shares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
