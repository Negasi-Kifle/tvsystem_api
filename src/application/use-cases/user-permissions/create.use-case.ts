import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { EntityAlreadyExistsError } from "../../../domain/errors";
import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";


export type CreateUserPermissionInput = {
    userId: string;
    permissionId: string;
    grantedBy: string;
    expiresAt?: Date;
};

export class CreateUserPermissionUseCase {
    constructor(private readonly userPermissionsRepository: IUserPermissionsRepository) { }

    async execute(payload: CreateUserPermissionInput): Promise<UserPermissionEntity> {
        const userPermissionEntity = UserPermissionEntity.createInstance(
            payload.userId,
            payload.permissionId,
            payload.grantedBy,
            payload.expiresAt,
        );

        // Check if user permission already exists (incl. non-expired)
        const existingUserPermissions = await this.userPermissionsRepository.findMany({
            filters: {
                userId: userPermissionEntity.userId,
                permissionId: userPermissionEntity.permissionId
            }
        });

        const now = new Date();
        const hasActivePermission = existingUserPermissions.some(
            up => !up.expiresAt || up.expiresAt > now
        );
        if (hasActivePermission) {
            throw new EntityAlreadyExistsError('User permission already exists', 'UserPermission');
        }

        return await this.userPermissionsRepository.create(userPermissionEntity);
    }
}