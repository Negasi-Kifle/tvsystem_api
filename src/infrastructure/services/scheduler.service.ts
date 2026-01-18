import cron from 'node-cron';

type Job = () => Promise<void> | void;

export class SchedulerService {
  scheduleDailySixAm(job: Job) {
    cron.schedule('0 6 * * *', () => {
      void job();
    });
  }
}
