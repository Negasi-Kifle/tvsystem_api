import { DayOfWeek } from '../../../domain/enums';
import { EntityNotFoundError } from '../../../domain/errors';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { EthiopianTime } from '../../../domain/value-objects/ethiopian-time.value-objects';
import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';

const MINUTES_PER_DAY = 24 * 60;

export type FreeBlock = {
  dayOfWeek: DayOfWeek;
  startTimeMinutes: number;
  endTimeMinutes: number;
  durationMinutes: number;
  startTimeGregorian: string;
  endTimeGregorian: string;
  startTimeEthiopian: EthiopianTime;
  endTimeEthiopian: EthiopianTime;
};

function formatGregorian(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function computeGapsForDay(
  dayOfWeek: DayOfWeek,
  blocks: { startTimeMinutes: number; endTimeMinutes: number }[],
): FreeBlock[] {
  const sorted = [...blocks].sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);
  const gaps: FreeBlock[] = [];
  let prevEnd = 0;

  for (const block of sorted) {
    const gapStart = prevEnd;
    const gapEnd = Math.min(block.startTimeMinutes, MINUTES_PER_DAY);
    if (gapEnd > gapStart) {
      gaps.push({
        dayOfWeek,
        startTimeMinutes: gapStart,
        endTimeMinutes: gapEnd,
        durationMinutes: gapEnd - gapStart,
        startTimeGregorian: formatGregorian(gapStart),
        endTimeGregorian: formatGregorian(gapEnd),
        startTimeEthiopian: EthiopianTime.fromGregorianMinutes(gapStart),
        endTimeEthiopian: EthiopianTime.fromGregorianMinutes(gapEnd),
      });
    }
    prevEnd = Math.max(prevEnd, block.endTimeMinutes);
  }

  if (prevEnd < MINUTES_PER_DAY) {
    gaps.push({
      dayOfWeek,
      startTimeMinutes: prevEnd,
      endTimeMinutes: MINUTES_PER_DAY,
      durationMinutes: MINUTES_PER_DAY - prevEnd,
      startTimeGregorian: formatGregorian(prevEnd),
      endTimeGregorian: formatGregorian(MINUTES_PER_DAY),
      startTimeEthiopian: EthiopianTime.fromGregorianMinutes(prevEnd),
      endTimeEthiopian: EthiopianTime.fromGregorianMinutes(MINUTES_PER_DAY),
    });
  }

  return gaps;
}

export class GetScheduleFreeBlocksUseCase {
  constructor(
    private readonly blockRepo: IScheduleBlockRepository,
    private readonly scheduleRepo: ISatelliteScheduleRepository,
  ) {}

  async execute(scheduleId: string): Promise<{ freeBlocks: FreeBlock[], schedule: SatelliteScheduleEntity}> {
    const schedule = await this.scheduleRepo.findById(scheduleId);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', scheduleId);
    }

    const blocks = await this.blockRepo.findMany({
      filters: { scheduleId },
      take: 2000,
    });

    const byDay = new Map<DayOfWeek, { startTimeMinutes: number; endTimeMinutes: number }[]>();
    for (const block of blocks) {
      const list = byDay.get(block.dayOfWeek) ?? [];
      list.push({
        startTimeMinutes: block.startTimeMinutes,
        endTimeMinutes: block.endTimeMinutes,
      });
      byDay.set(block.dayOfWeek, list);
    }

    const allDays = Object.values(DayOfWeek);
    const result: FreeBlock[] = [];

    for (const day of allDays) {
      const dayBlocks = byDay.get(day) ?? [];
      const gaps = computeGapsForDay(day, dayBlocks);
      result.push(...gaps);
    }

    const freeBlocks = result.sort(
      (a, b) => allDays.indexOf(a.dayOfWeek) - allDays.indexOf(b.dayOfWeek) || a.startTimeMinutes - b.startTimeMinutes,
    );
    return { freeBlocks, schedule };
  }
}
