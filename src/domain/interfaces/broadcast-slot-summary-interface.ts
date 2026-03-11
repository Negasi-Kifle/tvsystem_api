import { BroadcastSlotStatus } from "../enums/broadcast-slot-status.enum";
import { BroadcastType } from "../enums/broadcast-type.enum";
import { DayOfWeek } from "../enums/day-of-week.enum";


export interface BroadcastSlotSummary {
    date: Date;
    dateEth: string;
    dayOfWeek: DayOfWeek;
    startTimeMinutes: number;
    durationMinutes: number;
    broadcastType: BroadcastType;
    label?: string;
    status: BroadcastSlotStatus;
}