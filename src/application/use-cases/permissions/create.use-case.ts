import { PermissionEntity } from "../../../domain/entities/permission.entity";
import { IPermissionRepository } from "../../../domain/repositories/permission.repository.repo";


export interface CreatePermissionInput {
    name: string;
    nameSlug?: string;
    isSystemPermission?: boolean;
    description?: string;
}

export class CreatePermissionUseCase {
    constructor(private readonly permissionRepo: IPermissionRepository) { }

    async execute(payload: CreatePermissionInput): Promise<PermissionEntity> {
        const nameSlug = payload.nameSlug ?? payload.name.toLowerCase().replace(/ /g, '_');
        const permissionEntity = PermissionEntity.createInstance(
            payload.name,
            nameSlug,
            payload.isSystemPermission,
            payload.description
        );

        const existingPermission = await this.permissionRepo.findMany({
            filters: {
                nameSlug: permissionEntity.nameSlug
            }
        });

        if (existingPermission.length > 0) {
            throw new Error('Permission already exists');
        }

        return await this.permissionRepo.create(permissionEntity);
    }
}