import { ShowType } from '../enums/show-type.enum';

export interface Show {
  id: string;
  title: string;
  type: ShowType;
  durationMinutes: number;
  maxAdLengthSeconds: number;
  schedule: { day: string; startTime: string; endTime: string }[];
  assignedStaff?: string;
  createdAt?: Date;
}
