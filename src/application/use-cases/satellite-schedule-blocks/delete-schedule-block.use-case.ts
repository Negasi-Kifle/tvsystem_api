import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { SatelliteScheduleStatus } from '../../../domain/enums';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';

export class DeleteScheduleBlockUseCase {
  constructor(
    private readonly blockRepo: IScheduleBlockRepository,
    private readonly scheduleRepo: ISatelliteScheduleRepository,
  ) {}

  async execute(id: string): Promise<ScheduleBlockEntity | null> {
    const block = await this.blockRepo.findById(id);
    if (!block) {
      throw new EntityNotFoundError('Schedule block not found', 'ScheduleBlock', id);
    }

    const schedule = await this.scheduleRepo.findById(block.scheduleId);
    if (!schedule || schedule.status !== SatelliteScheduleStatus.Draft) {
      throw new ValidationError('Can only delete blocks from a DRAFT schedule');
    }

    return this.blockRepo.deleteById(id);
  }
}
