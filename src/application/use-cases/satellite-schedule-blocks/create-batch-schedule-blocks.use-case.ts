import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { DayOfWeek, BroadcastType, SatelliteScheduleStatus } from '../../../domain/enums';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { EthiopianTime, EthiopianDayPart } from '../../../domain/value-objects/ethiopian-time.value-objects';

export type BatchBlockInput = {
  showId: string;
  dayOfWeek: DayOfWeek;
  hour: number;
  minute: number;
  dayPart: EthiopianDayPart;
  broadcastType: BroadcastType;
  label?: string;
};

export class CreateBatchScheduleBlocksUseCase {
  constructor(
    private readonly blockRepo: IScheduleBlockRepository,
    private readonly scheduleRepo: ISatelliteScheduleRepository,
    private readonly showRepo: IShowRepository,
  ) {}

  async execute(scheduleId: string, inputs: BatchBlockInput[]): Promise<{ count: number }> {
    const schedule = await this.scheduleRepo.findById(scheduleId);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', scheduleId);
    }
    if (schedule.status !== SatelliteScheduleStatus.Draft) {
      throw new ValidationError('Can only add blocks to a DRAFT schedule');
    }

    const entities: ScheduleBlockEntity[] = [];
    for (const input of inputs) {
      const show = await this.showRepo.findById(input.showId);
      if (!show) {
        throw new EntityNotFoundError('Show not found', 'Show', input.showId);
      }

      const startTimeMinutes = EthiopianTime.toGregorianMinutes(input.hour, input.minute, input.dayPart);

      entities.push(
        ScheduleBlockEntity.createInstance(
          input.showId,
          scheduleId,
          input.dayOfWeek,
          startTimeMinutes,
          show.totalDurationMinutes,
          input.broadcastType,
          input.label ?? show.title,
        ),
      );
    }

    // Validate no overlaps among new blocks AND with existing blocks
    const dayGroups = new Map<DayOfWeek, ScheduleBlockEntity[]>();
    for (const entity of entities) {
      const group = dayGroups.get(entity.dayOfWeek) ?? [];
      group.push(entity);
      dayGroups.set(entity.dayOfWeek, group);
    }

    for (const [day, newBlocks] of dayGroups) {
      const existing = await this.blockRepo.findByScheduleAndDay(scheduleId, day);
      const allBlocks = [...existing, ...newBlocks];

      allBlocks.sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);
      for (let i = 0; i < allBlocks.length - 1; i++) {
        const current = allBlocks[i]!;
        const next = allBlocks[i + 1]!;
        if (current.endTimeMinutes > next.startTimeMinutes) {
          // TODO: use ethiopian time
          throw new ValidationError(
            `Overlap detected on ${day}: block at ${current.startTimeGregorian} overlaps with ${next.startTimeGregorian}`,
          );
        }
      }
    }

    return this.blockRepo.createMany(entities);
  }
}
