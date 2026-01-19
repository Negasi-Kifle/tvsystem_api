import { model, Schema } from 'mongoose';
import { Compensation } from '../../../domain/entities/compensation.entity';
import { withTenant } from './base.model';

const compensationSchema = withTenant(
  new Schema<Compensation>(
    {
      advertId: { type: String, required: true },
      proposal: { type: String, required: true },
      status: { type: String, required: true },
      customerResponse: { type: String }
    },
    { timestamps: true }
  )
);

export const CompensationModel = model<Compensation>('Compensation', compensationSchema);
