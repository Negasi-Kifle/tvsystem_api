import { ValidationError } from '../errors/validation.error';

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
    public customerResponseTokenHash?: string | null,
    public customerResponseTokenExpiresAt?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    advertSalesId: string,
    proposal: string,
    status: CompensationStatus = CompensationStatus.Proposed,
    advertPlacementId?: string | null,
    missedDate?: Date | null,
    compensationType?: string | null,
    compensationDetails?: Record<string, unknown> | null,
    proposedById?: string | null,
    customerResponse?: string | null,
    respondedAt?: Date | null,
    customerResponseTokenHash?: string | null,
    customerResponseTokenExpiresAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ): CompensationEntity {
    if (!advertSalesId?.trim()) {
      throw new ValidationError('Advert sale ID is required');
    }
    
    if (!proposal?.trim()) {
      throw new ValidationError('Proposal is required');
    }

    return new CompensationEntity(
      advertSalesId.trim(),
      proposal.trim(),
      status,
      advertPlacementId,
      missedDate,
      compensationType,
      compensationDetails,
      proposedById,
      customerResponse,
      respondedAt,
      customerResponseTokenHash,
      customerResponseTokenExpiresAt,
      createdAt,
      updatedAt,
      id,
    );
  }

  public updateInstance(
    proposal?: string,
    advertPlacementId?: string | null,
    missedDate?: Date | null,
    compensationType?: string | null,
    compensationDetails?: Record<string, unknown> | null,
    status?: CompensationStatus,
    customerResponse?: string | null,
    respondedAt?: Date | null,
    customerResponseTokenHash?: string | null,
    customerResponseTokenExpiresAt?: Date | null,
  ): CompensationEntity {
    if (proposal !== undefined) {
      const trimmed = proposal.trim();
      if (!trimmed) {
        throw new ValidationError('Proposal is required');
      }
      this.proposal = trimmed;
    }
    if (advertPlacementId !== undefined) {
      this.advertPlacementId = advertPlacementId ?? null;
    }
    if (missedDate !== undefined) {
      this.missedDate = missedDate ?? null;
    }
    if (compensationType !== undefined) {
      this.compensationType = compensationType ?? null;
    }
    if (compensationDetails !== undefined) {
      this.compensationDetails = compensationDetails ?? null;
    }
    if (status !== undefined) {
      this.status = status;
    }
    if (customerResponse !== undefined) {
      this.customerResponse = customerResponse ?? null;
    }
    if (respondedAt !== undefined) {
      this.respondedAt = respondedAt ?? null;
    }
    if (customerResponseTokenHash !== undefined) {
      this.customerResponseTokenHash = customerResponseTokenHash ?? null;
    }
    if (customerResponseTokenExpiresAt !== undefined) {
      this.customerResponseTokenExpiresAt = customerResponseTokenExpiresAt ?? null;
    }
    this.updatedAt = new Date();
    return this;
  }
}
