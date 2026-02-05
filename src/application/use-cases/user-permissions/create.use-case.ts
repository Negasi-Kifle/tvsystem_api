import { UserPermission } from "../../../domain/entities/user-permissions";
import { UserPermissionsRepository } from "../../../infrastructure/database/prisma/repositories/user-permissions.repository";

// Input type excluding auto-populated relation fields
type CreateUserPermissionInput = Omit<UserPermission, 'id' | 'user' | 'permission' | 'grantedByUser'>;

export class CreateUserPermissionUseCase {
    constructor(private readonly userPermissionsRepository = new UserPermissionsRepository()) {}

    async execute(payload: CreateUserPermissionInput): Promise<UserPermission> {
        return this.userPermissionsRepository.create(payload);
    }
}