
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IHashService } from "../../../domain/services/hash-service.interface";
import { UserEntity } from "../../../domain/entities/user.entity";

export class ResetPasswordUseCase {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly hashService: IHashService,
    ) { }

    async execute(userId: string, newPlainPassword: string): Promise<UserEntity> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isFirstTimeAccount) {
            throw new Error('User is first time account');
        }

        const passwordHash = await this.hashService.hash(newPlainPassword);
        await this.userRepo.updatePassword(userId, passwordHash);

        return user;
    }
}