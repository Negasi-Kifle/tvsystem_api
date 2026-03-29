import { Router } from 'express';
import { createShowHostHandlers } from '../controllers/show-host.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createShowHostDto } from '../dtos/requests/show-host/create-show-host.dto';
import { updateShowHostDto } from '../dtos/requests/show-host/update-show-host.dto';
import { fetchAllShowHostsDto } from '../dtos/requests/show-host/fetch-all-show-hosts.dto';
import { assignManyHostsToShowDto } from '../dtos/requests/show-host/assign-many-hosts.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createShowHostsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createShowHost,
    deleteShowHost,
    getShowHostById,
    listShowHosts,
    updateShowHost,
    assignManyHostsToShow,
  } = createShowHostHandlers(deps);

  router
    .route('/')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_SHOWS),
      validateQuery(fetchAllShowHostsDto),
      listShowHosts,
    )
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SHOWS),
      validateBody(createShowHostDto),
      createShowHost,
    );

  router.post(
    '/assign-many',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SHOWS),
    validateBody(assignManyHostsToShowDto),
    assignManyHostsToShow,
  );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SHOWS), getShowHostById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SHOWS),
      validateBody(updateShowHostDto),
      updateShowHost,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SHOWS), deleteShowHost);

  return router;
}
