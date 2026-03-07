-- CreateTable
CREATE TABLE "satellite_schedules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_slug" TEXT NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL,
    "effective_to" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "schedule_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "satellite_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "satellite_schedules_name_slug_key" ON "satellite_schedules"("name_slug");
