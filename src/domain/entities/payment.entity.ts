import { PaymentStatus } from '../enums/payment-status.enum';

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
  ) {}
}
