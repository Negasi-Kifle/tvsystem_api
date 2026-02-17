import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";


export class RevokeUserPermissionUseCase {
    constructor(private readonly userPermissionsRepository: IUserPermissionsRepository) { }

    async execute(id: string): Promise<UserPermissionEntity | null> {
        const userPermission = await this.userPermissionsRepository.findById(id);
        if (!userPermission) {
            throw new Error('User permission not found');
        }

        // If user is first time account, do not revoke permission
        if (userPermission.user?.isFirstTimeAccount) {
            throw new Error("First time account's permission could not be revoked");
        }

        return await this.userPermissionsRepository.deleteById(id);
    }
}