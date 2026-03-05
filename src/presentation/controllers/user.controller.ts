import { Request, Response, NextFunction } from 'express';
import { CreateUserDto } from '../dtos/requests/user/create-user.dto';
import { UserRepository } from '../../infrastructure/prisma/repositories/user.repository';
import { PartnerRepository } from '../../infrastructure/prisma/repositories/partner.repository';
import { EmployeeRepository } from '../../infrastructure/prisma/repositories/employee.repository';
import { HashService } from '../../infrastructure/services/hash.service';
import { CountUsersUseCase } from '../../application/use-cases/users/count-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { UpdateUserStatusUseCase } from '../../application/use-cases/users/update-user-status.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.uase-case';
import { ResetPasswordUseCase } from '../../application/use-cases/users/reset-pswd.use-case';
import { GetByIdUseCase } from '../../application/use-cases/users/get-by-id.use-case';
import { UpdateUserDto } from '../dtos/requests/user/update-user.dto';
import { FetchAllUsersDto } from '../dtos/requests/user/fetch-all-users.dto';
import { mapFetchAllUsersDtoToQueryOptions } from '../mappers/users-to-query-options.mapper';
import { ResetPasswordDto } from '../dtos/requests/user/reset-paswd.dto';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { FetchAllUsersUseCase } from '../../application/use-cases/users/fetch-all.use-case';
import { UpdateUserStatusDto } from '../dtos/requests/user/update-status.dto';

const userRepository = new UserRepository();
const partnerRepository = new PartnerRepository();
const employeeRepository = new EmployeeRepository();
const hashService = new HashService();

const createUserUseCase = new CreateUserUseCase(userRepository, partnerRepository, employeeRepository);
const getByIdUseCase = new GetByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, hashService);
const countUsersUseCase = new CountUsersUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository, partnerRepository, employeeRepository);
const fetchAllUsersUseCase = new FetchAllUsersUseCase(userRepository);

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as CreateUserDto;
    const user = await createUserUseCase.execute(payload);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'User created successfully',
      data: { user }
    });
  } catch (error: any) {
     next(error);
  }
}


export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as UpdateUserDto;
    const id = req.params.id as string;

    const user = await updateUserUseCase.execute(id, payload);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error: any) {
    next(error);
  }
}

export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { isActive } = req.body as UpdateUserStatusDto;

    const user = await updateUserStatusUseCase.execute(id, isActive);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'User status updated successfully',
      data: { user }
    });
  } catch (error: any) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getByIdUseCase.execute(req.user!.id);

    res.status(200).json({
      status: 'SUCCESS',
      data: { user }
    });
  } catch (error: any) {
    return next(error);
  }
}


export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.body as ResetPasswordDto;
    const defaultPassword = process.env.DEFAULT_PASSWORD || '123456';

    await resetPasswordUseCase.execute(id, defaultPassword);

    res.status(202).json({
      status: 'SUCCESS',
      message: 'Password reset successfully. Please tell user to use the default password.'
    });
  } catch (error: any) {
    next(error);
  }
}


export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = res.locals.query as FetchAllUsersDto;
    const queryOptions = mapFetchAllUsersDtoToQueryOptions(dto);

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const [users, total] = await Promise.all([
      fetchAllUsersUseCase.execute(queryOptions),
      countUsersUseCase.execute(queryOptions),
    ]);

    res.status(200).json({
      status: 'SUCCESS',
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: { users },
    });
  } catch (error: any) {
    next(error);
  }
}


export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const user = await getByIdUseCase.execute(id);

    res.status(200).json({
      status: 'SUCCESS',
      data: { user }
    });
  } catch (error: any) {
    next(error);
  }
}


export async function deleteUser(req: Request, res: Response, next: NextFunction) {

  try {
    const { id } = req.params as { id: string };

    await deleteUserUseCase.execute(id);
    res.status(200).json({ status: 'SUCCESS', message: 'User deleted successfully' });
  } catch (error: any) {
    next(error);
  }
}

