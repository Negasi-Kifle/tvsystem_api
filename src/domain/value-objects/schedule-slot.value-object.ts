export class ScheduleSlot {
  readonly start: Date;
  readonly end: Date;

  constructor(start: Date, end: Date) {
    if (end <= start) {
      throw new Error('End time must be after start time');
    }
    this.start = start;
    this.end = end;
  }

  durationMinutes(): number {
    return (this.end.getTime() - this.start.getTime()) / 60000;
  }
}
