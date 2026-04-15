import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/create-media-monitoring-record.dto';
import { fetchAllMediaMonitoringRecordsDto } from '../dtos/requests/media-monitoring/fetch-all-media-monitoring-records.dto';
import { updateMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/update-media-monitoring-record.dto';
import { createMediaMonitoringHandlers } from '../controllers/media-monitoring.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createMediaMonitoringRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    fetchUnlinkedMediaMonitoring,
    fetchAllMediaMonitoringRecords,
    createMediaMonitoringRecord,
    getMediaMonitoringRecordById,
    updateMediaMonitoringRecord,
    deleteMediaMonitoringRecordById,
  } = createMediaMonitoringHandlers(deps);

  router.get(
    '/unlinked',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SALES),
    fetchUnlinkedMediaMonitoring,
  );

  router.get(
    '/',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SALES),
    validateQuery(fetchAllMediaMonitoringRecordsDto),
    fetchAllMediaMonitoringRecords,
  );

  router.post(
    '/',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SALES),
    validateBody(createMediaMonitoringRecordDto),
    createMediaMonitoringRecord,
  );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), getMediaMonitoringRecordById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(updateMediaMonitoringRecordDto),
      updateMediaMonitoringRecord,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SALES), deleteMediaMonitoringRecordById);

  return router;
}
