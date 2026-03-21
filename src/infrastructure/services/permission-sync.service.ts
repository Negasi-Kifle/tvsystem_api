import { SyncPermissionsUseCase } from '../../application/use-cases/permissions/sync-permissions.use-case';
import { PermissionRepository } from '../prisma/repositories/permission.repository';

export class PermissionSyncService {
  private readonly syncPermissionsUseCase: SyncPermissionsUseCase;

  constructor() {
    this.syncPermissionsUseCase = new SyncPermissionsUseCase(new PermissionRepository());
  }

  async syncPermissions(): Promise<void> {
    const count = await this.syncPermissionsUseCase.execute();
    
    // TODO: Sync "firstTimeAlert" permission
    console.log(`Synced ${count} permissions`);
  }
}
