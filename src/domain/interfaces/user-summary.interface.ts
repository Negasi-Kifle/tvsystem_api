import { SexTypes } from "../enums/sex-types.enum";

export interface UserSummary {
    id: string;
    email: string;
    fullName: string;
    sex: SexTypes;
    phoneNumber: string;
    isActive: boolean;
}   