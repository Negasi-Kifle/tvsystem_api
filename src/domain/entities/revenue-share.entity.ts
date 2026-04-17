export enum RevenueShareStatus {
  Pending = 'PENDING',
  Disbursed = 'DISBURSED',
}

export class RevenueShareEntity {
  constructor(
    public advertSalesId: string,
    public userId: string,
    public sharePercentage: number,
    public shareAmount: number,
    public status: RevenueShareStatus = RevenueShareStatus.Pending,
    public showHostId?: string | null,
    public disbursedDate?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}
}
