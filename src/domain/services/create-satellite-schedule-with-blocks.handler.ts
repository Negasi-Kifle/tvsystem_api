import { BatchBlockInput } from "../../application/use-cases/satellite-schedule-blocks/create-batch-schedule-blocks.use-case";

export interface ISatelliteScheduleCreateWithBlocksHandler {
  onScheduleCreatedWithBlocks(scheduleId: string, blocks: BatchBlockInput[]): Promise<number>;
}
