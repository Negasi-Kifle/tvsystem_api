import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { SatelliteScheduleType } from '../../../domain/enums/satellite-schedule-type.enum';
import { SatelliteScheduleStatus } from '../../../domain/enums/satellite-schedule-status.enum';
import { EntityNotFoundError } from '../../../domain/errors';
import { EntityAlreadyExistsError } from '../../../domain/errors';

export type UpdateSatelliteSchedulePayload = {
  name?: string;
  nameSlug?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  status?: SatelliteScheduleStatus;
  scheduleType?: SatelliteScheduleType;
};

export class UpdateSatelliteScheduleUseCase {
  constructor(private readonly scheduleRepo: ISatelliteScheduleRepository) {}

  async execute(
    id: string,
    payload: UpdateSatelliteSchedulePayload,
  ): Promise<SatelliteScheduleEntity | null> {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', id);
    }

    if (payload.nameSlug != null && payload.nameSlug !== schedule.nameSlug) {
      const duplicate = await this.scheduleRepo.findByNameSlug(payload.nameSlug);
      if (duplicate && duplicate.id !== id) {
        throw new EntityAlreadyExistsError(
          'Satellite schedule with this name slug already exists',
          'SatelliteSchedule',
          payload.nameSlug,
        );
      }
    }

    const updated = schedule.updateInstance(
      payload.name,
      payload.nameSlug,
      payload.effectiveFrom,
      payload.effectiveTo,
      payload.status,
      payload.scheduleType,
    );

    return this.scheduleRepo.update(updated);
  }
}
