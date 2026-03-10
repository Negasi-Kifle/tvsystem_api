export interface ICalendarService {
  convertToGregorian(date: Date): Date;
  convertToEthiopian(date: Date): Date;
  formatEthiopianDate(date: Date): string;
}
