/*
  Warnings:

  - You are about to drop the column `fullName` on the `partners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partners" DROP COLUMN "fullName";

-- AlterTable
ALTER TABLE "shows" ALTER COLUMN "total_duration_minutes" DROP DEFAULT,
ALTER COLUMN "parts_count" DROP DEFAULT;
