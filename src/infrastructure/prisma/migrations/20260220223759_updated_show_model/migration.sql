/*
  Warnings:

  - You are about to drop the column `max_ad_length_seconds` on the `shows` table. All the data in the column will be lost.
  - Added the required column `max_ad_length_minutes` to the `shows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shows" DROP COLUMN "max_ad_length_seconds",
ADD COLUMN     "max_ad_length_minutes" INTEGER NOT NULL;
