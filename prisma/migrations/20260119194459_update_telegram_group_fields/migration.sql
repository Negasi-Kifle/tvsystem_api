/*
  Warnings:

  - Made the column `group_link` on table `telegram_groups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "telegram_groups" ALTER COLUMN "group_chat_id" DROP NOT NULL,
ALTER COLUMN "group_link" SET NOT NULL;
