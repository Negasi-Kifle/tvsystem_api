import { BroadcastType, DayOfWeek } from "../enums/";



export class ScheduleBlockEntity {
    constructor(
      public showId: string,
      public scheduleId: string,        // FK to SatelliteScheduleEntity
      public dayOfWeek: DayOfWeek,
      public startTimeMinutes: number,  // Minutes from midnight (e.g., 8:00 = 480). Avoids timezone/string issues entirely.
      public broadcastType: BroadcastType,
      public id?: string,
      public createdAt?: Date,
      public updatedAt?: Date,
    ) {}
  
    get endTimeMinutes(): number {
      // Resolved via show.durationMinutes + show.maxAdLengthMinutes
      // This is a computed property — don't store it
      throw new Error('Resolve via ShowEntity');
    }
  }