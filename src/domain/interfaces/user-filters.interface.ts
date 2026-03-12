import { UserEntity } from "../entities/user.entity";

// Allows id to be a single string or array for id IN (...) queries
export type UserFilters = Partial<UserEntity> & { id?: string | string[] };

