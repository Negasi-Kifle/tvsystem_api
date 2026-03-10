import { ScheduleBlockEntity } from '../entities/satellite-schedule-block.entity';
import { IBaseRepository } from './base.repository.interface';
import { DayOfWeek } from '../enums';

export interface IScheduleBlockRepository extends IBaseRepository<ScheduleBlockEntity> {
  findByScheduleAndDay(scheduleId: string, dayOfWeek: DayOfWeek): Promise<ScheduleBlockEntity[]>;
  createMany(entities: ScheduleBlockEntity[]): Promise<{ count: number }>;
}
