import { z } from 'zod';
import { UserRole } from '../../../domain/enums/user-role.enum';

export const createUserDto = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  password: z.string().min(6),
  roles: z.nativeEnum(UserRole).array().nonempty(),
  permissions: z.string().array().default([]),
  isActive: z.boolean().default(true)
});

export type CreateUserDto = z.infer<typeof createUserDto>;
