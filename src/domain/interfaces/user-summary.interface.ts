import { SexTypes } from "../enums/sex-types.enum";

export interface UserSummary {
    email: string;
    fullName: string;
    sex: SexTypes;
    phoneNumber: string;
    isActive: boolean;
}   