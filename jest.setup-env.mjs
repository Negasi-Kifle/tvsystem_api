/**
 * Ensures Prisma client module load succeeds in Jest when .env is absent (unit/integration smoke).
 */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/test';
}
