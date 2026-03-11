import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import { IShowHostRepository } from '../../../domain/repositories/show-host.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors';

export class DeleteShowHostUseCase {
  constructor(private readonly repo: IShowHostRepository) {}

  async execute(id: string): Promise<ShowHostEntity | null> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Show host assignment not found', 'ShowHost', id);
    }
    return this.repo.deleteById(id);
  }
}

