import { ShowRepository } from '../../../infrastructure/prisma/repositories/show.repository';
import { Show } from '../../../domain/entities/show.entity';

export class CreateShowUseCase {
  constructor(private readonly showRepo = new ShowRepository()) { }

  async execute(payload: Omit<Show, 'id'>): Promise<Show> {
    return this.showRepo.create(payload);
  }
}
