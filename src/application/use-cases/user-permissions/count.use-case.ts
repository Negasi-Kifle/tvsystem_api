import { UserPermissionFilter, UserPermissionsRepository } from "../../../infrastructure/database/prisma/repositories/user-permissions.repository";
import { FetchAllUserPermissionsDto } from "../../../presentation/dtos/requests/fetch-all-user-permissions.dto";

export class CountUserPermissionsUseCase {
    constructor(private readonly userPermissionsRepository = new UserPermissionsRepository()) { }

    async execute(query: FetchAllUserPermissionsDto): Promise<number> {
        const filters: UserPermissionFilter = {
            ...(query.userId && { userId: query.userId }),
            ...(query.permissionId && { permissionId: query.permissionId }),
            ...(query.grantedBy && { grantedBy: query.grantedBy }),
            ...(query.expiresAt && { expiresAt: query.expiresAt })
        };

        return await this.userPermissionsRepository.count(filters);
    }
}