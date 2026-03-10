import { PrismaClient } from '../generated/client';
import prisma from '../prisma.client';

/**
 * Base class providing access to Prisma client for all repositories.
 */
export abstract class PrismaBaseRepository {
  protected readonly prisma: PrismaClient = prisma;
}
