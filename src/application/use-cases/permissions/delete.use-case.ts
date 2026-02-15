import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";

export class DeletePermissionUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(id: string): Promise<PermissionEntity | null> {
        const permission = await this.permissionRepo.findById(id);
        if (!permission) {
            throw new Error('Permission not found');
        }

        if (permission.isSystemPermission) {
            throw new Error('System permission could not be deleted');
        }

        return await this.permissionRepo.deleteById(id);
    }
}