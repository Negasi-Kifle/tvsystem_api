export enum CompensationStatus {
  Proposed = 'Proposed',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export class CompensationEntity {
  constructor(
    public advertSalesId: string,
    public proposal: string,
    public status: CompensationStatus = CompensationStatus.Proposed,
    public advertPlacementId?: string | null,
    public missedDate?: Date | null,
    public compensationType?: string | null,
    public compensationDetails?: Record<string, unknown> | null,
    public proposedById?: string | null,
    public customerResponse?: string | null,
    public respondedAt?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}
}
