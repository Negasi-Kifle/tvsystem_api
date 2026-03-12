import { Prisma } from '../generated/client';
import { PrismaBaseRepository } from "./base.repository";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { UserEntity } from "../../../domain/entities/user.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { UserFilters } from "../../../domain/interfaces/user-filters.interface";
import { modelToEntity, entityToModel } from "../model_entity_mappers/user";
import { buildWhereClauseForUser } from "../where_clauses/user";
import { hashPassword } from "../../../shared/utils/password";
import { UserRefModel } from "../../../domain/enums/user-ref-model.enum";
import { EntityNotFoundError } from "../../../domain/errors";


export class UserRepository extends PrismaBaseRepository implements IUserRepository {

  async create(userEntity: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const userModel = entityToModel(userEntity);

    // Hash password
    userModel.passwordHash = await hashPassword(userModel.passwordHash);

    // Omit id so DB generates it via @default(uuid())
    const { id: _omit, ...createData } = userModel;
    const savedUser = await this.prisma.user.create({ data: createData });
    return modelToEntity(savedUser);
  }

  async createUserWithPermissions(userEntity: UserEntity, permissionIds: string[], grantedBy?: string): Promise<UserEntity> {
    const userModel = entityToModel(userEntity);
    userModel.passwordHash = await hashPassword(userModel.passwordHash);
    const { id: _omit, ...createData } = userModel;
    const uniquePermissionIds = [...new Set(permissionIds)];

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const savedUser = await tx.user.create({ data: createData });

      if (uniquePermissionIds.length > 0) {
        const effectiveGrantedBy = grantedBy ?? savedUser.id;

        await tx.userPermission.createMany({
          data: uniquePermissionIds.map((permissionId) => ({
            userId: savedUser.id,
            permissionId,
            grantedBy: effectiveGrantedBy,
          })),
        });
      }
      
      return modelToEntity(savedUser);
    });
  }

  async findMany(query: QueryOptions<UserEntity, UserFilters>): Promise<UserEntity[]> {
    const where = buildWhereClauseForUser((query.filters ?? {}) as UserFilters);
    const users = await this.prisma.user.findMany({ where, skip: query.skip ?? 0, take: query.take ?? 10 });
    return users.map(modelToEntity);
  }


  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? modelToEntity(user) : null;
  }

  async findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhoneNumber },
          { phoneNumber: emailOrPhoneNumber },
        ],
      },
    });
    return user ? modelToEntity(user) : null;
  }

  async update(userEntity: UserEntity): Promise<UserEntity | null> {
    const where = { id: userEntity.id };
    const data = entityToModel(userEntity);
    const user = await this.prisma.user.update({ where, data });
    return modelToEntity(user);
  }

  async deleteById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.delete({ where: { id } });
    return user ? modelToEntity(user) : null;
  }

  async count(filters?: Partial<UserEntity>): Promise<number> {
    return this.prisma.user.count({ where: buildWhereClauseForUser((filters ?? {}) as UserFilters) });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return user ? modelToEntity(user) : null;
  }

  async updateStatusWithParentSync(userEntity: UserEntity): Promise<UserEntity | null> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedUser = await tx.user.update({
        where: { id: userEntity.id },
        data: { isActive: userEntity.isActive },
      });

      if (userEntity.refModel === UserRefModel.Employee) {
        if (!userEntity.employeeId) {
          throw new EntityNotFoundError('Employee reference missing for user', 'Employee');
        }
        await tx.employee.update({
          where: { id: userEntity.employeeId },
          data: { isActive: userEntity.isActive },
        });
      }

      if (userEntity.refModel === UserRefModel.Partner) {
        if (!userEntity.partnerId) {
          throw new EntityNotFoundError('Partner reference missing for user', 'Partner');
        }
        await tx.partner.update({
          where: { id: userEntity.partnerId },
          data: { isActive: userEntity.isActive },
        });
      }

      return modelToEntity(updatedUser);
    });
  }
}