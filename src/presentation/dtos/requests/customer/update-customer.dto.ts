import { z } from 'zod';
import { CustomerHolidayStatus, CustomerStatusWithUs, CustomerStudioVisit } from '../../../../domain/enums/customer-status.enum';

const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.string().optional(),
  mobile: z.string().optional(),
  officeTel: z.string().optional(),
});

export const updateCustomerDto = z
  .object({
    name: z.string().min(1).optional(),
    industry: z.string().optional(),
    categoryId: z.uuid("Category ID must be a valid UUID.").optional(),
    subCategoryId: z.uuid("Subcategory ID must be a valid UUID.").optional(),
    location: z.string().optional(),
    salesAgentId: z.uuid("Sales agent ID must be a valid UUID.").optional(),
    nextReviewDate: z.coerce.date().optional(),
    status: z.enum(CustomerStatusWithUs, "Status must be one of the following: " + Object.values(CustomerStatusWithUs).join(', ')).optional(),
    holidayStatus: z.enum(CustomerHolidayStatus, "Holiday status must be one of the following: " + Object.values(CustomerHolidayStatus).join(', ')).optional(),
    studioVisit: z.enum(CustomerStudioVisit, "Studio visit must be one of the following: " + Object.values(CustomerStudioVisit).join(', ')).optional(),
    otherMediaCampaign: z.string().optional(),
    inPersonUpdate: z.coerce.date().optional(),
    contacts: z.array(contactSchema).optional(),
  })
  .strict();

export type UpdateCustomerDto = z.infer<typeof updateCustomerDto>;
