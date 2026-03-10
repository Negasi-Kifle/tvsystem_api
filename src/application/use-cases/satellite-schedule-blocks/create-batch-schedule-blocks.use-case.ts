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
  durationMinutes?: number;
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

    const showIds = [...new Set(inputs.map((i) => i.showId))];
    for (const showId of showIds) {
      const show = await this.showRepo.findById(showId);
      if (!show) {
        throw new EntityNotFoundError('Show not found', 'Show', showId);
      }
    }

    const entities: ScheduleBlockEntity[] = [];
    for (const input of inputs) {
      const show = await this.showRepo.findById(input.showId);
      const startTimeMinutes = EthiopianTime.toGregorianMinutes(input.hour, input.minute, input.dayPart);
      const durationMinutes = input.durationMinutes ?? show!.totalDurationMinutes;

      entities.push(
        ScheduleBlockEntity.createInstance(
          input.showId,
          scheduleId,
          input.dayOfWeek,
          startTimeMinutes,
          durationMinutes,
          input.broadcastType,
          input.label,
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
          throw new ValidationError(
            `Overlap detected on ${day}: block at ${current.startTimeGregorian} overlaps with ${next.startTimeGregorian}`,
          );
        }
      }
    }

    return this.blockRepo.createMany(entities);
  }
}
