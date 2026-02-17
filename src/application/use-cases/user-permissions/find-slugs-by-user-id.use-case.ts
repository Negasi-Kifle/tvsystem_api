import { UserPermissionsRepository } from "../../../infrastructure/prisma/repositories/user-permissions.repository";

export class FindSlugsByUserIdUseCase {
    constructor(private readonly userPermissionsRepository: UserPermissionsRepository) { }

    async execute(userId: string): Promise<string[]> {
        return await this.userPermissionsRepository.findPermissionSlugsByUserId(userId);

    }
}