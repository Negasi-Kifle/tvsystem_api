import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";

export class FindPermissionByIdUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(id: string): Promise<PermissionEntity | null> {
        const permission = await this.permissionRepo.findById(id);
        if (!permission) {
            throw new Error('Permission not found');
        }
        return permission;
    }
}