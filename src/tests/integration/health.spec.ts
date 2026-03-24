import request from 'supertest';
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

const app = createApp({ storageService: testStorageService });

describe('Health', () => {
  it('responds with ok', async () => {
    const res = await request(app).get('/api/health').set('x-tenant-id', 'test');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
