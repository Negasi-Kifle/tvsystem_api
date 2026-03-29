import type { IUserPermissionsRepository } from '../../../domain/repositories/user-permissions.repo';

export class FindSlugsByUserIdUseCase {
    constructor(private readonly userPermissionsRepository: IUserPermissionsRepository) { }

    async execute(userId: string): Promise<string[]> {
        return await this.userPermissionsRepository.findPermissionSlugsByUserId(userId);

    }
}