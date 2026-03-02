-- Apply this migration: npx prisma migrate deploy (or prisma migrate dev in development)
-- CreateEnum
CREATE TYPE "UserRefModel" AS ENUM ('Partner', 'Employee', 'Internal');

-- AlterTable: users - add polymorphic ref columns
ALTER TABLE "users" ADD COLUMN "ref_model" "UserRefModel" NOT NULL DEFAULT 'Internal';
ALTER TABLE "users" ADD COLUMN "partner_id" TEXT;
ALTER TABLE "users" ADD COLUMN "employee_id" TEXT;

-- AlterTable: partners - add is_active for sync with user
ALTER TABLE "partners" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable: employees
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employee_number" TEXT,
    "department" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique constraints on users for partner_id and employee_id
CREATE UNIQUE INDEX "users_partner_id_key" ON "users"("partner_id");
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");

-- CreateIndex: employees.employee_number unique
CREATE UNIQUE INDEX "employees_employee_number_key" ON "employees"("employee_number");

-- CreateIndex: ref_model for filtering
CREATE INDEX "users_ref_model_idx" ON "users"("ref_model");

-- AddForeignKey: users -> partners
ALTER TABLE "users" ADD CONSTRAINT "users_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: users -> employees
ALTER TABLE "users" ADD CONSTRAINT "users_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
