import z from "zod";
import { createAdvertPackageDto } from "../advert-package/create.dto";


export const createMediaPackWithAdPackagesDto = z.object({
    version: z.string("Version is required").min(1, "Version cannot be empty"),
    versionSlug: z.string().min(1, "Version slug cannot be empty").optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    advertPackages: z.array(
        createAdvertPackageDto.omit({ mediaPackId: true }),
        { message: "Please provide at least one advert package" })
        .min(1, "Advert packages cannot be empty"),
});

export type CreateMediaPackWithAdPackagesDto = z.infer<typeof createMediaPackWithAdPackagesDto>;