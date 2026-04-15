import { z } from 'zod';
import { CustomerStatusWithUs } from '../../../../domain/enums/customer-status.enum';

export const updateMediaMonitoringRecordDto = z
  .object({
    channel: z.enum(['EBS', 'FANA', 'Arts', 'Kana', 'Radio']).optional(),
    sponsorName: z.string().min(1).optional(),
    monitoringDate: z.coerce.date().optional(),
    showName: z.string().nullable().optional(),
    timeSlot: z.string().nullable().optional(),
    statusWithUs: z
      .enum(CustomerStatusWithUs, 'Status with Us must be one of the following: ' + Object.values(CustomerStatusWithUs).join(', '))
      .optional(),
    contactInfo: z.string().nullable().optional(),
    customerId: z.union([z.uuid('Customer ID must be a valid UUID.'), z.null()]).optional(),
  })
  .strict();

export type UpdateMediaMonitoringRecordDto = z.infer<typeof updateMediaMonitoringRecordDto>;
