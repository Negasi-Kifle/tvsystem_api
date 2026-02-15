import { PrismaBaseRepository } from "./base.repository";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { UserEntity } from "../../../domain/entities/user.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { modelToEntity, entityToModel } from "../model_entity_mappers/user";
import { buildWhereClauseForUser } from "../where_clauses/user";
import { hashPassword } from "../../../shared/utils/password";


export class UserRepository extends PrismaBaseRepository implements IUserRepository {

  async create(userEntity: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const userModel = entityToModel(userEntity);

    // Hash password
    userModel.passwordHash = await hashPassword(userModel.passwordHash);

    const savedUser = await this.prisma.user.create({ data: userModel });
    return modelToEntity(savedUser);
  }


  async findMany(query: QueryOptions<UserEntity>): Promise<UserEntity[]> {
    const where = buildWhereClauseForUser(query.filters ?? {});
    const users = await this.prisma.user.findMany({ where, skip: query.skip ?? 0, take: query.take ?? 10 });
    return users.map(modelToEntity);
  }


  async findById(id: string): Promise<UserEntity | null> {
    console.log('findById', id);
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
    return this.prisma.user.count({ where: buildWhereClauseForUser(filters ?? {}) });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return user ? modelToEntity(user) : null;
  }
}