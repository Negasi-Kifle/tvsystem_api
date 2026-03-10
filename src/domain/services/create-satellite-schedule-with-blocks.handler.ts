import { BatchBlockInput } from "../../application/use-cases/satellite-schedule-blocks/create-batch-schedule-blocks.use-case";
import { ScheduleBlockEntity } from "../entities/satellite-schedule-block.entity";

export interface ISatelliteScheduleCreateWithBlocksHandler {
  onScheduleCreatedWithBlocks(scheduleId: string, blocks: BatchBlockInput[]): Promise<number>;
}
