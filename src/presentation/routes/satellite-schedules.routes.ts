import { Router } from 'express';
import { createSatelliteScheduleHandlers } from '../controllers/satellite-schedule.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createSatelliteScheduleDto } from '../dtos/requests/satellite-schedule/create-satellite-schedule.dto';
import { createSatelliteScheduleWithBlocksDto } from '../dtos/requests/satellite-schedule/create-satellite-schedule-with-blocks.dto';
import { updateSatelliteScheduleDto } from '../dtos/requests/satellite-schedule/update-satellite-schedule.dto';
import { fetchAllSatelliteSchedulesDto } from '../dtos/requests/satellite-schedule/fetch-all-satellite-schedules.dto';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createScheduleBlockRoutes } from './schedule-blocks.routes';
import { createBroadcastSlotRoutes } from './broadcast-slots.routes';
import type { ApiRouterDeps } from '../api-router-deps';

export function createSatelliteSchedulesRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const {
    createSatelliteSchedule,
    createSatelliteScheduleWithBlocks,
    deleteSatelliteSchedule,
    getSatelliteScheduleById,
    listSatelliteSchedules,
    updateSatelliteSchedule,
  } = createSatelliteScheduleHandlers(deps);

  router.use('/:scheduleId/blocks', createScheduleBlockRoutes(deps));
  router.use('/:scheduleId/broadcast-slots', createBroadcastSlotRoutes(deps));

  router
    .route('/')
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_SCHEDULES),
      validateQuery(fetchAllSatelliteSchedulesDto),
      listSatelliteSchedules,
    )
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
      validateBody(createSatelliteScheduleDto),
      createSatelliteSchedule,
    );

  router.post(
    '/with-blocks',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    validateBody(createSatelliteScheduleWithBlocksDto),
    createSatelliteScheduleWithBlocks,
  );

  router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SCHEDULES), getSatelliteScheduleById)
    .patch(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
      validateBody(updateSatelliteScheduleDto),
      updateSatelliteSchedule,
    )
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SCHEDULES), deleteSatelliteSchedule);

  return router;
}
