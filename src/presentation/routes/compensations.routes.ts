import { Router } from 'express';
import { createCompensationHandlers } from '../controllers/compensation.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCompensationsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { create, list, getById, sendEmail, respond, remove } =
    createCompensationHandlers(deps);

  router
    .route('/')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), list)
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), create);

  router.post('/:id/send', authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), sendEmail);
  router.patch('/:id/respond', authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), respond);

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), getById)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), remove);

  return router;
}
