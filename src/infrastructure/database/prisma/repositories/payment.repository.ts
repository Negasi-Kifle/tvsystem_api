import { Prisma, Payment } from '@prisma/client';
import { Payment as DomainPayment } from '../../../../domain/entities/payment.entity';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { Money } from '../../../../domain/value-objects/money.value-object';
import { PrismaBaseRepository } from './base.repository';

type MoneyJson = { amount: number; currency: string };

export class PaymentRepository extends PrismaBaseRepository {
  /**
   * Map Prisma Payment to Domain Payment
   */
  private toDomain(payment: Payment): DomainPayment {
    const amount = payment.amount as MoneyJson;
    return {
      id: payment.id,
      advertId: payment.advertId,
      installmentLabel: payment.installmentLabel ?? undefined,
      amount: new Money(amount.amount, amount.currency),
      dueDate: payment.dueDate,
      status: payment.status as PaymentStatus,
      createdAt: payment.createdAt
    };
  }

  /**
   * Create a new payment with Pending status
   */
  async createPayment(
    data: Omit<DomainPayment, 'id' | 'status'>
  ): Promise<DomainPayment> {
    const payment = await this.prisma.payment.create({
      data: {
        advertId: data.advertId,
        installmentLabel: data.installmentLabel,
        amount: {
          amount: data.amount.amount,
          currency: data.amount.currency
        } as Prisma.InputJsonValue,
        dueDate: data.dueDate,
        status: PaymentStatus.Pending
      }
    });
    return this.toDomain(payment);
  }

  /**
   * Find payment by ID
   */
  async findById(id: string): Promise<DomainPayment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id }
    });
    return payment ? this.toDomain(payment) : null;
  }

  /**
   * Find payments by advert ID
   */
  async findByAdvertId(advertId: string): Promise<DomainPayment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { advertId },
      orderBy: { dueDate: 'asc' }
    });
    return payments.map((payment) => this.toDomain(payment));
  }

  /**
   * Find payments by status
   */
  async findByStatus(status: PaymentStatus): Promise<DomainPayment[]> {
    const payments = await this.prisma.payment.findMany({
      where: { status },
      orderBy: { dueDate: 'asc' }
    });
    return payments.map((payment) => this.toDomain(payment));
  }

  /**
   * Update payment status
   */
  async updateStatus(
    id: string,
    status: PaymentStatus
  ): Promise<DomainPayment | null> {
    const existing = await this.prisma.payment.findUnique({
      where: { id }
    });

    if (!existing) {
      return null;
    }

    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status }
    });

    return this.toDomain(payment);
  }

  /**
   * Find overdue payments
   */
  async findOverdue(): Promise<DomainPayment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: { in: [PaymentStatus.Pending, PaymentStatus.Sent] },
        dueDate: { lt: new Date() }
      },
      orderBy: { dueDate: 'asc' }
    });
    return payments.map((payment) => this.toDomain(payment));
  }
}
