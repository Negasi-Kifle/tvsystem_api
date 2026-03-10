export interface IScheduleActivationHandler {
  onScheduleActivated(scheduleId: string): Promise<void>;
}
