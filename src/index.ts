import dotenv from 'dotenv';
import app from './presentation/app';
import { SchedulerService } from './infrastructure/services/scheduler.service';
import { AlertService } from './application/services/alert.service';
import { connectPrisma, disconnectPrisma } from './infrastructure/database/prisma';

dotenv.config();

const port = process.env.PORT || 3000;

async function bootstrap(): Promise<void> {
  // Connect to PostgreSQL via Prisma
  await connectPrisma();
  // eslint-disable-next-line no-console
  console.log('Connected to PostgreSQL database');

  const scheduler = new SchedulerService();
  const alertService = new AlertService();
  scheduler.scheduleDailySixAm(() => alertService.processOffAirAlerts());

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    // eslint-disable-next-line no-console
    console.log('Shutting down gracefully...');
    server.close(async () => {
      await disconnectPrisma();
      // eslint-disable-next-line no-console
      console.log('Database connection closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start application', error);
  process.exit(1);
});
