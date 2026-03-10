-- AlterTable
ALTER TABLE "satellite_schedules" ADD COLUMN     "effective_from_eth" TEXT,
ADD COLUMN     "effective_to_eth" TEXT;

-- CreateTable
CREATE TABLE "satellite_schedule_blocks" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "show_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_time_minutes" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "broadcast_type" TEXT NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "satellite_schedule_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "satellite_schedule_blocks_schedule_id_idx" ON "satellite_schedule_blocks"("schedule_id");

-- CreateIndex
CREATE INDEX "satellite_schedule_blocks_show_id_idx" ON "satellite_schedule_blocks"("show_id");

-- CreateIndex
CREATE UNIQUE INDEX "satellite_schedule_blocks_schedule_id_day_of_week_start_tim_key" ON "satellite_schedule_blocks"("schedule_id", "day_of_week", "start_time_minutes");

-- AddForeignKey
ALTER TABLE "satellite_schedule_blocks" ADD CONSTRAINT "satellite_schedule_blocks_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "satellite_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "satellite_schedule_blocks" ADD CONSTRAINT "satellite_schedule_blocks_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
