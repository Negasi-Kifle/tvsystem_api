import { UserRepository } from '../../../infrastructure/database/prisma/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

export class GetByEmailOrPhoneUseCase {
    constructor(private readonly userRepo = new UserRepository()) { }

    async execute(emailOrPhone: string): Promise<User | null> {
        return await this.userRepo.findByEmailOrPhoneNumber(emailOrPhone);
    }
}