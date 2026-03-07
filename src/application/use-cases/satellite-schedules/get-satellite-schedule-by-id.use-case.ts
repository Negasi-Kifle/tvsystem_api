import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';

export class GetSatelliteScheduleByIdUseCase {
  constructor(private readonly scheduleRepo: ISatelliteScheduleRepository) {}

  async execute(id: string): Promise<SatelliteScheduleEntity> {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', id);
    }
    return schedule;
  }
}
