import { ScheduleBlockEntity } from '../../../domain/entities/satellite-schedule-block.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IScheduleBlockRepository } from '../../../domain/repositories/schedule-block.repository.interface';

export class GetScheduleBlockByIdUseCase {
  constructor(private readonly blockRepo: IScheduleBlockRepository) {}

  async execute(id: string): Promise<ScheduleBlockEntity> {
    const block = await this.blockRepo.findById(id);
    if (!block) {
      throw new EntityNotFoundError('Schedule block not found', 'ScheduleBlock', id);
    }
    return block;
  }
}
