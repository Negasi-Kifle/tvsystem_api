import { IAgentCommissionRepository } from '../../../domain/repositories/agent-commission.repository.interface';
import { AgentCommissionEntity, AgentCommissionStatus } from '../../../domain/entities/agent-commission.entity';
import { PrismaBaseRepository } from './base.repository';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { Prisma } from '../generated/client';

export class AgentCommissionRepository extends PrismaBaseRepository implements IAgentCommissionRepository {
  async create(data: Omit<AgentCommissionEntity, 'id'>): Promise<AgentCommissionEntity> {
    const saved = await this.prisma.agentCommission.create({
      data: {
        advertSalesId: data.advertSalesId,
        agentId: data.agentId,
        commissionPercentage: data.commissionPercentage,
        commissionAmount: data.commissionAmount,
        taxAmount: data.taxAmount,
        netAmount: data.netAmount,
        status: data.status,
        disbursedDate: data.disbursedDate ?? null,
      },
    });
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<AgentCommissionEntity | null> {
    const row = await this.prisma.agentCommission.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: QueryOptions<AgentCommissionEntity>): Promise<AgentCommissionEntity[]> {
    const where: Prisma.AgentCommissionWhereInput = {};
    const filters = query.filters as Partial<AgentCommissionEntity> | undefined;
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.agentId) where.agentId = filters.agentId;
    if (filters?.status) where.status = filters.status;

    const rows = await this.prisma.agentCommission.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(filters?: Partial<AgentCommissionEntity>): Promise<number> {
    const where: Prisma.AgentCommissionWhereInput = {};
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.status) where.status = filters.status;
    return this.prisma.agentCommission.count({ where });
  }

  async update(entity: AgentCommissionEntity): Promise<AgentCommissionEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.agentCommission.update({
      where: { id: entity.id },
      data: {
        status: entity.status,
        disbursedDate: entity.disbursedDate,
      },
    });
    return this.toEntity(updated);
  }

  async deleteById(id: string): Promise<AgentCommissionEntity | null> {
    const row = await this.prisma.agentCommission.delete({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: any): AgentCommissionEntity {
    return new AgentCommissionEntity(
      row.advertSalesId,
      row.agentId,
      row.commissionPercentage,
      row.commissionAmount,
      row.taxAmount,
      row.netAmount,
      row.status as AgentCommissionStatus,
      row.disbursedDate,
      row.createdAt,
      row.updatedAt,
      row.id,
    );
  }
}
