import { z } from 'zod';
import { CustomerHolidayStatus, CustomerStatusWithUs, CustomerStudioVisit } from '../../../../domain/enums/customer-status.enum';

const contactSchema = z.object({
  name: z.string().optional(),
  email: z.email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.string().optional(),
  mobile: z.string().optional(),
  officeTel: z.string().optional(),
});

export const createCustomerDto = z
  .object({
    name: z.string().min(1, 'Customer name is required'),
    contacts: z.array(contactSchema).optional().default([]),
    categoryId: z.uuid("Category ID must be a valid UUID.").optional(),
    subCategoryId: z.uuid("Subcategory ID must be a valid UUID.").optional(),
    location: z.string().optional(),
    salesAgentId: z.uuid("Sales agent ID must be a valid UUID.").optional(),
    nextReviewDate: z.coerce.date().optional(),
    status: z.enum(CustomerStatusWithUs, "Status must be one of the following: " + Object.values(CustomerStatusWithUs).join(', ')).optional(),
    holidayStatus: z.enum(CustomerHolidayStatus, "Holiday status must be one of the following: " + Object.values(CustomerHolidayStatus).join(', ')).optional(),
    studioVisit: z.enum(CustomerStudioVisit, "Studio visit must be one of the following: " + Object.values(CustomerStudioVisit).join(', ')).optional(),
    otherMediaCampaign: z.string().optional(),
    sourceFromMediaMonitoring: z.boolean().optional().default(false),
    mediaMonitoringId: z.uuid("Media monitoring ID must be a valid UUID.").optional(),
    inPersonUpdate: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) => {
      // If sourceFromMediaMonitoring is true, mediaMonitoringId must exist
      if (data.sourceFromMediaMonitoring) {
        return !!data.mediaMonitoringId;
      }
      // If sourceFromMediaMonitoring is false, mediaMonitoringId must NOT exist
      return data.mediaMonitoringId === undefined;
    },
    {
      message: "Media monitoring ID is required when source from media monitoring is true, and must be omitted when false",
      path: ["mediaMonitoringId"],
    }
);
  

export type CreateCustomerDto = z.infer<typeof createCustomerDto>;
