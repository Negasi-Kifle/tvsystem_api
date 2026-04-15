import { Prisma } from '../generated/client';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { PrismaBaseRepository } from './base.repository';
import { advertSalesReadInclude, entityToModel, modelToEntity } from '../model_entity_mappers/advert-sales';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForAdvertSales } from '../where_clauses/advert-sales';

export class AdvertSalesRepository extends PrismaBaseRepository implements IAdvertSalesRepository {
  async create(data: Omit<AdvertSalesEntity, 'id'>): Promise<AdvertSalesEntity> {
    const entity = data as AdvertSalesEntity;
    const row = entityToModel(entity);
    const { id: _omit, ...createData } = row;

    const saved = await this.prisma.advertSales.create({
      data: createData as Prisma.AdvertSalesUncheckedCreateInput,
    });

    const full = await this.prisma.advertSales.findUnique({
      where: { id: saved.id },
      include: advertSalesReadInclude,
    });
    
    return full ? modelToEntity(full) : modelToEntity(saved);
  }

  async findById(id: string): Promise<AdvertSalesEntity | null> {
    const row = await this.prisma.advertSales.findUnique({
      where: { id },
      include: advertSalesReadInclude,
    });
    return row ? modelToEntity(row) : null;
  }

  async findMany(query: QueryOptions<AdvertSalesEntity>): Promise<AdvertSalesEntity[]> {
    const where = buildWhereClauseForAdvertSales(query.filters ?? {});
    const rows = await this.prisma.advertSales.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { createdAt: 'desc' },
      include: advertSalesReadInclude,
    });
    return rows.map(modelToEntity);
  }

  async count(filters?: Partial<AdvertSalesEntity>): Promise<number> {
    return this.prisma.advertSales.count({
      where: buildWhereClauseForAdvertSales(filters ?? {}),
    });
  }

  async update(entity: AdvertSalesEntity): Promise<AdvertSalesEntity | null> {
    if (!entity.id) return null;
    const row = entityToModel(entity);
    const updated = await this.prisma.advertSales.update({
      where: { id: entity.id },
      data: {
        referenceNumber: row.referenceNumber,
        advertPackageId: row.advertPackageId,
        customerId: row.customerId,
        status: row.status,
        advertType: row.advertType,
        adStartDate: row.adStartDate,
        adEndDate: row.adEndDate,
        adLengthSeconds: row.adLengthSeconds,
        numOfSlots: row.numOfSlots,
        adPackagePrice: row.adPackagePrice,
        discountPercentage: row.discountPercentage,
        finalPrice: row.finalPrice,
        installmentCount: row.installmentCount,
        campaignName: row.campaignName,
        contractSignDate: row.contractSignDate,
        salesRepId: row.salesRepId,
        salesRepCommissionPercentage: row.salesRepCommissionPercentage,
        categoryId: row.categoryId,
        subCategoryId: row.subCategoryId,
        salesAgentId: row.salesAgentId,
        salesAgentCommissionPercentage: row.salesAgentCommissionPercentage,
        festiveSeason: row.festiveSeason,
        referralSource: row.referralSource,
        notes: row.notes,
      },
    });
    const full = await this.prisma.advertSales.findUnique({
      where: { id: updated.id },
      include: advertSalesReadInclude,
    });
    return full ? modelToEntity(full) : modelToEntity(updated);
  }

  async deleteById(id: string): Promise<AdvertSalesEntity | null> {
    const row = await this.prisma.advertSales.delete({ where: { id } });
    return row ? modelToEntity(row) : null;
  }
}
