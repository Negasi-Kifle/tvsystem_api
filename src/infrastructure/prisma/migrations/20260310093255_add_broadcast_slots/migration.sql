-- CreateTable
CREATE TABLE "broadcast_slots" (
    "id" TEXT NOT NULL,
    "schedule_block_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "show_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "date_eth" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_time_minutes" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "broadcast_type" TEXT NOT NULL,
    "label" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "override_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "broadcast_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "broadcast_slots_schedule_id_idx" ON "broadcast_slots"("schedule_id");

-- CreateIndex
CREATE INDEX "broadcast_slots_show_id_idx" ON "broadcast_slots"("show_id");

-- CreateIndex
CREATE INDEX "broadcast_slots_date_idx" ON "broadcast_slots"("date");

-- CreateIndex
CREATE INDEX "broadcast_slots_status_idx" ON "broadcast_slots"("status");

-- CreateIndex
CREATE UNIQUE INDEX "broadcast_slots_schedule_block_id_date_key" ON "broadcast_slots"("schedule_block_id", "date");

-- AddForeignKey
ALTER TABLE "broadcast_slots" ADD CONSTRAINT "broadcast_slots_schedule_block_id_fkey" FOREIGN KEY ("schedule_block_id") REFERENCES "satellite_schedule_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broadcast_slots" ADD CONSTRAINT "broadcast_slots_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "satellite_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broadcast_slots" ADD CONSTRAINT "broadcast_slots_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
