import { UserRepository } from '../../../infrastructure/database/prisma/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

export class GetByIdUseCase {
  constructor(private readonly userRepo = new UserRepository()) { }

  async execute(id: string): Promise<User | null> {
    return await this.userRepo.findById(id);
  }
}