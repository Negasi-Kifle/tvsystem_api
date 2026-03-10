import { BroadcastSlotEntity } from '../../../domain/entities/broadcast-slot.entity';
import { BroadcastSlotStatus, DayOfWeek, SatelliteScheduleStatus } from '../../../domain/enums';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { ICalendarService } from '../../../domain/services/calendar.service';
import { IScheduleActivationHandler } from '../../../domain/services/schedule-activation.handler';

const JS_DAY_TO_ENUM: Record<number, DayOfWeek> = {
  0: DayOfWeek.Sunday,
  1: DayOfWeek.Monday,
  2: DayOfWeek.Tuesday,
  3: DayOfWeek.Wednesday,
  4: DayOfWeek.Thursday,
  5: DayOfWeek.Friday,
  6: DayOfWeek.Saturday,
};

export type GenerateBroadcastSlotsInput = {
  scheduleId: string;
  fromDate?: Date;
  toDate?: Date;
};

export class GenerateBroadcastSlotsUseCase implements IScheduleActivationHandler {
  constructor(
    private readonly slotRepo: IBroadcastSlotRepository,
    private readonly blockRepo: IScheduleBlockRepository,
    private readonly scheduleRepo: ISatelliteScheduleRepository,
    private readonly calendarService: ICalendarService,
  ) {}

  async execute(input: GenerateBroadcastSlotsInput): Promise<{ created: number; skipped: number }> {
    const schedule = await this.scheduleRepo.findById(input.scheduleId);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', input.scheduleId);
    }
    if (schedule.status !== SatelliteScheduleStatus.Active) {
      throw new ValidationError('Can only generate broadcast slots for an ACTIVE schedule');
    }

    const rangeStart = input.fromDate && input.fromDate > schedule.effectiveFrom
      ? input.fromDate
      : schedule.effectiveFrom;
    const rangeEnd = input.toDate && input.toDate < schedule.effectiveTo
      ? input.toDate
      : schedule.effectiveTo;

    if (rangeStart >= rangeEnd) {
      throw new ValidationError('Invalid date range: fromDate must be before toDate');
    }

    const blocks = await this.blockRepo.findMany({
      filters: { scheduleId: input.scheduleId },
      take: 1000,
    });

    if (blocks.length === 0) {
      return { created: 0, skipped: 0 };
    }

    const blocksByDay = new Map<DayOfWeek, typeof blocks>();
    for (const block of blocks) {
      const group = blocksByDay.get(block.dayOfWeek) ?? [];
      group.push(block);
      blocksByDay.set(block.dayOfWeek, group);
    }

    const entitiesToCreate: BroadcastSlotEntity[] = [];
    let skipped = 0;

    const current = new Date(rangeStart);
    current.setHours(0, 0, 0, 0);
    const end = new Date(rangeEnd);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
      const dayOfWeek = JS_DAY_TO_ENUM[current.getDay()]!;
      const dayBlocks = blocksByDay.get(dayOfWeek);

      if (dayBlocks) {
        const dateForSlot = new Date(current);
        const dateEth = this.calendarService.formatEthiopianDate(dateForSlot);

        for (const block of dayBlocks) {
          const exists = await this.slotRepo.existsByBlockAndDate(block.id!, dateForSlot);
          if (exists) {
            skipped++;
            continue;
          }

          entitiesToCreate.push(
            BroadcastSlotEntity.createInstance(
              block.id!,
              input.scheduleId,
              block.showId,
              dateForSlot,
              dateEth,
              dayOfWeek,
              block.startTimeMinutes,
              block.durationMinutes,
              block.broadcastType,
              BroadcastSlotStatus.Scheduled,
              block.label,
            ),
          );
        }
      }

      current.setDate(current.getDate() + 1);
    }

    if (entitiesToCreate.length === 0) {
      return { created: 0, skipped };
    }

    const result = await this.slotRepo.createMany(entitiesToCreate);
    return { created: result.count, skipped };
  }

  async onScheduleActivated(scheduleId: string): Promise<void> {
    await this.execute({ scheduleId });
  }
}
