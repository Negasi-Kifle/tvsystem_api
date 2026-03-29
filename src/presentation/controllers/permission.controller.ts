import { CreatePermissionDto } from '../dtos/requests/permission/create-permission.dto';
import { NextFunction, Request, Response } from 'express';
import { FetchAllPermissionsDto } from '../dtos/requests/permission/fetch-all-permissions.dto';
import { UpdatePermissionDto } from '../dtos/requests/permission/update-permission.dto';
import { CreatePermissionUseCase } from '../../application/use-cases/permissions/create.use-case';
import { FetchAllPermissionsUseCase } from '../../application/use-cases/permissions/fetch-all.use-case';
import { CountPermissionsUseCase } from '../../application/use-cases/permissions/count.use-case';
import { FindPermissionByIdUseCase } from '../../application/use-cases/permissions/get-by-id.use-case';
import { UpdatePermissionUseCase } from '../../application/use-cases/permissions/update.use-case';
import { mapFetchAllPermissionsDtoToQueryOptions } from '../mappers/permission-to-query-options.mapper';
import { DeletePermissionUseCase } from '../../application/use-cases/permissions/delete.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createPermissionHandlers(deps: Pick<ApiRouterDeps, 'permissionRepository'>) {
  const { permissionRepository } = deps;
  const createPermissionUseCase = new CreatePermissionUseCase(permissionRepository);
  const fetchAllPermissionsUseCase = new FetchAllPermissionsUseCase(permissionRepository);
  const countPermissionsUseCase = new CountPermissionsUseCase(permissionRepository);
  const findPermissionByIdUseCase = new FindPermissionByIdUseCase(permissionRepository);
  const updatePermissionUseCase = new UpdatePermissionUseCase(permissionRepository);
  const deletePermissionUseCase = new DeletePermissionUseCase(permissionRepository);

  async function createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreatePermissionDto;
      const permission = await createPermissionUseCase.execute(payload);

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Permission created successfully',
        data: { permission },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getPermissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const permission = await findPermissionByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { permission },
      });
    } catch (error) {
      next(error);
    }
  }

  async function fetchAllPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllPermissionsDto;
      const queryOptions = mapFetchAllPermissionsDtoToQueryOptions(query);

      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [permissions, total] = await Promise.all([
        fetchAllPermissionsUseCase.execute(queryOptions),
        countPermissionsUseCase.execute(queryOptions),
      ]);

      res.json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { permissions },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updatePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdatePermissionDto;

      const permission = await updatePermissionUseCase.execute(id, payload);

      res.json({
        status: 'SUCCESS',
        message: 'Permission updated successfully',
        data: { permission },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deletePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deletePermissionUseCase.execute(id);

      res.json({
        status: 'SUCCESS',
        message: 'Permission deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    createPermission,
    getPermissionById,
    fetchAllPermissions,
    updatePermission,
    deletePermission,
  };
}
