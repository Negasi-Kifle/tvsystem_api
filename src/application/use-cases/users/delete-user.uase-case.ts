import { UserEntity } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repo";

export class DeleteUserUseCase {
    constructor(private readonly userRepo: IUserRepository) { }

    async execute(id: string): Promise<UserEntity | null> {
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isFirstTimeAccount) {
            throw new Error('First time account could not be deleted');
        }

        const deletedUser = await this.userRepo.deleteById(id);
        if (!deletedUser) {
            throw new Error('Failed to delete user');
        }

        return deletedUser;
    }
}