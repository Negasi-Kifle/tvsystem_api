import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { SatelliteScheduleType } from '../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../domain/enums/satellite-schedule-status.enum';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';

export type CreateSatelliteScheduleInput = {
  name: string;
  nameSlug?: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  scheduleType: SatelliteScheduleType;
  status?: SatelliteScheduleStatus;
};

export class CreateSatelliteScheduleUseCase {
  constructor(private readonly scheduleRepo: ISatelliteScheduleRepository) {}

  async execute(payload: CreateSatelliteScheduleInput): Promise<SatelliteScheduleEntity> {
    const nameSlug =
      payload.nameSlug ?? payload.name.toLowerCase().replace(/\s+/g, '-');
    
    const entity = SatelliteScheduleEntity.createInstance(
      payload.name,
      nameSlug,
      payload.effectiveFrom,
      payload.effectiveTo,
      payload.scheduleType,
      payload.status,
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
