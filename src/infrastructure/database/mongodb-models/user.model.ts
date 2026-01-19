import { model, Schema } from 'mongoose';
import { User } from '../../../domain/entities/user.entity';
import { withTenant } from './base.model';

const userSchema = withTenant(
  new Schema<User>(
    {
      email: { type: String, required: true, index: true },
      passwordHash: { type: String, required: true },
      fullName: { type: String, required: true },
      roles: { type: [String], required: true },
      permissions: { type: [String], default: [] },
      isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
  )
);

export const UserModel = model<User>('User', userSchema);
