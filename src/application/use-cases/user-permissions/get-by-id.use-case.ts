import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";

export class FindUserPermissionByIdUseCase {
    constructor(private readonly userPermissionsRepository: IUserPermissionsRepository) { }

    async execute(id: string): Promise<UserPermissionEntity | null> {
        const userPermission = await this.userPermissionsRepository.findById(id);
        if (!userPermission) {
            throw new Error('User permission not found');
        }
        return userPermission;
    }
}   