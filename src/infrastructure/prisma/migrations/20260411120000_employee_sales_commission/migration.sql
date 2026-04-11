-- CreateEnum
CREATE TYPE "SalesCommissionType" AS ENUM ('Percentage', 'Fixed');

-- AlterTable
ALTER TABLE "employees" ADD COLUMN "sales_commission_type" "SalesCommissionType",
ADD COLUMN "sales_commission_amount" DOUBLE PRECISION;
