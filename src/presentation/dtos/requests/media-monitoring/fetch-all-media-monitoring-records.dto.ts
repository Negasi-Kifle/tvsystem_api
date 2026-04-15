import { z } from 'zod';

export const fetchAllMediaMonitoringRecordsDto = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    channel: z.enum(['EBS', 'FANA', 'Arts', 'Kana', 'Radio']).optional(),
    sponsorName: z.string().optional(),
    customerId: z.uuid('Customer ID must be a valid UUID.').optional(),
    unlinkedOnly: z.coerce.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.unlinkedOnly === true && data.customerId !== undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Do not set customerId when unlinkedOnly is true',
      path: ['customerId'],
    },
  );

export type FetchAllMediaMonitoringRecordsDto = z.infer<typeof fetchAllMediaMonitoringRecordsDto>;
