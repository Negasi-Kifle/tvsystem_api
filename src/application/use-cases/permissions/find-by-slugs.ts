import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";


export class FindPermissionsBySlugsUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(slugs: string[]): Promise<PermissionEntity[]> {
        return await this.permissionRepo.findPermissionsBySlugs(slugs);
    }
}