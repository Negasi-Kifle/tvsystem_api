import { Request, Response } from 'express';
import { UserRepository, UserFilter } from '../../infrastructure/database/prisma/repositories/user.repository';
import { hashPassword } from '../../shared/utils/password';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { ResetPasswordDto } from '../dtos/requests/reset-paswd.dto';
import { FetchAllUsersDto } from '../dtos/requests/fetch-all-users.dto';

const userRepo = new UserRepository();

export async function createUser(req: Request, res: Response) {
  const payload = req.body as CreateUserDto;
  const [userByEmail, userByPhoneNumber] = await Promise.all([
    userRepo.findByEmailOrPhoneNumber(payload.email),
    userRepo.findByEmailOrPhoneNumber(payload.phoneNumber)
  ]);
  if (userByEmail || userByPhoneNumber) {
    const errorMessage = userByEmail ? 'Email already taken' : 'Phone number already taken';
    const error = new Error(errorMessage);
    return sendErrorResponse(res, 409, errorMessage, error);
  }

  const passwordHash = await hashPassword(process.env.DEFAULT_PASSWORD || '123456');
  const user = await userRepo.create({
    email: payload.email,
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    sex: payload.sex,
    passwordHash,
    roles: payload.roles,
    permissions: payload.permissions,
    isActive: payload.isActive,
    isFirstTimeAccount: payload.isFirstTimeAccount
  });

  res.status(201).json({
    status: 'SUCCESS',
    message: 'User created successfully',
    data: { user }
  });
}

export async function setUserActive(req: Request, res: Response) {
  const { isActive } = req.body as { isActive: boolean };
  const id = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  if (!id) {
    const error = new Error('User ID is required');
    return sendErrorResponse(res, 400, 'User ID is required', error);
  }
  const updated = await userRepo.updateById(id, { isActive });
  if (!updated) {
    const error = new Error('User not found');
    return sendErrorResponse(res, 404, 'User not found', error);
  }
  res.json({ id: updated.id, isActive: updated.isActive });
}

export function me(req: Request, res: Response) {
  if (!req.user) {
    const error = new Error('Unauthenticated');
    return sendErrorResponse(res, 401, 'Unauthenticated', error);
  }
  res.json({
    status: 'SUCCESS',
    data: { user: req.user }
  });
}

export async function resetPassword(req: Request, res: Response) {
  const { id } = req.body as ResetPasswordDto;
  const user = await userRepo.findById(id as string);
  if (!user) {
    const error = new Error('User not found');
    return sendErrorResponse(res, 404, 'User not found', error);
  }

  if (user.isFirstTimeAccount) {
    const error = new Error('User is first time account');
    return sendErrorResponse(res, 400, 'User is first time account', error);
  }

  // Set user password to the default password
  const passwordHash = await hashPassword(process.env.DEFAULT_PASSWORD || '123456');
  await userRepo.updateById(id as string, { passwordHash });

  res.status(202).json({
    status: 'SUCCESS',
    message: 'Password reset successfully. Please tell user to use the default password.'
  });
}

export async function getAllUsers(req: Request, res: Response) {
  const query = res.locals.query as FetchAllUsersDto;
  
  // Build filters from query params
  const filters: UserFilter = {
    ...(query.email && { email: query.email }),
    ...(query.phoneNumber && { phoneNumber: query.phoneNumber }),
    ...(query.roles && { roles: query.roles }),
    ...(query.isActive !== undefined && { isActive: query.isActive }),
    ...(query.sex && { sex: query.sex })
  };

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  // Fetch users and total count in parallel
  const [users, total] = await Promise.all([
    userRepo.findMany({
      skip: (page - 1) * limit,
      take: limit,
      filters
    }),
    userRepo.count(filters)
  ]);

  res.status(200).json({
    status: 'SUCCESS',
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: {
      users,
    }
  });
}