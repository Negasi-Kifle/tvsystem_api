import { Router } from 'express';
import { health } from '../controllers/health.controller';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import showRoutes from './shows.routes';
import advertRoutes from './adverts.routes';
import financeRoutes from './finance.routes';
import compensationRoutes from './compensation.routes';
import analyticsRoutes from './analytics.routes';
import telegramGroupRoutes from './telegram-groups.routes';

const router = Router();

router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shows', showRoutes);
router.use('/adverts', advertRoutes);
router.use('/finance', financeRoutes);
router.use('/compensations', compensationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/telegram-groups', telegramGroupRoutes);

export default router;
