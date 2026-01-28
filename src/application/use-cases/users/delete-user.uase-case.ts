import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../infrastructure/database/prisma";

export class DeleteUserUseCase {
    constructor(private readonly userRepo = new UserRepository()) { }

    async execute(id: string): Promise<User | null> {
        return await this.userRepo.delete(id)
    }
}