import { Prisma, TelegramGroup, User } from '@prisma/client';
import { UserRepositoryInterface } from '../../../../domain/interfaces/repositories/user.repository.interface';
import { User as DomainUser } from '../../../../domain/entities/user.entity';
import { PrismaBaseRepository } from './base.repository';
import { SexTypes } from '../../../../domain/enums/sex-types.enum';
import { UserRole } from '../../../../domain/enums/user-role.enum';

export interface UserFilter {
  email?: string;
  phoneNumber?: string;
  roles?: UserRole;
  isActive?: boolean;
  sex?: SexTypes;
  isFirstTimeAccount?: boolean;
  telegramUsername?: string;
}

export interface UserQueryOptions {
  skip: number;
  take: number;
  filters?: UserFilter;
}

export class UserRepository extends PrismaBaseRepository implements UserRepositoryInterface {
  /**
   * Build Prisma where clause from filters
   */
  private buildWhereClause(filters?: UserFilter): Prisma.UserWhereInput {
    if (!filters) return {};

    return {
      ...(filters.email && { email: { contains: filters.email, mode: 'insensitive' as Prisma.QueryMode } }),
      ...(filters.phoneNumber && { phoneNumber: { contains: filters.phoneNumber } }),
      ...(filters.roles && { roles: { has: filters.roles } }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.sex && { sex: filters.sex }),
      ...(filters.isFirstTimeAccount !== undefined && { isFirstTimeAccount: filters.isFirstTimeAccount }),
      ...(filters.telegramUsername !== undefined && { telegramUsername: filters.telegramUsername }),
    };
  }


  /**
   * Map Prisma User to Domain User
   */
  private toDomain(user: User): DomainUser {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      phoneNumber: user.phoneNumber,
      sex: user.sex as SexTypes,
      fullName: user.fullName,
      roles: user.roles as DomainUser['roles'],
      permissions: user.permissions,
      isFirstTimeAccount: user.isFirstTimeAccount,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      telegramUsername: user.telegramUsername ?? '',
    };
  }


  /**
   * Find user by email or phone number
   */
  async findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhoneNumber },
          { phoneNumber: emailOrPhoneNumber }
        ]
      }
    });
    return user ? this.toDomain(user) : null;
  }


  /**
   * Find user by multiple fields
   */
  async findByMultipleFields(fields: Partial<DomainUser>): Promise<DomainUser | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        ...(fields.email !== undefined && { email: fields.email }),
        ...(fields.phoneNumber !== undefined && { phoneNumber: fields.phoneNumber }),
        ...(fields.sex !== undefined && { sex: fields.sex }),
        ...(fields.roles !== undefined && { roles: { equals: fields.roles as any } }),
        ...(fields.permissions !== undefined && { permissions: { equals: fields.permissions as any } }),
        ...(fields.isActive !== undefined && { isActive: fields.isActive }),
        ...(fields.isFirstTimeAccount !== undefined && { isFirstTimeAccount: fields.isFirstTimeAccount }),
        ...(fields.telegramUsername !== undefined && { telegramUsername: fields.telegramUsername }),
      },
      orderBy: { createdAt: 'desc' }
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
        phoneNumber: data.phoneNumber,
        sex: data.sex,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        roles: data.roles,
        permissions: data.permissions,
        isActive: data.isActive,
        isFirstTimeAccount: data.isFirstTimeAccount,
        telegramUsername: data.telegramUsername,
      }
    });
    return this.toDomain(user);
  }


  /**
   * Update user by ID
   */
  async updateById(id: string, update: Partial<DomainUser>): Promise<DomainUser | null> {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) return null;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(update.email !== undefined && { email: update.email }),
        ...(update.passwordHash !== undefined && { passwordHash: update.passwordHash }),
        ...(update.fullName !== undefined && { fullName: update.fullName }),
        ...(update.roles !== undefined && { roles: update.roles }),
        ...(update.permissions !== undefined && { permissions: update.permissions }),
        ...(update.isActive !== undefined && { isActive: update.isActive }),
        ...(update.telegramUsername !== undefined && { telegramUsername: update.telegramUsername }),
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


  /**
   * Find many users with optional filters
   */
  async findMany(query: UserQueryOptions): Promise<DomainUser[]> {
    const where = this.buildWhereClause(query.filters);
    const users = await this.prisma.user.findMany({
      where,
      skip: query.skip,
      take: query.take,
      orderBy: { createdAt: 'desc' }
    });
    return users.map(this.toDomain);
  }


  /**
   * Count users with optional filters
   */
  async count(filters?: UserFilter): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.user.count({ where });
  }


  /**
   * Delete a user with an id
   */
  async delete(id: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.delete({ where: { id } })
    
    return user ? this.toDomain(user) : null
  }
}
