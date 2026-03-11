import { RevenueShareType } from "../enums";
import { ValidationError } from "../errors/validation.error";
import { ShowSummary } from "../interfaces/show-summary.interface";
import { UserSummary } from "../interfaces/user-summary.interface";

export class ShowHostEntity {
    constructor(
        public userId: string,
        public showId: string,
        public revenueShareType?: RevenueShareType,
        public revenueShareValue?: number,
        public isPrimary: boolean = false,
        public createdAt?: Date,
        public updatedAt?: Date,
        public id?: string,
        public show?: ShowSummary,
        public user?: UserSummary,
    ) { }

    public static createInstance(
        userId: string,
        showId: string,
        revenueShareType?: RevenueShareType,
        revenueShareValue?: number,
        isPrimary: boolean = false,
        createdAt?: Date,
        updatedAt?: Date,
        id?: string,
        show?: ShowSummary,
        user?: UserSummary,
    ): ShowHostEntity {
        if (!userId) {
            throw new ValidationError('User ID is required');
        }
        if (!showId) {
            throw new ValidationError('Show ID is required');
        }

        if(revenueShareType !== undefined && revenueShareValue === undefined) {
            throw new ValidationError('Revenue share value is required when revenue share type is set');
        }

        if(revenueShareType !== undefined && revenueShareValue !== undefined && revenueShareType === RevenueShareType.Percentage && (revenueShareValue < 0 || revenueShareValue > 100)) {
            throw new ValidationError('Revenue share value must be between 0 and 100 when revenue share type is percentage');
        }

        if(revenueShareType !== undefined && revenueShareValue !== undefined && revenueShareType === RevenueShareType.Fixed && revenueShareValue < 0) {
            throw new ValidationError('Revenue share value must be greater than 0 when revenue share type is fixed');
        }
        

        createdAt = createdAt ?? new Date();
        updatedAt = updatedAt ?? new Date();
        return new ShowHostEntity(
            userId,
            showId,
            revenueShareType,
            revenueShareValue,
            isPrimary,
            createdAt,
            updatedAt,
            id,
            show,
            user,
        );
    }


public updateInstance(userId?: string, showId?: string, revenueShareType?: RevenueShareType, revenueShareValue?: number, isPrimary?: boolean): ShowHostEntity {
    if (userId !== undefined) this.userId = userId;
    if (showId !== undefined) this.showId = showId;
    if (revenueShareType !== undefined) this.revenueShareType = revenueShareType;
    if (revenueShareValue !== undefined) this.revenueShareValue = revenueShareValue;
    if (isPrimary !== undefined) this.isPrimary = isPrimary;
    this.updatedAt = new Date();
    return this;
}
}