import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { SatelliteScheduleType } from '../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../domain/enums/satellite-schedule-status.enum';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { EntityAlreadyExistsError, ValidationError } from '../../../domain/errors';
import { ICalendarService } from '../../../domain/services/calendar.service';
import { BatchBlockInput } from '../satellite-schedule-blocks/create-batch-schedule-blocks.use-case';
import { ISatelliteScheduleCreateWithBlocksHandler } from '../../../domain/services/create-satellite-schedule-with-blocks.handler';

function validateBlockTimeRules(block: BatchBlockInput, index: number): void {
  const hasHour = block.hour !== undefined;
  const hasHourEth = block.hourEth !== undefined;
  const hasDayPart = block.dayPart !== undefined;

  if (!hasHour && !(hasHourEth && hasDayPart)) {
    throw new ValidationError(
      `Block at index ${index}: Either gregorian time (hour) or ethiopian time (hourEth + dayPart) must be provided; both cannot be empty.`,
    );
  }
  if (hasHourEth !== hasDayPart) {
    throw new ValidationError(
      `Block at index ${index}: hourEth and dayPart must be provided together; if one is set, the other is required.`,
    );
  }
}

export type CreateSatelliteScheduleWithBlocksInput = {
  name: string;
  nameSlug?: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  scheduleType: SatelliteScheduleType;
  blocks?: BatchBlockInput[];
  status?: SatelliteScheduleStatus;
  effectiveFromEth?: Date;
  effectiveToEth?: Date;
};

export class CreateSatelliteScheduleWithBlocksUseCase {
  constructor(
    private readonly scheduleRepo: ISatelliteScheduleRepository,
    private readonly calendarService: ICalendarService,
    private readonly createWithBlocksHandler: ISatelliteScheduleCreateWithBlocksHandler,
  ) {}

  async execute(payload: CreateSatelliteScheduleWithBlocksInput): Promise<{schedule: SatelliteScheduleEntity, count: number }> {
    let scheduleId: string | undefined = undefined;
    try {
        const nameSlug =
          payload.nameSlug ?? payload.name.toLowerCase().replace(/\s+/g, '-');
        
        const effFromConverter = this.calendarService.convertToEthiopian(payload.effectiveFrom);
        const effToConverter = this.calendarService.convertToEthiopian(payload.effectiveTo);

        const entity = SatelliteScheduleEntity.createInstance(
          payload.name,
          nameSlug,
          payload.effectiveFrom,
          payload.effectiveTo,
          payload.scheduleType,
          payload.status ?? SatelliteScheduleStatus.Draft,
          undefined,
          effFromConverter,
          effToConverter,
        );

        const [duplicate, active] = await Promise.all([
          this.scheduleRepo.findByNameSlug(entity.nameSlug),
          this.scheduleRepo.findMany({ filters: { status: SatelliteScheduleStatus.Active, scheduleType: entity.scheduleType }, take: 1 })
        ]);
        if (duplicate) {
          throw new EntityAlreadyExistsError(
            'Satellite schedule with this name slug already exists',
            'SatelliteSchedule',
          );
        }
      
        if(active.length > 0 && payload.status === SatelliteScheduleStatus.Active) {
          throw new ValidationError('There is already an active satellite schedule');
        }

        if (payload.blocks && payload.blocks.length > 0) {
          payload.blocks.forEach((block, index) => validateBlockTimeRules(block, index));
        }

        // Create the schedule and blocks here
        const schedule = await this.scheduleRepo.create(entity);
      scheduleId = schedule.id;
      let count = 0;
      if (payload.blocks && payload.blocks.length > 0) { 
        count = await this.createWithBlocksHandler.onScheduleCreatedWithBlocks(schedule.id!, payload.blocks);
      }
      return {schedule, count};
    } catch (error) {
      // Note: Deleting the schedule will cascade delete the blocks. This is to prevent orphaned blocks.
      // The reason i don't use transaction is beacuse i need to utilize all the validation benefits from "onScheduleCreatedWithBlocks".
      if (scheduleId !== undefined) await this.scheduleRepo.deleteById(scheduleId);
      throw error;
    }
  }
}
