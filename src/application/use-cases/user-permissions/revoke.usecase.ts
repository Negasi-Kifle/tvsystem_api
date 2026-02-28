import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { EntityNotFoundError, ValidationError } from "../../../domain/errors";
import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";


export class RevokeUserPermissionUseCase {
    constructor(private readonly userPermissionsRepository: IUserPermissionsRepository) { }

    async execute(id: string): Promise<UserPermissionEntity | null> {
        const userPermission = await this.userPermissionsRepository.findById(id);
        if (!userPermission) {
            throw new EntityNotFoundError('User permission not found', 'UserPermission', id);
        }

        // If user is first time account, do not revoke permission
        if (userPermission.user?.isFirstTimeAccount) {
            throw new ValidationError("First time account's permission could not be revoked");
        }

        return await this.userPermissionsRepository.deleteById(id);
    }
}