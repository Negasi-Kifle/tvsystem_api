import { PermissionEntity } from "../entities/permission.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IPermissionRepository extends IBaseRepository<PermissionEntity> {
    findPermissionsBySlugs(slugs: string[]): Promise<PermissionEntity[]>;
    upsertByNameSlug(name: string, nameSlug: string): Promise<PermissionEntity>;
}