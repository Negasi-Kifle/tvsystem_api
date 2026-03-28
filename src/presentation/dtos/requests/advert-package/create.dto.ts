import { z } from 'zod';

export const createAdvertPackageDto = z
  .object({
    name: z.string("Name is required").min(1, 'Name cannot be empty'),
    nameSlug: z.string().min(1, 'Name slug cannot be empty').optional(),
    showIds: z.array(z.uuid("Invalid show id detected (must be a valid UUID)"), { message: "Please provide at least one show id" }).min(1, "Show ids cannot be empty"),
    advertisementsCount: z.coerce.number("How many advertisements are included in the package?").int().min(1, "Advertisements count must be a positive number"),
    announcementsCount: z.coerce.number("How many announcements are included in the package?").int().min(0, "Announcements count must be a positive number"),
    popUpsCount: z.coerce.number("How many pop ups are included in the package?").int().min(0, "Pop ups count must be a positive number"),
    bonusesCount: z.coerce.number("How many bonuses are included in the package?").int().min(0, "Bonuses count must be a positive number"),
    priceBeforeVAT: z.coerce.number("What is the price before VAT?").min(0, "Price before VAT must be a positive number"),
    otherTaxes: z.coerce.number("What is the other taxes?").min(0, "Other taxes must be a positive number").max(100, "Other taxes must be less than or equal to 100%"),
    isActive: z.boolean().optional().default(true),
    mediaPackId: z.uuid("Invalid media pack id (must be a valid UUID)").optional(),
    advertisementsRerunCount: z.coerce.number().int().min(0).optional().default(0),
    announcementsRerunCount: z.coerce.number().int().min(0).optional().default(0),
    popUpsRerunCount: z.coerce.number().int().min(0).optional().default(0),
    bonusesRerunCount: z.coerce.number().int().min(0).optional().default(0),
    description: z.string().optional(),
  })
  .strict();

export type CreateAdvertPackageDto = z.infer<typeof createAdvertPackageDto>;
