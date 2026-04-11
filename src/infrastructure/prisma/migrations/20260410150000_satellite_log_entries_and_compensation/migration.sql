-- Drop old SatelliteLog table
DROP TABLE IF EXISTS "satellite_logs" CASCADE;

-- CreateTable SatelliteLogUpload
CREATE TABLE "satellite_log_uploads" (
    "id" TEXT NOT NULL,
    "log_date" TIMESTAMP(3) NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "satellite_log_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable SatelliteLogEntry
CREATE TABLE "satellite_log_entries" (
    "id" TEXT NOT NULL,
    "satellite_log_upload_id" TEXT NOT NULL,
    "broadcast_date_time" TIMESTAMP(3) NOT NULL,
    "hex_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "matched_placement_id" TEXT,
    "match_type" TEXT NOT NULL DEFAULT 'UNMATCHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "satellite_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "satellite_log_uploads_log_date_idx" ON "satellite_log_uploads"("log_date");
CREATE INDEX "satellite_log_uploads_uploaded_by_id_idx" ON "satellite_log_uploads"("uploaded_by_id");
CREATE INDEX "satellite_log_entries_satellite_log_upload_id_idx" ON "satellite_log_entries"("satellite_log_upload_id");
CREATE INDEX "satellite_log_entries_matched_placement_id_idx" ON "satellite_log_entries"("matched_placement_id");
CREATE INDEX "satellite_log_entries_broadcast_date_time_idx" ON "satellite_log_entries"("broadcast_date_time");

-- AddForeignKey
ALTER TABLE "satellite_log_uploads" ADD CONSTRAINT "satellite_log_uploads_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "satellite_log_entries" ADD CONSTRAINT "satellite_log_entries_satellite_log_upload_id_fkey" FOREIGN KEY ("satellite_log_upload_id") REFERENCES "satellite_log_uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "satellite_log_entries" ADD CONSTRAINT "satellite_log_entries_matched_placement_id_fkey" FOREIGN KEY ("matched_placement_id") REFERENCES "advert_placements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
