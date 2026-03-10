import { Router } from 'express';
import { health } from '../controllers/health.controller';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import showRoutes from './shows.routes';
import telegramGroupRoutes from './telegram-groups.routes';
import telegramGroupMemberRoutes from './telegram-group-member.routes';
import permissionRoutes from './permissions.routes';
import userPermissionRoutes from './user-permissions.routes';
import employeeRoutes from './employee.route';
import partnerRoutes from './partner.route';
import satelliteScheduleRoutes from './satellite-schedules.routes';

const router = Router();

router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shows', showRoutes);
router.use('/telegram-groups', telegramGroupRoutes);
router.use('/telegram-group-members', telegramGroupMemberRoutes);
router.use('/permissions', permissionRoutes);
router.use('/user-permissions', userPermissionRoutes);
router.use('/employees', employeeRoutes);
router.use("/partners", partnerRoutes);
router.use('/satellite-schedules', satelliteScheduleRoutes);

export default router;
