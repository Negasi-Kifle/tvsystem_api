-- AlterTable
ALTER TABLE "user_permissions" ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "granted_by" TEXT;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
