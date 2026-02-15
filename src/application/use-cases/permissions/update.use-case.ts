import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";

export class UpdatePermissionUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(id: string, payload: Partial<PermissionEntity>): Promise<PermissionEntity | null> {
        const permission = await this.permissionRepo.findById(id);
        if (!permission) {
            throw new Error('Permission not found');
        }

        if (permission.isSystemPermission) {
            throw new Error('System permission could not be updated');
        }

        const updatedPermission = permission.updateInstance(
            payload.name, payload.nameSlug,
            payload.description,
            payload.isSystemPermission);

        return await this.permissionRepo.update(updatedPermission);
    }
}