import { Permission } from "../../../domain/entities/permission";
import { PermissionRepository } from "../../../infrastructure/database/prisma/repositories/permission.repository";
import { CreatePermissionDto } from "../../../presentation/dtos/requests/create-permission.dto";

export class CreatePermissionUseCase {
    constructor(private readonly permissionRepo = new PermissionRepository()) { }

    async execute(payload: Omit<Permission, 'id'>): Promise<Permission> {
        return this.permissionRepo.create(payload);
    }
}