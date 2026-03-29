import { CreateUserPermissionDto } from '../dtos/requests/user-permission/create-user-permission.dto';
import { NextFunction, Request, Response } from 'express';
import { FetchAllUserPermissionsDto } from '../dtos/requests/user-permission/fetch-all-user-permissions.dto';
import { CreateManyUserPermissionsUseCase } from '../../application/use-cases/user-permissions/create-many.use-case';
import { mapFetchAllUserPermissionsDtoToQueryOptions } from '../mappers/user-permission-to-query-options.mapper';
import { FetchAllUserPermissionsUseCase } from '../../application/use-cases/user-permissions/fetch-all.use-case';
import { CountUserPermissionsUseCase } from '../../application/use-cases/user-permissions/count.use-case';
import { FindUserPermissionByIdUseCase } from '../../application/use-cases/user-permissions/get-by-id.use-case';
import { RevokeUserPermissionUseCase } from '../../application/use-cases/user-permissions/revoke.usecase';
import type { ApiRouterDeps } from '../api-router-deps';

export function createUserPermissionHandlers(
  deps: Pick<
    ApiRouterDeps,
    'userPermissionsRepository' | 'userRepository' | 'permissionRepository'
  >,
) {
  const { userPermissionsRepository, userRepository, permissionRepository } = deps;

  const createManyUserPermissionsUseCase = new CreateManyUserPermissionsUseCase(
    userPermissionsRepository,
    userRepository,
    permissionRepository,
  );
  const fetchAllUserPermissionsUseCase = new FetchAllUserPermissionsUseCase(userPermissionsRepository);
  const countUserPermissionsUseCase = new CountUserPermissionsUseCase(userPermissionsRepository);
  const findUserPermissionByIdUseCase = new FindUserPermissionByIdUseCase(userPermissionsRepository);
  const revokeUserPermissionUseCase = new RevokeUserPermissionUseCase(userPermissionsRepository);

  async function createUserPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateUserPermissionDto;

      const userPermissions = await createManyUserPermissionsUseCase.execute({
        ...payload,
        grantedBy: req.user?.id!,
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'User permissions created successfully',
        data: { userPermissions },
      });
    } catch (error) {
      next(error);
    }
  }

  async function fetchAllUserPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllUserPermissionsDto;
      const queryOptions = mapFetchAllUserPermissionsDtoToQueryOptions(query);

      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [userPermissions, total] = await Promise.all([
        fetchAllUserPermissionsUseCase.execute(queryOptions),
        countUserPermissionsUseCase.execute(queryOptions),
      ]);

      res.json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { userPermissions },
      });
    } catch (error) {
      next(error);
    }
  }

  async function findUserPermissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const userPermission = await findUserPermissionByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { userPermission },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteUserPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const userPermission = await revokeUserPermissionUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'User permission revoked successfully',
        data: { userPermission },
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    createUserPermission,
    fetchAllUserPermissions,
    findUserPermissionById,
    deleteUserPermission,
  };
}
