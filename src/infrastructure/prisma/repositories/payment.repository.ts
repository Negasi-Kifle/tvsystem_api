import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { PrismaBaseRepository } from './base.repository';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { entityToModel, modelToEntity } from '../model_entity_mappers/payment';
import { buildWhereClauseForPayment } from '../where_clauses/payment';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

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
}
