import { Router } from 'express';
import { createShow, createShowWithHosts, deleteShow, getShowById, listShows, updateShow } from '../controllers/show.controller';
import { validateBody } from '../validators/validate-body';
import { createShowDto } from '../dtos/requests/show/create-show.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { fetchAllShowsDto } from '../dtos/requests/show/fetch-all-shows.dto';
import { validateQuery } from '../validators/validate-query';
import { updateShowDto } from '../dtos/requests/show/update-show.dto';
import { createShowWithHostsDto } from '../dtos/requests/show/create-show-with-hosts.dto';

const router = Router();


router.route('/')
  .get(
    authMiddleware, 
    requirePermission(PERMISSIONS.MANAGE_SHOWS), 
    validateQuery(fetchAllShowsDto), 
    listShows
  )
  .post(
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SHOWS),
  validateBody(createShowDto),
  createShow
);


router.post("/with-hosts",
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SHOWS),
  validateBody(createShowWithHostsDto),
  createShowWithHosts
);


router.route('/:id')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SHOWS),
    getShowById
)
  .patch(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SHOWS),
    validateBody(updateShowDto),
    updateShow
  )  
  .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_SHOWS), deleteShow);

export default router;
