export interface ICalendarService {
  toGregorian(date: string, calendar: 'Gregorian' | 'Ethiopian'): string;
  toEthiopian(date: string, calendar: 'Gregorian' | 'Ethiopian'): string;
}
