import { Permission } from "../../../domain/entities/permission";
import { PermissionRepository } from "../../../infrastructure/database/prisma/repositories/permission.repository";

export class GetPermissionByIdUseCase {
    constructor(private readonly permissionRepo = new PermissionRepository()) { }

    async execute(id: string): Promise<Permission | null> {
        return await this.permissionRepo.findById(id);
    }
}