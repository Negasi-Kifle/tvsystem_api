import { ICompensationRepository } from '../../../domain/repositories/compensation.repository.interface';
import { CompensationEntity, CompensationStatus } from '../../../domain/entities/compensation.entity';
import { PrismaBaseRepository } from './base.repository';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { Prisma } from '../generated/client';

export class CompensationRepository extends PrismaBaseRepository implements ICompensationRepository {
  async create(data: Omit<CompensationEntity, 'id'>): Promise<CompensationEntity> {
    const saved = await this.prisma.compensation.create({
      data: {
        advertSalesId: data.advertSalesId,
        advertPlacementId: data.advertPlacementId ?? null,
        proposal: data.proposal,
        missedDate: data.missedDate ?? null,
        compensationType: data.compensationType ?? null,
        compensationDetails: (data.compensationDetails as Prisma.InputJsonValue) ?? undefined,
        proposedById: data.proposedById ?? null,
        status: data.status,
        customerResponse: data.customerResponse ?? null,
        respondedAt: data.respondedAt ?? null,
        customerResponseTokenHash: data.customerResponseTokenHash ?? null,
        customerResponseTokenExpiresAt: data.customerResponseTokenExpiresAt ?? null,
      },
    });
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<CompensationEntity | null> {
    const row = await this.prisma.compensation.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByCustomerResponseTokenHash(tokenHash: string): Promise<CompensationEntity | null> {
    const row = await this.prisma.compensation.findUnique({
      where: { customerResponseTokenHash: tokenHash },
    });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: QueryOptions<CompensationEntity>): Promise<CompensationEntity[]> {
    const where: Prisma.CompensationWhereInput = {};
    const filters = query.filters as Partial<CompensationEntity> | undefined;
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.status) where.status = filters.status;

    const rows = await this.prisma.compensation.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(filters?: Partial<CompensationEntity>): Promise<number> {
    const where: Prisma.CompensationWhereInput = {};
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.status) where.status = filters.status;
    return this.prisma.compensation.count({ where });
  }

  async update(entity: CompensationEntity): Promise<CompensationEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.compensation.update({
      where: { id: entity.id },
      data: {
        status: entity.status,
        customerResponse: entity.customerResponse,
        respondedAt: entity.respondedAt,
        customerResponseTokenHash: entity.customerResponseTokenHash ?? null,
        customerResponseTokenExpiresAt: entity.customerResponseTokenExpiresAt ?? null,
      },
    });
    return this.toEntity(updated);
  }

  async deleteById(id: string): Promise<CompensationEntity | null> {
    const row = await this.prisma.compensation.delete({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: any): CompensationEntity {
    return new CompensationEntity(
      row.advertSalesId,
      row.proposal,
      row.status as CompensationStatus,
      row.advertPlacementId,
      row.missedDate,
      row.compensationType,
      row.compensationDetails as Record<string, unknown> | null,
      row.proposedById,
      row.customerResponse,
      row.respondedAt,
      row.customerResponseTokenHash,
      row.customerResponseTokenExpiresAt,
      row.createdAt,
      row.updatedAt,
      row.id,
    );
  }
}
