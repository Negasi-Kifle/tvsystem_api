-- AlterTable: add columns on users (reuse existing SalesCommissionType enum)
ALTER TABLE "users" ADD COLUMN "sales_commission_type" "SalesCommissionType",
ADD COLUMN "sales_commission_amount" DOUBLE PRECISION;

-- Copy from employees linked via users.employee_id
UPDATE "users" AS u
SET
  "sales_commission_type" = e."sales_commission_type",
  "sales_commission_amount" = e."sales_commission_amount"
FROM "employees" AS e
WHERE u."employee_id" = e."id";

-- AlterTable: drop from employees
ALTER TABLE "employees" DROP COLUMN "sales_commission_type",
DROP COLUMN "sales_commission_amount";
