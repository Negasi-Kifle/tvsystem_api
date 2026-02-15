import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";

export class FetchAllPermissionsUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(query: QueryOptions<PermissionEntity, Partial<PermissionEntity>>): Promise<PermissionEntity[]> {
        return await this.permissionRepo.findMany(query);
    }
}