import { Partner, Prisma, User } from "@prisma/client";
import { PrismaBaseRepository } from "./base.repository";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";
import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { entityToModel, modelToEntity } from "../model_entity_mappers/partner";
import { UserEntity } from "../../../domain/entities/user.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { entityToModel as userEntityToModel, modelToEntity as userModelToEntity } from "../model_entity_mappers/user";
import { UserRefModel } from "../../../domain/enums/user-ref-model.enum";
import { buildWhereClauseForPartner } from "../where_clauses/partner";

export class PartnerRepository extends PrismaBaseRepository implements IPartnerRepository {
  createPartnerAndUser(
    partner: PartnerEntity,
    user: UserEntity,
    permissionIds: string[],
    grantedBy?: string,
  ): Promise<{ partner: PartnerEntity; user: UserEntity; }> {
    return this.createPartnerUserAndPermissions(partner, user, permissionIds, grantedBy);
    
  }

  async createPartnerUserAndPermissions(
    partner: Omit<PartnerEntity, 'id'>,
    user: Omit<UserEntity, 'id'>,
    permissionIds: string[],
    grantedBy?: string,
  ): Promise<{ partner: PartnerEntity; user: UserEntity; }> {
    
    const partnerModel = entityToModel(partner);
    const userModel = userEntityToModel(user);

    const partnerData: Prisma.PartnerUncheckedCreateInput = {
      revenueShare: partnerModel.revenueShare as Prisma.InputJsonValue,
      isActive: partnerModel.isActive,
      createdAt: partnerModel.createdAt,
      updatedAt: partnerModel.updatedAt,
    };
    const { id: _omitUser, ...userData } = userModel;

    return this.prisma.$transaction(async (tx) => {
      const uniquePermissionIds = [...new Set(permissionIds)];

      const savedPartner = await tx.partner.create({ data: partnerData });

      // Add refModel and partner id to user
      userData.refModel = UserRefModel.Partner;
      userData.partnerId = savedPartner.id;
      const savedUser = await tx.user.create({ data: userData });

      if(uniquePermissionIds.length > 0) {
        const effectiveGrantedBy = grantedBy ?? savedUser.id;
        await tx.userPermission.createMany({
          data: uniquePermissionIds.map((permissionId) => ({
            userId: savedUser.id,
            permissionId,
            grantedBy: effectiveGrantedBy,
          })),
        });
      }

      return { partner: modelToEntity(savedPartner), user: userModelToEntity(savedUser) };
    });
  }


  async findMany(query: QueryOptions<PartnerEntity, Partial<PartnerEntity>>): Promise<PartnerEntity[]> {
    const where = buildWhereClauseForPartner(query.filters ?? {});
    const partners = await this.prisma.partner.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { user: true },
    });

    return partners.map(modelToEntity);
  }

  async count(filters?: Partial<PartnerEntity> | undefined): Promise<number> {
    const where = buildWhereClauseForPartner(filters ?? {});
    return this.prisma.partner.count({ where });
  }

  async create(data: Omit<PartnerEntity, "id">): Promise<PartnerEntity> {
    const partnerModel = entityToModel(data as PartnerEntity);
    const createData: Prisma.PartnerCreateInput = {
      revenueShare: partnerModel.revenueShare as Prisma.InputJsonValue,
      isActive: partnerModel.isActive,
      createdAt: partnerModel.createdAt,
      updatedAt: partnerModel.updatedAt,
    };
    const savedPartner = await this.prisma.partner.create({ data: createData });
    return modelToEntity(savedPartner);
  }

  async findById(id: string): Promise<PartnerEntity | null> {
    const partner = await this.prisma.partner.findUnique({ where: { id }, include: { user: true } });
    return partner ? modelToEntity(partner as Partner & { user?: User | null }) : null;
  }

  async deleteById(id: string): Promise<PartnerEntity | null> {
    const deleted = await this.prisma.partner.delete({ where: { id } });
    return modelToEntity(deleted);
  }

  // TODO: When UpdatePartnerUseCase exists, sync partner.isActive to linked User.isActive
  async update(partner: PartnerEntity): Promise<PartnerEntity | null> {
    const data: Prisma.PartnerUpdateInput = {
      revenueShare: { value: partner.revenueShare.value },
      updatedAt: new Date(),
    };

    const updated = await this.prisma.partner.update({
      where: { id: partner.id },
      data,
    });
    return modelToEntity(updated);
  }

  async updatePartnerAndUserStatus(
    partner: PartnerEntity,
    user: UserEntity,
  ): Promise<{ partner: PartnerEntity; user: UserEntity }> {
    return this.prisma.$transaction(async (tx) => {
      const updatedPartner = await tx.partner.update({
        where: { id: partner.id },
        data: {
          isActive: partner.isActive,
          updatedAt: new Date(),
        },
      });
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: userEntityToModel(user),
      });

      return { partner: modelToEntity(updatedPartner), user: userModelToEntity(updatedUser) };
    });
  }
}
