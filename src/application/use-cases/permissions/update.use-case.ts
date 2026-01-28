import { Permission } from "../../../domain/entities/permission";
import { PermissionRepository } from "../../../infrastructure/database/prisma/repositories/permission.repository";

export class UpdatePermissionUseCase {
    constructor(private readonly permissionRepo = new PermissionRepository()) { }

    async execute(id: string, payload: Partial<Permission>): Promise<Permission | null> {
        return await this.permissionRepo.updateById(id, payload);
    }
}