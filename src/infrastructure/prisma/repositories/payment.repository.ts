import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { PrismaBaseRepository } from './base.repository';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { entityToModel, modelToEntity } from '../model_entity_mappers/payment';
import { buildWhereClauseForPayment } from '../where_clauses/payment';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import type { MonthlyRevenueItem } from '../../../domain/interfaces/analytics.interface';
import { Prisma } from '../generated/client';

export class PaymentRepository extends PrismaBaseRepository implements IPaymentRepository {
  async create(payload: Omit<PaymentEntity, 'id'>): Promise<PaymentEntity> {
    const paymentModel = entityToModel(payload as PaymentEntity);
    const { id: _omit, ...createData } = paymentModel;
    const saved = await this.prisma.payment.create({ data: createData });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const row = await this.prisma.payment.findUnique({ where: { id }, include: { advertSales: { include: { customer: true } } }, });
    return row ? modelToEntity(row) : null;
  }

  async findMany(query: QueryOptions<PaymentEntity>): Promise<PaymentEntity[]> {
    const where = buildWhereClauseForPayment(query.filters ?? {});
    const rows = await this.prisma.payment.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { advertSales: { include: { customer: true } } },
    });
    return rows.map(modelToEntity);
  }

  async count(filters?: Partial<PaymentEntity>): Promise<number> {
    const where = buildWhereClauseForPayment(filters ?? {});
    return this.prisma.payment.count({ where });
  }

  async update(entity: PaymentEntity): Promise<PaymentEntity | null> {
    if (!entity.id) return null;
    const where = { id: entity.id };
    const data = entityToModel(entity);
    const updated = await this.prisma.payment.update({ where, data });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<PaymentEntity | null> {
    const existing = await this.prisma.payment.findUnique({ where: { id } });
    if (!existing) return null;

    const row = await this.prisma.payment.delete({ where: { id } });
    return modelToEntity(row);
  }

  async sumPaidRevenue(from: Date, to: Date): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      _sum: { bankDeposit: true },
      where: {
        status: 'Paid',
        paymentDate: { gte: from, lte: to },
      },
    });
    return result._sum.bankDeposit ?? 0;
  }

  async getMonthlyRevenueSummary(year: number): Promise<MonthlyRevenueItem[]> {
    type RevenueRow = { month: number; revenue: number };
    type TargetRow = { month: number; target: number };

    const revenueRows = await this.prisma.$queryRaw<RevenueRow[]>(
      Prisma.sql`
        SELECT
          EXTRACT(MONTH FROM payment_date)::int AS month,
          COALESCE(SUM(bank_deposit), 0)::float AS revenue
        FROM payments
        WHERE status = 'Paid'
          AND EXTRACT(YEAR FROM payment_date) = ${year}
        GROUP BY EXTRACT(MONTH FROM payment_date)
      `,
    );

    const targetRows = await this.prisma.$queryRaw<TargetRow[]>(
      Prisma.sql`
        SELECT
          EXTRACT(MONTH FROM contract_sign_date)::int AS month,
          COALESCE(SUM(final_price), 0)::float       AS target
        FROM advert_sales
        WHERE EXTRACT(YEAR FROM contract_sign_date) = ${year}
        GROUP BY EXTRACT(MONTH FROM contract_sign_date)
      `,
    );

    const revenueMap = new Map(revenueRows.map((r) => [r.month, r.revenue]));
    const targetMap = new Map(targetRows.map((r) => [r.month, r.target]));

    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return {
        month,
        revenue: revenueMap.get(month) ?? 0,
        target: targetMap.get(month) ?? 0,
      };
    });
  }
}
