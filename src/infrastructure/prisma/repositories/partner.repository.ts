import { Prisma } from "@prisma/client";
import { PrismaBaseRepository } from "./base.repository";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";
import { Partner } from "../../../domain/entities/partner.entity";
import { modelToEntity } from "../model_entity_mappers/partner";

export class PartnerRepository extends PrismaBaseRepository implements IPartnerRepository {

  async findById(id: string): Promise<Partner | null> {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    return partner ? modelToEntity(partner) : null;
  }

  async deleteById(id: string): Promise<Partner | null> {
    const deleted = await this.prisma.partner.delete({ where: { id } });
    return modelToEntity(deleted);
  }

  // TODO: When UpdatePartnerUseCase exists, sync partner.isActive to linked User.isActive
  async update(partner: Partner): Promise<Partner | null> {
    const data: Prisma.PartnerUpdateInput = {
      name: partner.name,
      revenueShare: { value: partner.revenueShare.value },
      isActive: partner.isActive,
      updatedAt: new Date(),
    };
    const updated = await this.prisma.partner.update({
      where: { id: partner.id },
      data,
    });
    return modelToEntity(updated);
  }
}
