import { Router } from 'express';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createAdvertSalesDto } from '../dtos/requests/advert-sales/create.dto';
import { fetchAllAdvertSalesDto } from '../dtos/requests/advert-sales/fetch-all.dto';
import { updateAdvertSalesDto } from '../dtos/requests/advert-sales/update.dto';
import { createAdvertSalesHandlers } from '../controllers/advert-sales.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertSalesRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    create, list, getById, update, remove,
    getSchedule, sendSchedule, getReport, sendReport, emailScheduleToFinance,
  } = createAdvertSalesHandlers(deps);
  const { advertSchedulePdfUpload } = deps;

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(createAdvertSalesDto),
      create,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_SALES),
      validateQuery(fetchAllAdvertSalesDto),
      list,
    );

  router.get('/:id/schedule', authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getSchedule);
  router.post('/:id/schedule/send', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), sendSchedule);
  router.post(
    '/:id/email-to-finance',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SALES),
    advertSchedulePdfUpload,
    emailScheduleToFinance,
  );
  router.get('/:id/report', authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getReport);
  router.post('/:id/report/send', authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), sendReport);

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(updateAdvertSalesDto),
      update,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), remove);

  return router;
}
