import { UserPermission } from "../../../domain/entities/user-permissions";
import { UserPermissionFilter, UserPermissionsRepository } from "../../../infrastructure/database/prisma/repositories/user-permissions.repository";
import { FetchAllUserPermissionsDto } from "../../../presentation/dtos/requests/fetch-all-user-permissions.dto";

export class FetchAllUserPermissionsUseCase {
    constructor(private readonly userPermissionsRepository = new UserPermissionsRepository()) { }

    async execute(query: FetchAllUserPermissionsDto): Promise<UserPermission[]> {
        const filters: UserPermissionFilter = {
            ...(query.userId && { userId: query.userId }),
            ...(query.permissionId && { permissionId: query.permissionId }),
            ...(query.grantedBy && { grantedBy: query.grantedBy }),
            ...(query.expiresAt && { expiresAt: query.expiresAt })
        };

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        
        return await this.userPermissionsRepository.findMany({
            skip: (page - 1) * limit,
            take: limit,
            filters
        });
    }
}