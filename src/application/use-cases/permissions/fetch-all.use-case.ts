import { PermissionFilter, PermissionRepository } from "../../../infrastructure/database/prisma/repositories/permission.repository";
import { Permission } from "../../../domain/entities/permission";
import { FetchAllPermissionsDto } from "../../../presentation/dtos/requests/fetch-all-permissions.dto";

export class FetchAllPermissionsUseCase {
    constructor(private readonly permissionRepo = new PermissionRepository()) { }

    async execute(query: FetchAllPermissionsDto): Promise<Permission[]> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const filters: PermissionFilter = {
            ...(query.name && { name: query.name }),
            ...(query.description && { description: query.description })
        };

        return await this.permissionRepo.findMany({
            skip: (page - 1) * limit,
            take: limit,
            filters
        });
    }
}