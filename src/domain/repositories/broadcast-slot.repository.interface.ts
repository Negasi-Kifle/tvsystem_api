import { BroadcastSlotEntity } from '../entities/broadcast-slot.entity';
import { IBaseRepository } from './base.repository.interface';

export interface IBroadcastSlotRepository extends IBaseRepository<BroadcastSlotEntity> {
  findByScheduleAndDateRange(scheduleId: string, from: Date, to: Date): Promise<BroadcastSlotEntity[]>;
  createMany(entities: BroadcastSlotEntity[]): Promise<{ count: number }>;
  existsByBlockAndDate(scheduleBlockId: string, date: Date): Promise<boolean>;
}
