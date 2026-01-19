// Legacy MongoDB base model helper
// Note: This file is kept for reference but multi-tenancy has been removed.
// The system is now single-tenant.

import { Schema } from 'mongoose';

/**
 * @deprecated Multi-tenancy has been removed. This helper is no longer needed.
 */
export const withTimestamps = <T>(schema: Schema<T>): Schema<T> => {
  schema.set('timestamps', true);
  return schema;
};
