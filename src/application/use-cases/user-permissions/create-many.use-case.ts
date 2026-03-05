import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { EntityAlreadyExistsError, EntityNotFoundError } from "../../../domain/errors";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";
import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";

export type CreateUserPermissionsInput = {
    userId: string;
    permissionIds: string[];
    grantedBy: string;
    expiresAt?: Date;
};

export class CreateManyUserPermissionsUseCase {
    constructor(
        private readonly userPermissionsRepository: IUserPermissionsRepository,
        private readonly userRepository: IUserRepository,
        private readonly permissionRepository: IPermissionRepository,
    ) { }

    async execute(payload: CreateUserPermissionsInput): Promise<UserPermissionEntity[]> {
        const uniquePermissionIds = [...new Set(payload.permissionIds)];

        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new EntityNotFoundError('User not found', 'User', payload.userId);
        }

        const permissionEntities = await Promise.all(
            uniquePermissionIds.map((permissionId) => this.permissionRepository.findById(permissionId))
        );
        const missingPermissionIds = uniquePermissionIds.filter((_, index) => !permissionEntities[index]);
        if (missingPermissionIds.length > 0) {
            throw new EntityNotFoundError(
                `Permissions not found: ${missingPermissionIds.join(", ")}`,
                'Permission'
            );
        }

        const now = new Date();
        const existingUserPermissions = await this.userPermissionsRepository.findMany({
            filters: { userId: payload.userId }
        });
        const activePermissionIdSet = new Set(
            existingUserPermissions
                .filter((up) => !up.expiresAt || up.expiresAt > now)
                .map((up) => up.permissionId)
        );
        const duplicatePermissionIds = uniquePermissionIds.filter((permissionId) => activePermissionIdSet.has(permissionId));
        const permissionIdsToCreate = uniquePermissionIds.filter(
            (permissionId) => !duplicatePermissionIds.includes(permissionId)
        );

        return Promise.all(
            permissionIdsToCreate.map((permissionId) => {
                const userPermissionEntity = UserPermissionEntity.createInstance(
                    payload.userId,
                    permissionId,
                    payload.grantedBy,
                    payload.expiresAt,
                );
                return this.userPermissionsRepository.create(userPermissionEntity);
            })
        );
    }
}
