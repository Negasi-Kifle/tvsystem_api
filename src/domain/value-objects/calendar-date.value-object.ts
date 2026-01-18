export class CalendarDate {
  readonly isoDate: string;
  readonly calendar: 'Gregorian' | 'Ethiopian';

  constructor(isoDate: string, calendar: 'Gregorian' | 'Ethiopian' = 'Gregorian') {
    this.isoDate = isoDate;
    this.calendar = calendar;
  }
}
