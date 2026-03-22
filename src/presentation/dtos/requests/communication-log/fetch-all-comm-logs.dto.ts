import { z } from "zod";

export const fetchAllCommunicationLogsDto = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    customerId: z.string().optional(),
    mediaPackId: z.string().optional(),
    salesAgentId: z.string().optional(),
}).strict();


export type FetchAllCommunicationLogsDto = z.infer<typeof fetchAllCommunicationLogsDto>;