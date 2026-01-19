import { UserRepository } from '../../../infrastructure/database/prisma/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

export class CreateUserUseCase {
  constructor(private readonly userRepo = new UserRepository()) {}

  async execute(payload: Omit<User, 'id'>): Promise<User> {
    return this.userRepo.create(payload);
  }
}