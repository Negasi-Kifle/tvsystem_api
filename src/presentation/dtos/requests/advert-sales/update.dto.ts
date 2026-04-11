import { z } from 'zod';
import { AdvertSalesStatus } from '../../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../../domain/enums/advert-type.enum';

export const updateAdvertSalesDto = z
  .object({
    adPackageId: z.uuid('Ad package ID must be a valid UUID').optional(),
    customerId: z.uuid('Customer ID must be a valid UUID').optional(),
    status: z
      .enum(
        AdvertSalesStatus,
        `Status must be one of: ${Object.values(AdvertSalesStatus).join(', ')}`,
      )
      .optional(),
    advertType: z
      .enum(
        AdvertType,
        `Advert type must be one of: ${Object.values(AdvertType).join(', ')}`,
      )
      .optional(),
    adStartDate: z.coerce.date().optional(),
    adEndDate: z.coerce.date().optional(),
    adLengthSeconds: z.coerce.number().int().nonnegative().optional(),
    numOfSlots: z.coerce.number().int().nonnegative().optional(),
    adPackagePrice: z.coerce.number().nonnegative().optional(),
    discountPercentage: z.coerce.number().min(0).max(100).optional(),
    finalPrice: z.coerce.number().nonnegative().optional(),
    campaignName: z.string().min(1).optional(),
    contractSignDate: z.coerce.date().optional(),
    salesAgentId: z.uuid('Sales agent ID must be a valid UUID').nullable().optional(),
    agentCommissionPercentage: z.coerce.number().min(0).max(100).optional(),
    industry: z.string().min(1).nullable().optional(),
    festiveSeason: z.string().min(1).nullable().optional(),
    referralSource: z.string().min(1).nullable().optional(),
    advertAgency: z.string().min(1).nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

export type UpdateAdvertSalesDto = z.infer<typeof updateAdvertSalesDto>;
