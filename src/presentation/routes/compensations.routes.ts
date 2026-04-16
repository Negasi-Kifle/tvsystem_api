import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { createCompensationHandlers } from '../controllers/compensation.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { proposeCompensationDto } from '../dtos/requests/compensation/propose-compensation.dto';
import { updateCompensationDto } from '../dtos/requests/compensation/update-compensation.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCompensationsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { create, list, update, getById, sendEmail, respond, remove } =
    createCompensationHandlers(deps);

  router
    .route('/')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), list)
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_ADVERTS),
      validateBody(proposeCompensationDto),
      create,
    );

  router.post('/:id/send', authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), sendEmail);

  router.patch('/:id/respond', authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), respond);
  
  router.patch(
    '/:id',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_ADVERTS),
    validateBody(updateCompensationDto),
    update,
  );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), getById)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), remove);

  return router;
}
