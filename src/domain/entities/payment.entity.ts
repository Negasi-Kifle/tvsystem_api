import { ValidationError } from '../errors/validation.error';
import { PaymentStatus } from '../enums/payment-status.enum';
import { AdvertSalesEntity } from './advert-sales.entity';

export type RecordPaymentInput = {
  bankDeposit: number;
  paymentDate: Date;
  paymentMethod?: string;
  bankDepositDate?: Date;
  bankConfirmation?: string;
  fsNumber?: string;
};

export class PaymentEntity {
  constructor(
    public advertSalesId: string,
    public dueDate: Date,
    public status: PaymentStatus = PaymentStatus.Pending,
    public paymentRequestRef?: string | null,
    public installmentNumber: number = 1,
    public installmentLabel?: string | null,
    public amountBeforeVat: number = 0,
    public vatAmount: number = 0,
    public withholdTax: number = 0,
    public vatWithhold: number = 0,
    public totalAmount: number = 0,
    public bankDeposit: number = 0,
    public balance: number = 0,
    public paymentDate?: Date | null,
    public paymentMethod?: string | null,
    public bankDepositDate?: Date | null,
    public bankConfirmation?: string | null,
    public fsNumber?: string | null,
    public requestSentDate?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
    public advertSales?: AdvertSalesEntity,
  ) {}

  public static createInstance(
    advertSalesId: string,
    dueDate: Date,
    status: PaymentStatus = PaymentStatus.Pending,
    paymentRequestRef?: string | null,
    installmentNumber: number = 1,
    installmentLabel?: string | null,
    amountBeforeVat: number = 0,
    vatAmount: number = 0,
    withholdTax: number = 0,
    vatWithhold: number = 0,
    totalAmount: number = 0,
    bankDeposit: number = 0,
    balance: number = 0,
    paymentDate?: Date | null,
    paymentMethod?: string | null,
    bankDepositDate?: Date | null,
    bankConfirmation?: string | null,
    fsNumber?: string | null,
    requestSentDate?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
    advertSales?: AdvertSalesEntity,
  ): PaymentEntity {
    if (!advertSalesId?.trim()) {
      throw new ValidationError('Advert sales ID is required');
    }
    if (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime())) {
      throw new ValidationError('Due date is required');
    }
    if (!Number.isInteger(installmentNumber) || installmentNumber < 1) {
      throw new ValidationError('Installment number must be an integer of at least 1');
    }

    return new PaymentEntity(
      advertSalesId.trim(),
      dueDate,
      status,
      paymentRequestRef,
      installmentNumber,
      installmentLabel,
      amountBeforeVat,
      vatAmount,
      withholdTax,
      vatWithhold,
      totalAmount,
      bankDeposit,
      balance,
      paymentDate,
      paymentMethod,
      bankDepositDate,
      bankConfirmation,
      fsNumber,
      requestSentDate,
      createdAt,
      updatedAt,
      id,
      advertSales,
    );
  }

  public recordPaymentReceived(input: RecordPaymentInput): PaymentEntity {
    if (this.status === PaymentStatus.Paid) {
      throw new ValidationError('Cannot record payment: this installment is already fully paid');
    }

    if (!Number.isFinite(this.totalAmount) || this.totalAmount < 0) {
      throw new ValidationError('Payment total amount is invalid');
    }

    const deposit = input.bankDeposit;
    if (typeof deposit !== 'number' || !Number.isFinite(deposit) || deposit < 0) {
      throw new ValidationError('Bank deposit must be a non-negative finite number');
    }

    if (!(input.paymentDate instanceof Date) || Number.isNaN(input.paymentDate.getTime())) {
      throw new ValidationError('Valid payment date is required');
    }

    if (input.bankDepositDate != null) {
      if (!(input.bankDepositDate instanceof Date) || Number.isNaN(input.bankDepositDate.getTime())) {
        throw new ValidationError('Bank deposit date must be a valid date when provided');
      }
    }

    
    const totalRounded = Math.round(this.totalAmount * 100) / 100;
    const balanceRounded = Math.round((totalRounded - deposit) * 100) / 100;
    
    if (balanceRounded !== 0)
      throw new ValidationError(`Deposit cannot be greater or less than the total amount of the installment (${totalRounded})`);
    
    this.bankDeposit = deposit;
    this.balance = balanceRounded;
    this.paymentDate = input.paymentDate;
    this.paymentMethod = input.paymentMethod ?? null;
    this.bankDepositDate = input.bankDepositDate ?? null;
    this.bankConfirmation = input.bankConfirmation ?? null;
    this.fsNumber = input.fsNumber ?? null;
    this.status = balanceRounded <= 0 ? PaymentStatus.Paid : PaymentStatus.Pending;
    this.updatedAt = new Date();
    return this;
  }

  public markPaymentRequestSent(): PaymentEntity {
    this.requestSentDate = new Date();
    this.status = PaymentStatus.Sent;
    this.updatedAt = new Date();
    return this;
  }

  public markOverdue(): PaymentEntity {
    this.status = PaymentStatus.Overdue;
    this.updatedAt = new Date();
    return this;
  }
}
