import { UserRepository } from '../../../infrastructure/database/prisma/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

export class UpdateUserUseCase {
    constructor(private readonly userRepo = new UserRepository()) { }

    async execute(id: string, payload: Partial<User>): Promise<User> {
        const updated = await this.userRepo.updateById(id, payload);
        if (!updated)
            throw new Error('User not found');
        return updated;
    }
}