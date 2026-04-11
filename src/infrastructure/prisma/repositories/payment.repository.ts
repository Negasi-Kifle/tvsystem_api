import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';
import { PrismaBaseRepository } from './base.repository';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { Prisma } from '../generated/client';

export class PaymentRepository extends PrismaBaseRepository implements IPaymentRepository {
  async create(data: Omit<PaymentEntity, 'id'>): Promise<PaymentEntity> {
    const saved = await this.prisma.payment.create({
      data: {
        advertSalesId: data.advertSalesId,
        paymentRequestRef: data.paymentRequestRef ?? null,
        installmentNumber: data.installmentNumber,
        installmentLabel: data.installmentLabel ?? null,
        amountBeforeVat: data.amountBeforeVat,
        vatAmount: data.vatAmount,
        withholdTax: data.withholdTax,
        vatWithhold: data.vatWithhold,
        totalAmount: data.totalAmount,
        bankDeposit: data.bankDeposit,
        balance: data.balance,
        dueDate: data.dueDate,
        paymentDate: data.paymentDate ?? null,
        paymentMethod: data.paymentMethod ?? null,
        bankDepositDate: data.bankDepositDate ?? null,
        bankConfirmation: data.bankConfirmation ?? null,
        fsNumber: data.fsNumber ?? null,
        requestSentDate: data.requestSentDate ?? null,
        status: data.status,
      },
    });
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const row = await this.prisma.payment.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: QueryOptions<PaymentEntity>): Promise<PaymentEntity[]> {
    const where: Prisma.PaymentWhereInput = {};
    const filters = query.filters as Partial<PaymentEntity> | undefined;
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.status) where.status = filters.status;

    const rows = await this.prisma.payment.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { dueDate: 'asc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(filters?: Partial<PaymentEntity>): Promise<number> {
    const where: Prisma.PaymentWhereInput = {};
    if (filters?.advertSalesId) where.advertSalesId = filters.advertSalesId;
    if (filters?.status) where.status = filters.status;
    return this.prisma.payment.count({ where });
  }

  async update(entity: PaymentEntity): Promise<PaymentEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.payment.update({
      where: { id: entity.id },
      data: {
        status: entity.status,
        bankDeposit: entity.bankDeposit,
        balance: entity.balance,
        paymentDate: entity.paymentDate,
        paymentMethod: entity.paymentMethod,
        bankDepositDate: entity.bankDepositDate,
        bankConfirmation: entity.bankConfirmation,
        fsNumber: entity.fsNumber,
        requestSentDate: entity.requestSentDate,
      },
    });
    return this.toEntity(updated);
  }

  async deleteById(id: string): Promise<PaymentEntity | null> {
    const row = await this.prisma.payment.delete({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: any): PaymentEntity {
    return new PaymentEntity(
      row.advertSalesId,
      row.dueDate,
      row.status as PaymentStatus,
      row.paymentRequestRef,
      row.installmentNumber,
      row.installmentLabel,
      row.amountBeforeVat,
      row.vatAmount,
      row.withholdTax,
      row.vatWithhold,
      row.totalAmount,
      row.bankDeposit,
      row.balance,
      row.paymentDate,
      row.paymentMethod,
      row.bankDepositDate,
      row.bankConfirmation,
      row.fsNumber,
      row.requestSentDate,
      row.createdAt,
      row.updatedAt,
      row.id,
    );
  }
}
