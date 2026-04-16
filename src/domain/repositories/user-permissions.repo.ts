import { UserPermissionEntity } from "../entities/user-permissions.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IUserPermissionsRepository extends IBaseRepository<UserPermissionEntity> {
  findPermissionSlugsByUserId(userId: string): Promise<string[]>;
  findActiveUserEmailsByPermissionSlug(slug: string): Promise<string[]>;
}