/*
  Warnings:

  - The `effective_from_eth` column on the `satellite_schedules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `effective_to_eth` column on the `satellite_schedules` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "satellite_schedules" DROP COLUMN "effective_from_eth",
ADD COLUMN     "effective_from_eth" TIMESTAMP(3),
DROP COLUMN "effective_to_eth",
ADD COLUMN     "effective_to_eth" TIMESTAMP(3);
