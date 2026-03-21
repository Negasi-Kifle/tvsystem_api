import { z } from 'zod';

export const addCommunicationLogDto = z
  .object({
    customerId: z.uuid("Customer ID must be a valid UUID."),
    logDate: z.coerce.date("Log date must be a valid date."),
    salesAgentId: z.uuid("Sales agent ID must be a valid UUID."),
    notes: z.string("Please add a note").min(1, 'Please add a note'),
    mediaPackId: z.uuid("Media pack ID must be a valid UUID.").optional(),
  })
  .strict();

export type AddCommunicationLogDto = z.infer<typeof addCommunicationLogDto>;
