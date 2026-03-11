import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import { IShowHostRepository } from '../../../domain/repositories/show-host.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors';

export class GetShowHostByIdUseCase {
  constructor(private readonly repo: IShowHostRepository) {}

  async execute(id: string): Promise<ShowHostEntity> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new EntityNotFoundError('Show host assignment not found', 'ShowHost', id);
    }
    
    return entity;
  }
}

