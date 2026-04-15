import { z } from 'zod';
import { AdvertSalesStatus } from '../../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../../domain/enums/advert-type.enum';

export const createAdvertSalesDto = z
  .object({
    adPackageId: z.uuid('Ad package ID must be a valid UUID'),
    customerId: z.uuid('Customer ID must be a valid UUID'),
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
      .optional()
      .default(AdvertType.Paid),
    adStartDate: z.coerce.date(),
    adEndDate: z.coerce.date(),
    adLengthSeconds: z.coerce.number().int().nonnegative(),
    numOfSlots: z.coerce.number().int().nonnegative(),
    discountPercentage: z.coerce.number().min(0).max(100).optional().default(0),
    installmentCount: z.coerce.number().int().min(1).optional().default(1),
    campaignName: z.string().min(1),
    contractSignDate: z.coerce.date(),
    categoryId: z.uuid('Category ID must be a valid UUID').optional(),
    subCategoryId: z.uuid('Sub-category ID must be a valid UUID').optional(),
    salesAgentId: z.uuid('Sales agent ID must be a valid UUID').optional(),
    festiveSeason: z.string().min(1).optional(),
    referralSource: z.string().min(1).optional(),
    notes: z.string().optional(),
  })
  .strict();

export type CreateAdvertSalesDto = z.infer<typeof createAdvertSalesDto>;
