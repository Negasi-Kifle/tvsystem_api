import request from 'supertest';
import { buildAppContainerForTests } from '../../composition/app-container';
import { createAuthMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { createAdvertPackageImageUploadMiddleware } from '../../infrastructure/middlewares/advert-package-upload.middleware';
import { createApp } from '../../presentation/app';
import type { IStorageService } from '../../domain/services/storage.service';

const testStorageService: IStorageService = {
  async upload() {
    return 'http://test.local/uploads/test/file.jpg';
  },
  async delete() {
    /* noop */
  },
};

const container = buildAppContainerForTests();
const app = createApp({
  ...container,
  storageService: testStorageService,
  advertPackageImageUpload: createAdvertPackageImageUploadMiddleware(),
  authMiddleware: createAuthMiddleware({
    userRepository: container.userRepository,
    userPermissionsRepository: container.userPermissionsRepository,
  }),
});

describe('Health', () => {
  it('responds with ok', async () => {
    const res = await request(app).get('/api/health').set('x-tenant-id', 'test');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
