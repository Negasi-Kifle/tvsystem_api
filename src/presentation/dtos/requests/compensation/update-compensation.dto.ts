import { z } from 'zod';

export const updateCompensationDto = z
  .object({
    proposal: z.string().min(1).optional(),
    advertPlacementId: z.string().uuid().nullable().optional(),
    missedDate: z.union([z.coerce.date(), z.null()]).optional(),
    compensationType: z.string().nullable().optional(),
    compensationDetails: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .strict();

export type UpdateCompensationDto = z.infer<typeof updateCompensationDto>;
