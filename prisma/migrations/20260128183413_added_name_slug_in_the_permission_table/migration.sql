/*
  Warnings:

  - A unique constraint covering the columns `[name_slug]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_slug` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "name_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_slug_key" ON "Permission"("name_slug");
