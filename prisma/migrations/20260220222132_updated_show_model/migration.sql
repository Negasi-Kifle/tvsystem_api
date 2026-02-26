/*
  Warnings:

  - You are about to drop the column `assigned_staff` on the `shows` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[titel_slug]` on the table `shows` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `host` to the `shows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titel_slug` to the `shows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shows" DROP COLUMN "assigned_staff",
ADD COLUMN     "host" TEXT NOT NULL,
ADD COLUMN     "titel_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shows_titel_slug_key" ON "shows"("titel_slug");
