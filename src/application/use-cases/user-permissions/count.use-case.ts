import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";
import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";

export class CountUserPermissionsUseCase {
    constructor(private readonly userPermissionsRepository: IUserPermissionsRepository) { }

    async execute(query: QueryOptions<UserPermissionEntity, Partial<UserPermissionEntity>>): Promise<number> {
        return await this.userPermissionsRepository.count(query.filters ?? {});
    }
}