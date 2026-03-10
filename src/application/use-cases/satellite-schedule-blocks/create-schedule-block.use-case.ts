import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { DayOfWeek, BroadcastType, SatelliteScheduleStatus } from '../../../domain/enums';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { EthiopianTime, EthiopianDayPart } from '../../../domain/value-objects/ethiopian-time.value-objects';

export type CreateScheduleBlockInput = {
  scheduleId: string;
  showId: string;
  dayOfWeek: DayOfWeek;
  hour: number;
  minute: number;
  dayPart: EthiopianDayPart;
  durationMinutes?: number;
  broadcastType: BroadcastType;
  label?: string;
};

export class CreateScheduleBlockUseCase {
  constructor(
    private readonly blockRepo: IScheduleBlockRepository,
    private readonly scheduleRepo: ISatelliteScheduleRepository,
    private readonly showRepo: IShowRepository,
  ) {}

  async execute(input: CreateScheduleBlockInput): Promise<ScheduleBlockEntity> {
    const schedule = await this.scheduleRepo.findById(input.scheduleId);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', input.scheduleId);
    }
    if (schedule.status !== SatelliteScheduleStatus.Draft) {
      throw new ValidationError('Can only add blocks to a DRAFT schedule');
    }

    const show = await this.showRepo.findById(input.showId);
    if (!show) {
      throw new EntityNotFoundError('Show not found', 'Show', input.showId);
    }

    const startTimeMinutes = EthiopianTime.toGregorianMinutes(input.hour, input.minute, input.dayPart);
    const durationMinutes = input.durationMinutes ?? show.totalDurationMinutes;

    const entity = ScheduleBlockEntity.createInstance(
      input.showId,
      input.scheduleId,
      input.dayOfWeek,
      startTimeMinutes,
      durationMinutes,
      input.broadcastType,
      input.label,
    );

    const existing = await this.blockRepo.findByScheduleAndDay(input.scheduleId, input.dayOfWeek);
    for (const block of existing) {
      if (entity.overlaps(block)) {
        throw new ValidationError(
          `Overlaps with existing block "${block.label ?? block.id}" (${block.startTimeGregorian}–${block.endTimeGregorian})`,
        );
      }
    }

    return this.blockRepo.create(entity);
  }
}
