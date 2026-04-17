import { IRevenueShareRepository } from '../../../domain/repositories/revenue-share.repository.interface';
import { RevenueShareEntity, RevenueShareStatus } from '../../../domain/entities/revenue-share.entity';
import { PrismaBaseRepository } from './base.repository';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { Prisma } from '../generated/client';

export class RevenueShareRepository extends PrismaBaseRepository implements IRevenueShareRepository {
  async create(data: Omit<RevenueShareEntity, 'id'>): Promise<RevenueShareEntity> {
    const saved = await this.prisma.revenueShare.create({
      data: {
        advertSalesId: data.advertSalesId,
        userId: data.userId,
        showHostId: data.showHostId ?? null,
        sharePercentage: data.sharePercentage,
        shareAmount: data.shareAmount,
        status: data.status,
        disbursedDate: data.disbursedDate ?? null,
      },
    });
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<RevenueShareEntity | null> {
    const row = await this.prisma.revenueShare.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: QueryOptions<RevenueShareEntity>): Promise<RevenueShareEntity[]> {
    const where: Prisma.RevenueShareWhereInput = {};
    const filters = query.filters as Partial<RevenueShareEntity> | undefined;
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status) where.status = filters.status;

    const rows = await this.prisma.revenueShare.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(filters?: Partial<RevenueShareEntity>): Promise<number> {
    const where: Prisma.RevenueShareWhereInput = {};
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.status) where.status = filters.status;
    return this.prisma.revenueShare.count({ where });
  }

  async update(entity: RevenueShareEntity): Promise<RevenueShareEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.revenueShare.update({
      where: { id: entity.id },
      data: {
        status: entity.status,
        disbursedDate: entity.disbursedDate,
      },
    });
    return this.toEntity(updated);
  }

  async deleteById(id: string): Promise<RevenueShareEntity | null> {
    const row = await this.prisma.revenueShare.delete({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: any): RevenueShareEntity {
    return new RevenueShareEntity(
      row.advertSalesId,
      row.userId,
      row.sharePercentage,
      row.shareAmount,
      row.status as RevenueShareStatus,
      row.showHostId,
      row.disbursedDate,
      row.createdAt,
      row.updatedAt,
      row.id,
    );
  }
}
