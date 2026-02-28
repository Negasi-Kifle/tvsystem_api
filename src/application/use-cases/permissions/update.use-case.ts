import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { EntityNotFoundError, ValidationError } from "../../../domain/errors";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";

export class UpdatePermissionUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(id: string, payload: Partial<PermissionEntity>): Promise<PermissionEntity | null> {
        const permission = await this.permissionRepo.findById(id);
        if (!permission) {
            throw new EntityNotFoundError('Permission not found', 'Permission', id);
        }

        if (permission.isSystemPermission) {
            throw new ValidationError('System permission could not be updated');
        }

        const updatedPermission = permission.updateInstance(
            payload.name, payload.nameSlug,
            payload.description,
            payload.isSystemPermission);

        return await this.permissionRepo.update(updatedPermission);
    }
}