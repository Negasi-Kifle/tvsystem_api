import { ICalendarService } from '../../domain/services/calendar.service';
import { EthDateTime } from 'ethiopian-calendar-date-converter'

export class CalendarService implements ICalendarService {
    convertToGregorian(date: Date): Date {
        const gregorianDateTime = EthDateTime.fromEuropeanDate(date).toEuropeanDate();
        return gregorianDateTime;
  }

  convertToEthiopian(date: Date): Date {
      const ethDateTime = EthDateTime.fromEuropeanDate(date);
      return new Date(ethDateTime.year, ethDateTime.month - 1, ethDateTime.date, 6, 0, 0);
  }

  formatEthiopianDate(date: Date): string {
      return EthDateTime.fromEuropeanDate(date).toDateString();
  }
}