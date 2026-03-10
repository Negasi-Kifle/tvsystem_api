import { Router } from 'express';
import {
  createSatelliteSchedule,
  deleteSatelliteSchedule,
  getSatelliteScheduleById,
  listSatelliteSchedules,
  updateSatelliteSchedule,
} from '../controllers/satellite-schedule.controller';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createSatelliteScheduleDto } from '../dtos/requests/satellite-schedule/create-satellite-schedule.dto';
import { updateSatelliteScheduleDto } from '../dtos/requests/satellite-schedule/update-satellite-schedule.dto';
import { fetchAllSatelliteSchedulesDto } from '../dtos/requests/satellite-schedule/fetch-all-satellite-schedules.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import scheduleBlockRoutes from './schedule-blocks.routes';
import broadcastSlotRoutes from './broadcast-slots.routes';

const router = Router();

router.use('/:scheduleId/blocks', scheduleBlockRoutes);
router.use('/:scheduleId/broadcast-slots', broadcastSlotRoutes);

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

router
  .route('/:id')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SCHEDULES),
    getSatelliteScheduleById,
  )
  .patch(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    validateBody(updateSatelliteScheduleDto),
    updateSatelliteSchedule,
  )
  .delete(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SCHEDULES),
    deleteSatelliteSchedule,
  );

export default router;
