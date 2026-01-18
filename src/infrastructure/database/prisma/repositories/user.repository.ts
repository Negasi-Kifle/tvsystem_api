import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../../../../domain/interfaces/repositories/user.repository.interface';
import { User as DomainUser } from '../../../../domain/entities/user.entity';
import { PrismaBaseRepository } from './base.repository';

export class UserRepository extends PrismaBaseRepository implements UserRepositoryInterface {
  /**
   * Map Prisma User to Domain User
   */
  private toDomain(user: User): DomainUser {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      fullName: user.fullName,
      roles: user.roles as DomainUser['roles'],
      permissions: user.permissions,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    return user ? this.toDomain(user) : null;
  }

  /**
   * Create a new user
   */
  async create(data: Omit<DomainUser, 'id'>): Promise<DomainUser> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        roles: data.roles,
        permissions: data.permissions,
        isActive: data.isActive
      }
    });
    return this.toDomain(user);
  }

  /**
   * Update user by ID
   */
  async updateById(
    id: string,
    update: Partial<DomainUser>
  ): Promise<DomainUser | null> {
    const existing = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existing) {
      return null;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(update.email !== undefined && { email: update.email }),
        ...(update.passwordHash !== undefined && { passwordHash: update.passwordHash }),
        ...(update.fullName !== undefined && { fullName: update.fullName }),
        ...(update.roles !== undefined && { roles: update.roles }),
        ...(update.permissions !== undefined && { permissions: update.permissions }),
        ...(update.isActive !== undefined && { isActive: update.isActive })
      }
    });

    return this.toDomain(user);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    return user ? this.toDomain(user) : null;
  }
}
