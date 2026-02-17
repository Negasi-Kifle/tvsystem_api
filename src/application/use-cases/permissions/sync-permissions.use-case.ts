import { IPermissionRepository } from '../../../domain/repositories/permission.repository.repo';
import { PERMISSIONS } from '../../../shared/constants/permissions.constants';

export class SyncPermissionsUseCase {
  constructor(private readonly permissionRepo: IPermissionRepository) {}

  async execute(): Promise<number> {
    const permissionValues = Object.values(PERMISSIONS);

    for (const value of permissionValues) {
      const nameSlug = value.toLowerCase().replace(/ /g, '_');
      await this.permissionRepo.upsertByNameSlug(value, nameSlug);
    }

    return permissionValues.length;
  }
}
