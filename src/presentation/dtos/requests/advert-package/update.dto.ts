import { z } from 'zod';

export const updateAdvertPackageDto = z
  .object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    nameSlug: z.string().min(1, "Name slug cannot be empty").optional(),
    mediaPackId: z.uuid("Invalid media pack id (must be a valid UUID)").optional(),
    showIds: z.array(z.uuid("Invalid show id detected (must be a valid UUID)"), { message: "Please provide at least one show id" }).min(1, "Show ids cannot be empty").optional(),
    advertisementsCount: z.coerce.number().int().min(1, "Advertisements count must be a positive number").optional(),
    announcementsCount: z.coerce.number().int().min(0, "Announcements count must be a positive number").optional(),
    popUpsCount: z.coerce.number().int().min(0, "Pop ups count must be a positive number").optional(),
    bonusesCount: z.coerce.number().int().min(0, "Bonuses count must be a positive number").optional(),
    priceBeforeVAT: z.coerce.number().min(0, "Price before VAT must be a positive number").optional(),
    otherTaxes: z.coerce.number().min(0, "Other taxes must be a positive number").optional(),
    isActive: z.boolean().optional(),
    advertisementsRerunCount: z.coerce.number().int().min(0, "Advertisements rerun count must be a positive number").optional(),
    announcementsRerunCount: z.coerce.number().int().min(0, "Announcements rerun count must be a positive number").optional(),
    popUpsRerunCount: z.coerce.number().int().min(0, "Pop ups rerun count must be a positive number").optional(),
    bonusesRerunCount: z.coerce.number().int().min(0, "Bonuses rerun count must be a positive number").optional(),
    description: z.string().optional().nullable(),
  })
  .strict();

export type UpdateAdvertPackageDto = z.infer<typeof updateAdvertPackageDto>;
