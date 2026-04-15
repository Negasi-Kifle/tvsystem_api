import { z } from 'zod';
import { CustomerStatusWithUs } from '../../../../domain/enums/customer-status.enum';

export const createMediaMonitoringRecordDto = z
  .object({
    channel: z.enum(['EBS', 'FANA', 'Arts', 'Kana', 'Radio']),
    sponsorName: z.string().min(1, 'Sponsor name is required'),
    monitoringDate: z.coerce.date(),
    showName: z.string().optional(),
    timeSlot: z.string().optional(),
    statusWithUs: z.enum(CustomerStatusWithUs, "Status with Us must be one of the following: " + Object.values(CustomerStatusWithUs).join(', ')).optional(),
    contactInfo: z.string().optional(),
    customerId: z.uuid('Customer ID must be a valid UUID.').optional(),
  })
  .strict();

export type CreateMediaMonitoringRecordDto = z.infer<typeof createMediaMonitoringRecordDto>;
