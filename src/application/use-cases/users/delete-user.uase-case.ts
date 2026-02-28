import { UserEntity } from "../../../domain/entities/user.entity";
import { EntityNotFoundError, ValidationError } from "../../../domain/errors";
import { IUserRepository } from "../../../domain/repositories/user.repo";

export class DeleteUserUseCase {
    constructor(private readonly userRepo: IUserRepository) { }

    async execute(id: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new EntityNotFoundError('User not found', 'User', id);
        }

        if (user.isFirstTimeAccount) {
            throw new ValidationError('First time account could not be deleted');
        }

        const deletedUser = await this.userRepo.deleteById(id);
        if (!deletedUser) {
            throw new ValidationError('Failed to delete user');
        }

        return deletedUser;
    }
}