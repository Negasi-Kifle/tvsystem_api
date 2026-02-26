-- AlterTable
ALTER TABLE "shows" ALTER COLUMN "host" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_host_fkey" FOREIGN KEY ("host") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
