/*
  Warnings:

  - You are about to drop the column `revenueShare` on the `partners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partners" DROP COLUMN "revenueShare";

-- AlterTable
ALTER TABLE "show_hosts" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);
