import { PermissionFilter, PermissionRepository } from "../../../infrastructure/database/prisma/repositories/permission.repository";
import { FetchAllPermissionsDto } from "../../../presentation/dtos/requests/fetch-all-permissions.dto";

export class CountPermissionsUseCase {
    constructor(private readonly permissionRepo = new PermissionRepository()) { }

    async execute(query: FetchAllPermissionsDto): Promise<number> {
        const filters: PermissionFilter = {
            ...(query.name && { name: query.name }),
            ...(query.description && { description: query.description })
        };
        
        return await this.permissionRepo.count(filters);
    }
}