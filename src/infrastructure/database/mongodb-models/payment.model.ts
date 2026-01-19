import { model, Schema } from 'mongoose';
import { Payment } from '../../../domain/entities/payment.entity';
import { withTenant } from './base.model';

const paymentSchema = withTenant(
  new Schema<Payment>(
    {
      advertId: { type: String, required: true },
      installmentLabel: { type: String },
      amount: {
        amount: Number,
        currency: String
      },
      dueDate: { type: Date, required: true },
      status: { type: String, required: true }
    },
    { timestamps: true }
  )
);

export const PaymentModel = model<Payment>('Payment', paymentSchema);
