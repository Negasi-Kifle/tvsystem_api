import { Prisma } from '../generated/client';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { AdvertSalesEntity } from '../../../domain/entities/advert-sales.entity';
import { PrismaBaseRepository } from './base.repository';
import { advertSalesReadInclude, entityToModel, modelToEntity } from '../model_entity_mappers/advert-sales';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForAdvertSales } from '../where_clauses/advert-sales';
import { AdvertSalesStatus } from '../../../domain/enums/advert-sales.enum';
import type { TopShowEntry } from '../../../domain/interfaces/analytics.interface';

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
        campaignEndAlertSentAt: row.campaignEndAlertSentAt,
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

  async findCampaignsNeedingEndAlert(now: Date, windowEnd: Date): Promise<AdvertSalesEntity[]> {
    const terminal: AdvertSalesStatus[] = [AdvertSalesStatus.Cancelled, AdvertSalesStatus.Delivered];
    const rows = await this.prisma.advertSales.findMany({
      where: {
        campaignEndAlertSentAt: null,
        adEndDate: { gte: now, lte: windowEnd },
        status: { notIn: terminal },
      },
      include: advertSalesReadInclude,
      orderBy: { adEndDate: 'asc' },
    });
    return rows.map(modelToEntity);
  }

  async getTopShowsByRevenue(limit: number): Promise<TopShowEntry[]> {
    type RawRow = {
      showId: string;
      title: string;
      type: string;
      revenue: number;
      target: number;
      activeAdsCount: number;
    };

    const rows = await this.prisma.$queryRaw<RawRow[]>(
      Prisma.sql`
        SELECT
          ap.show_id                                                                          AS "showId",
          s.title,
          s.type,
          COALESCE(SUM(CASE WHEN p.status = 'Paid' THEN p.bank_deposit ELSE 0 END), 0)::float AS revenue,
          COALESCE(SUM(DISTINCT ads.final_price), 0)::float                                   AS target,
          COUNT(DISTINCT CASE WHEN ap.status = 'SCHEDULED' THEN ap.id END)::int               AS "activeAdsCount"
        FROM advert_placements ap
        JOIN advert_sales ads ON ads.id = ap.advert_sales_id
        JOIN shows s ON s.id = ap.show_id
        LEFT JOIN payments p ON p.advert_sales_id = ads.id
        GROUP BY ap.show_id, s.title, s.type
        ORDER BY revenue DESC
        LIMIT ${limit}
      `,
    );

    return rows.map((r) => ({
      showId: r.showId,
      title: r.title,
      type: r.type,
      revenue: Number(r.revenue),
      target: Number(r.target),
      activeAdsCount: Number(r.activeAdsCount),
    }));
  }
}
