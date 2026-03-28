import { AdvertPackageEntity } from "../entities/advert-package.entity";

// Allows id to be a single string or array for id IN (...) queries
export type AdvertPackageFilters = Partial<AdvertPackageEntity> & { id?: string | string[] };

