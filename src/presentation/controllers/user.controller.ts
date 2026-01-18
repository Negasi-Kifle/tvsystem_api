import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/database/prisma/repositories/user.repository';
import { hashPassword } from '../../shared/utils/password';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { sendErrorResponse } from '../../shared/utils/error-handler';

const userRepo = new UserRepository();

export async function createUser(req: Request, res: Response) {
  const payload = req.body as CreateUserDto;
  const existing = await userRepo.findByEmail(payload.email);
  if (existing) {
    const error = new Error('User already exists');
    return sendErrorResponse(res, 409, 'User already exists', error);
  }

  const passwordHash = await hashPassword(payload.password);
  const user = await userRepo.create({
    email: payload.email,
    fullName: payload.fullName,
    passwordHash,
    roles: payload.roles,
    permissions: payload.permissions,
    isActive: payload.isActive,
    isFirstTimeAccount: payload.isFirstTimeAccount
  });

  res.status(201).json({ id: user.id, email: user.email });
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
    id: req.user.id,
    roles: req.user.roles,
    permissions: req.user.permissions,
    permissionsAvailable: Object.values(PERMISSIONS)
  });
}

export async function requestPasswordReset(req: Request, res: Response) {
  const { email } = req.body as { email: string };
  const user = await userRepo.findByEmail(email);
  if (!user) {
    return res.status(202).json({ message: 'If the account exists, reset email will be sent' });
  }

  // TODO: Implement password reset token generation and email delivery
  return res
    .status(202)
    .json({ message: 'If the account exists, reset email will be sent' });
}
