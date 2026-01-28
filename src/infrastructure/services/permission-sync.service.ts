import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import prisma from '../database/prisma/prisma.client';

export class PermissionSyncService {
  async syncPermissions(): Promise<void> {
    const permissionValues = Object.values(PERMISSIONS);
    
    for (const name of permissionValues) {
      const nameSlug = name.toLowerCase().replace(/ /g, '_');
      await prisma.permission.upsert({
        where: { nameSlug },
        create: { name, nameSlug },
        update: { nameSlug }  // Update slug if name format changes
      });
    }
    
    // eslint-disable-next-line no-console
    console.log(`Synced ${permissionValues.length} permissions`);
  }
}
