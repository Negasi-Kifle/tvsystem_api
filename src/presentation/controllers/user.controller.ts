import { Request, Response } from 'express';
import { hashPassword } from '../../shared/utils/password';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { ResetPasswordDto } from '../dtos/requests/reset-paswd.dto';
import { FetchAllUsersDto } from '../dtos/requests/fetch-all-users.dto';
import { UsersUseCases } from '../../application/use-cases/users';

const usersUseCases = new UsersUseCases();

export async function createUser(req: Request, res: Response) {
  const payload = req.body as CreateUserDto;
  const [userByEmail, userByPhoneNumber] = await Promise.all([
    usersUseCases.getByEmailOrPhoneUseCase.execute(payload.email),
    usersUseCases.getByEmailOrPhoneUseCase.execute(payload.phoneNumber)
  ]);

  // Check if user already exists with given email or phone number
  if (userByEmail || userByPhoneNumber) {
    const errorMessage = userByEmail ? 'Email already taken' : 'Phone number already taken';
    const error = new Error(errorMessage);
    return sendErrorResponse(res, 409, errorMessage, error);
  }

  const passwordHash = await hashPassword(process.env.DEFAULT_PASSWORD || '123456');
  // Add passwordHash to the payload
  const payloadWithPasswordHash = {
    ...payload,
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const user = await usersUseCases.createUserUseCase.execute(payloadWithPasswordHash);

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

  // First time user cannot be deactivated
  if (isActive === false) {
    const user = await usersUseCases.getByIdUseCase.execute(id);
    if (!user) {
      const error = new Error('User not found');
      return sendErrorResponse(res, 404, 'User not found', error);
    }

    if (user.isFirstTimeAccount === true) {
      const error = new Error('First time account cannot be deactivated');
      return sendErrorResponse(res, 400, 'First time account cannot be deactivated', error);
    }
  }

  const updatedUser = await usersUseCases.updateUserUseCase.execute(id, { isActive });

  const statusToVerb = isActive ? 'activated' : 'deactivated';
  res.json({
    status: 'SUCCESS',
    message: `User ${statusToVerb} successfully`,
    data: { user: updatedUser }
  });
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
  const user = await usersUseCases.getByIdUseCase.execute(id as string);

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
  await usersUseCases.updateUserUseCase.execute(id as string, { passwordHash });

  res.status(202).json({
    status: 'SUCCESS',
    message: 'Password reset successfully. Please tell user to use the default password.'
  });
}


export async function getAllUsers(req: Request, res: Response) {
  const query = res.locals.query as FetchAllUsersDto;

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  // Fetch users and total count in parallel
  const [users, total] = await Promise.all([
    usersUseCases.fetchAllUsersUseCase.execute(query),
    usersUseCases.countUsersUseCase.execute(query)
  ]);

  res.status(200).json({
    status: 'SUCCESS',
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: { users }
  });
}


export async function getUserById(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const user = await usersUseCases.getByIdUseCase.execute(id);
  if (!user) {
    const error = new Error('User not found');
    return sendErrorResponse(res, 404, 'User not found', error);
  }


  res.json({
    status: 'SUCCESS',
    data: { user }
  });
}


export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const user = await usersUseCases.getByIdUseCase.execute(id)
  if (!user) {
    const error = new Error('User not found');
    return sendErrorResponse(res, 404, 'User not found', error);
  }

  // First time account could not be deleted
  if (user.isFirstTimeAccount)
    return sendErrorResponse(res, 400, 'First time account could not be deleted', new Error('First time account could not be deleted'));

  await usersUseCases.deleteUserUseCase.execute(id);


  res.json({ status: 'SUCCESS', message: 'User deleted successfully' });
}

