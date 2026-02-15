import { PermissionEntity } from "../entities/permission.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IPermissionRepository extends IBaseRepository<PermissionEntity> {
}