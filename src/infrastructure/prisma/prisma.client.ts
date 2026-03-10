import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = (): PrismaClient => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please check your .env file.'
    );
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });

  return new PrismaClient({ adapter });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export async function connectPrisma(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please check your .env file.'
    );
  }

  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    throw new Error(
      `Invalid DATABASE_URL format. Expected postgresql:// or postgres:// URL, got: ${databaseUrl.substring(0, 20)}...`
    );
  }

  try {
    await prisma.$connect();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errorCode' in error) {
      const prismaError = error as { errorCode: string; message: string };

      if (prismaError.errorCode === 'P1010') {
        const message = `Database connection failed (P1010): ${prismaError.message}\n` +
          `This usually means:\n` +
          `1. The database does not exist - run: npx prisma migrate dev\n` +
          `2. The DATABASE_URL is incorrect - check your .env file\n` +
          `3. The database user lacks permissions\n` +
          `Current DATABASE_URL: ${databaseUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')}`;
        throw new Error(message);
      }
    }

    throw error;
  }
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

export default prisma;
