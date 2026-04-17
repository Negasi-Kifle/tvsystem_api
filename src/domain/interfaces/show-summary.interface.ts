import { ShowType } from "../enums/show-type.enum";


export interface ShowSummary {
    id: string;
    title: string;
    titleSlug: string;
    type: ShowType;
    durationMinutes: number;
    maxAdLengthMinutes: number;
    totalDurationMinutes: number;
    partsCount: number;
    rerunsCount: number;
    bonusCount: number;
}