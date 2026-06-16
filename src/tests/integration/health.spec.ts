import request from 'supertest';
import type { RequestHandler } from 'express';
import { buildAppContainerForTests } from '../../composition/app-container';

if (!process.env.OPENAI_API_KEY) {
  process.env.OPENAI_API_KEY = 'test-dummy-openai-key';
}
import { createAuthMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { createAdvertPackageImageUploadMiddleware } from '../../infrastructure/middlewares/advert-package-upload.middleware';
import { createAdvertSchedulePdfUploadMiddleware } from '../../infrastructure/middlewares/advert-schedule-pdf-upload.middleware';
import { createApp } from '../../presentation/app';
import type { IStorageService } from '../../domain/services/storage.service';

const auditMiddlewarePassThrough: RequestHandler = (_req, _res, next) => next();

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
  auditMiddleware: auditMiddlewarePassThrough,
  storageService: testStorageService,
  advertPackageImageUpload: createAdvertPackageImageUploadMiddleware(),
  advertSchedulePdfUpload: createAdvertSchedulePdfUploadMiddleware(),
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
