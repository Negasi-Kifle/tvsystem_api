import { z } from 'zod';

export const createMediaMonitoringRecordDto = z
  .object({
    channel: z.enum(['EBS', 'FANA', 'Arts', 'Kana', 'Radio']),
    sponsorName: z.string().min(1, 'Sponsor name is required'),
    monitoringDate: z.coerce.date(),
    showName: z.string().optional(),
    timeSlot: z.string().optional(),
    statusWithAbbay: z.string().optional(),
    contactInfo: z.string().optional(),
    programName: z.string().optional(),
  })
  .strict();

export type CreateMediaMonitoringRecordDto = z.infer<typeof createMediaMonitoringRecordDto>;
