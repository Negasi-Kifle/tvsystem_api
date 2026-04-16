import { z } from 'zod';

export const proposeCompensationDto = z
  .object({
    advertPlacementId: z.uuid("Advert placement ID is required"),
    proposal: z.string().min(1, "Proposal is required"),
    compensationType: z.string().optional(),
    compensationDetails: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type ProposeCompensationDto = z.infer<typeof proposeCompensationDto>;
