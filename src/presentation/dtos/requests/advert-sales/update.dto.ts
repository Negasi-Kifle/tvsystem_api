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
    installmentCount: z.coerce.number().int().min(1).optional(),
    campaignName: z.string().min(1, "Campaign name must have at least 1 character").optional(),
    contractSignDate: z.coerce.date().optional(),
    salesRepId: z.uuid().nullable().optional(),
    salesRepCommissionPercentage: z.coerce.number().min(0).max(100).optional(),
    categoryId: z.uuid().nullable().optional(),
    subCategoryId: z.uuid().nullable().optional(),
    salesAgentId: z.uuid().nullable().optional(),
    salesAgentCommissionPercentage: z.coerce.number().min(0).max(100).optional(),
    festiveSeason: z.string().min(1, "Festive season must have at least 1 character").nullable().optional(),
    referralSource: z.string().min(1, "Referral source must have at least 1 character").nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

export type UpdateAdvertSalesDto = z.infer<typeof updateAdvertSalesDto>;
