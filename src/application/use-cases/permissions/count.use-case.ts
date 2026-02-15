import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { PermissionEntity } from "../../../domain/entities/permission.entity";

export class CountPermissionsUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(query: QueryOptions<PermissionEntity, Partial<PermissionEntity>>): Promise<number> {
        return await this.permissionRepo.count(query.filters ?? {});
    }
}