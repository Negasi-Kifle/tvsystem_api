import { z } from 'zod';
import { AdvertSalesStatus } from '../../../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../../../domain/enums/advert-type.enum';

export const fetchAllAdvertSalesDto = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    adPackageId: z.uuid().optional(),
    customerId: z.uuid().optional(),
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
    referenceNumber: z.string().min(1).optional(),
    salesRepId: z.uuid().optional(),
    salesAgentId: z.uuid().optional(),
    categoryId: z.uuid().optional(),
    subCategoryId: z.uuid().optional(),
    installmentCount: z.coerce.number().int().min(1).optional(),
  })
  .strict();

export type FetchAllAdvertSalesDto = z.infer<typeof fetchAllAdvertSalesDto>;
