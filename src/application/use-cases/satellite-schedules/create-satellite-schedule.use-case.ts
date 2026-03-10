import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { SatelliteScheduleType } from '../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../domain/enums/satellite-schedule-status.enum';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { EthiopianTime } from '../../../domain/value-objects/ethiopian-time.value-objects';
import { CalendarService } from '../../../infrastructure/services/calendar.service';
import { ICalendarService } from '../../../domain/services/calendar.service';

export type CreateSatelliteScheduleInput = {
  name: string;
  nameSlug?: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  scheduleType: SatelliteScheduleType;
  status?: SatelliteScheduleStatus;
  effectiveFromEth?: Date;
  effectiveToEth?: Date;
};

export class CreateSatelliteScheduleUseCase {
  constructor(
    private readonly scheduleRepo: ISatelliteScheduleRepository,
    private readonly calendarService: ICalendarService
  ) {}

  async execute(payload: CreateSatelliteScheduleInput): Promise<SatelliteScheduleEntity> {
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

    const duplicate = await this.scheduleRepo.findByNameSlug(entity.nameSlug);
    if (duplicate) {
      throw new EntityAlreadyExistsError(
        'Satellite schedule with this name slug already exists',
        'SatelliteSchedule',
      );
    }

    return this.scheduleRepo.create(entity);
  }
}
