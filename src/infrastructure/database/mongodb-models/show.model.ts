import { model, Schema } from 'mongoose';
import { Show } from '../../../domain/entities/show.entity';
import { withTenant } from './base.model';

const showSchema = withTenant(
  new Schema<Show>(
    {
      title: { type: String, required: true },
      type: { type: String, required: true },
      durationMinutes: { type: Number, required: true },
      maxAdLengthSeconds: { type: Number, required: true },
      schedule: [{ day: String, startTime: String, endTime: String }],
      assignedStaff: { type: String }
    },
    { timestamps: true }
  )
);

export const ShowModel = model<Show>('Show', showSchema);
