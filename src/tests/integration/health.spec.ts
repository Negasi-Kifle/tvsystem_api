import request from 'supertest';
import app from '../../presentation/app';

describe('Health', () => {
  it('responds with ok', async () => {
    const res = await request(app).get('/api/health').set('x-tenant-id', 'test');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
