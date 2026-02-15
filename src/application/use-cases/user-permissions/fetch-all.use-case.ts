import { UserPermissionEntity } from "../../../domain/entities/user-permissions.entity";
import { IUserPermissionsRepository } from "../../../domain/repositories/user-permissions.repo";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";

export class FetchAllUserPermissionsUseCase {
    constructor(private readonly userPermissionsRepository: IUserPermissionsRepository) { }

    async execute(query: QueryOptions<UserPermissionEntity, Partial<UserPermissionEntity>>): Promise<UserPermissionEntity[]> {
        return await this.userPermissionsRepository.findMany(query);
    }
}