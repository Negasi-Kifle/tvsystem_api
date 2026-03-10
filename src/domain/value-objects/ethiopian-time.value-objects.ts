export const ETHIOPIAN_DAY_PART_VALUES = ['ጠዋት', 'ከሰአት', 'ማታ', 'ሌሊት'] as const;
export type EthiopianDayPart = (typeof ETHIOPIAN_DAY_PART_VALUES)[number];

export class EthiopianTime {
  private constructor(
    public readonly hour: number,       // Ethiopian hour (1-12)
    public readonly minute: number,     // Same minutes, no change
    public readonly dayPart: EthiopianDayPart,
  ) {}

  // The single source of conversion logic
  static fromGregorianMinutes(totalMinutes: number): EthiopianTime {
    const gregorianHour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    // Shift: Ethiopian hour = (Gregorian hour + 18) % 24, then map to 1-12
    const rawEthHour = (gregorianHour + 18) % 24;
    const hour = rawEthHour === 0 ? 12 : rawEthHour > 12 ? rawEthHour - 12 : rawEthHour;
    const dayPart = EthiopianTime.getDayPart(gregorianHour);

    return new EthiopianTime(hour, minute, dayPart);
  }

  // Convert Ethiopian input back to Gregorian minutes (for ingestion/API input)
  static toGregorianMinutes(hour: number, minute: number, dayPart: EthiopianDayPart): number {
    const ethHour24 = EthiopianTime.toEth24Hour(hour, dayPart);
    const gregorianHour = (ethHour24 + 6) % 24;
    return gregorianHour * 60 + minute;
  }

  private static toEth24Hour(hour: number, dayPart: EthiopianDayPart): number {
    // ጠዋት:  display 12,1,2,3,4,5   → eth24 0,1,2,3,4,5
    // ከሰአት: display 6,7,8,9,10,11,12 → eth24 6,7,8,9,10,11,12
    // ማታ:   display 12,1,2,3,4,5   → eth24 12,13,14,15,16,17
    // ሌሊት:  display 6,7,8,9,10,11  → eth24 18,19,20,21,22,23
    const base: Record<EthiopianDayPart, number> = { 'ጠዋት': 0, 'ከሰአት': 6, 'ማታ': 12, 'ሌሊት': 18 };
    const periodBase = base[dayPart];
    const startsAtSix = periodBase === 6 || periodBase === 18;
    const offset = startsAtSix ? (hour === 12 ? 6 : hour - 6) : (hour === 12 ? 0 : hour);
    return periodBase + offset;
  }

  private static getDayPart(gregorianHour: number): EthiopianDayPart {
    if (gregorianHour >= 6 && gregorianHour < 12)  return 'ጠዋት';
    if (gregorianHour >= 12 && gregorianHour < 18) return 'ከሰአት';
    if (gregorianHour >= 18 && gregorianHour < 24) return 'ማታ';
    return 'ሌሊት'; // 0-6
  }

  toString(): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${this.hour}:${pad(this.minute)} ${this.dayPart}`;
  }
}