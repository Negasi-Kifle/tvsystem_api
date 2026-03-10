declare module 'ethiopian-calendar-date-converter' {
  export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
  export type MonthEth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

  export class EthDateTime {
    year: number;
    month: MonthEth;
    date: number;
    hour: number;
    minute: number;
    second: number;

    constructor(yr: number, mon: number, date: number, hr?: number, min?: number, sec?: number);

    static now(): EthDateTime;
    static fromEuropeanDate(europeanDate: Date): EthDateTime;

    toEuropeanDate(): Date;
    toTimeString(): string;
    toDateString(): string;
    toDateWithDayString(): string;
    toString(): string;
    toFullDateTimeString(): string;
    getDay(): DayOfWeek;
  }

  export const limits: {
    ethiopianCalendarYear: {
      min(): number;
      max(): number;
    };
    europeanCalendarDate: {
      min: Date;
      max: Date;
    };
  };
}
