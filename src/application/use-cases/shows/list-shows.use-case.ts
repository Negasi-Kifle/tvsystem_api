import { ShowRepository } from "../../../infrastructure/database/prisma/repositories";
import { Show } from '../../../domain/entities/show.entity';

export class ListShowsUseCase {
  constructor(private readonly showRepo = new ShowRepository()) {}

  async execute(): Promise<Show[]> {
    return this.showRepo.list();
  }
}
