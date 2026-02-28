
import { UserEntity } from '../../../domain/entities/user.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { IUserRepository } from '../../../domain/repositories/user.repo';

export class GetByEmailOrPhoneUseCase {
    constructor(private readonly userRepo: IUserRepository) { }

    async execute(emailOrPhone: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findByEmailOrPhoneNumber(emailOrPhone);
        if (!user) {
            throw new EntityNotFoundError('User not found', 'User', emailOrPhone);
        }
        return user;
    }
}