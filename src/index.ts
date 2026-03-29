import 'dotenv/config';
import { buildAppContainer } from './composition/app-container';
import { createApp } from './presentation/app';
import { createAuthMiddleware } from './infrastructure/middlewares/auth.middleware';
import { createAdvertPackageImageUploadMiddleware } from './infrastructure/middlewares/advert-package-upload.middleware';
import { storageService } from './infrastructure/services/storage/storage.factory';
import { SchedulerService } from './infrastructure/services/scheduler.service';
import { PermissionSyncService } from './infrastructure/services/permission-sync.service';
import { AlertService } from './application/services/alert.service';
import { connectPrisma, disconnectPrisma } from './infrastructure/prisma';

const port = process.env.PORT || 3000;

async function bootstrap(): Promise<void> {
  // Connect to PostgreSQL via Prisma
  await connectPrisma();
  // eslint-disable-next-line no-console
  console.log('Connected to PostgreSQL database');

  // Sync permissions in background (fire and forget)
  const permissionSync = new PermissionSyncService();
  permissionSync.syncPermissions().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to sync permissions:', error);
  });

  const scheduler = new SchedulerService();
  const alertService = new AlertService();
  scheduler.scheduleDailySixAm(() => alertService.processOffAirAlerts());

  const container = buildAppContainer();
  const app = createApp({
    ...container,
    storageService,
    advertPackageImageUpload: createAdvertPackageImageUploadMiddleware(),
    authMiddleware: createAuthMiddleware({
      userRepository: container.userRepository,
      userPermissionsRepository: container.userPermissionsRepository,
    }),
  });

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    // eslint-disable-next-line no-console
    console.log('Shutting down gracefully...');
    server.close(async () => {
      await disconnectPrisma();
      // eslint-disable-next-line no-console
      console.log('Database connection closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start application', error);
  process.exit(1);
});
