import { model, Schema } from 'mongoose';
import { Advert } from '../../../domain/entities/advert.entity';
import { withTenant } from './base.model';

const advertSchema = withTenant(
  new Schema<Advert>(
    {
      showId: { type: String, required: true },
      customerId: { type: String, required: true },
      status: { type: String, required: true },
      slot: {
        start: Date,
        end: Date
      },
      contractDetails: { type: String }
    },
    { timestamps: true }
  )
);

export const AdvertModel = model<Advert>('Advert', advertSchema);
