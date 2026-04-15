import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { DayOfWeek, BroadcastType, SatelliteScheduleStatus } from '../../../domain/enums';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { EthiopianTime, EthiopianDayPart } from '../../../domain/value-objects/ethiopian-time.value-objects';
import { computeStartTimeMinutes } from './create-batch-schedule-blocks.use-case';

export type UpdateScheduleBlockInput = {
  dayOfWeek?: DayOfWeek;
  hour?: number;
  hourEth?: number;
  minute?: number;
  dayPart?: EthiopianDayPart;
  durationMinutes?: number;
  broadcastType?: BroadcastType;
  showId?: string;
  label?: string | null;
};

export class UpdateScheduleBlockUseCase {
  constructor(
    private readonly blockRepo: IScheduleBlockRepository,
    private readonly scheduleRepo: ISatelliteScheduleRepository,
  ) {}

  async execute(id: string, input: UpdateScheduleBlockInput): Promise<ScheduleBlockEntity> {
    const block = await this.blockRepo.findById(id);
    if (!block) {
      throw new EntityNotFoundError('Schedule block not found', 'ScheduleBlock', id);
    }

    const schedule = await this.scheduleRepo.findById(block.scheduleId);
    if (!schedule || schedule.status !== SatelliteScheduleStatus.Draft) {
      throw new ValidationError('Can only update blocks on a DRAFT schedule');
    }

    const startTimeMinutes = computeStartTimeMinutes({
      hour: input.hour,
      hourEth: input.hourEth,
      minute: input.minute ?? 0,
      dayPart: input.dayPart,
    });

    block.updateInstance(
      input.dayOfWeek,
      startTimeMinutes,
      input.durationMinutes,
      input.broadcastType,
      input.showId,
      input.label,
    );

    const dayToCheck = block.dayOfWeek;
    const existing = await this.blockRepo.findByScheduleAndDay(block.scheduleId, dayToCheck);
    for (const other of existing) {
      if (other.id === block.id) continue;
      if (block.overlaps(other)) {
        throw new ValidationError(
          `Overlaps with existing block "${other.label ?? other.id}" (${other.startTimeGregorian}–${other.endTimeGregorian})`,
        );
      }
    }

    return (await this.blockRepo.update(block))!;
  }
}
