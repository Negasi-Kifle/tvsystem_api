import { ISatelliteScheduleRepository } from '../../../domain/repositories/satellite-schedule.repository.interface';
import { SatelliteScheduleEntity } from '../../../domain/entities/satellite-schedule.entity';
import { EntityNotFoundError } from '../../../domain/errors';

export class DeleteSatelliteScheduleUseCase {
  constructor(private readonly scheduleRepo: ISatelliteScheduleRepository) {}

  async execute(id: string): Promise<SatelliteScheduleEntity | null> {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new EntityNotFoundError('Satellite schedule not found', 'SatelliteSchedule', id);
    }
    return this.scheduleRepo.deleteById(id);
  }
}
