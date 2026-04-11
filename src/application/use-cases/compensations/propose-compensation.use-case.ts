import { CompensationEntity, CompensationStatus } from '../../../domain/entities/compensation.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { ICompensationRepository } from '../../../domain/repositories/compensation.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';

export type ProposeCompensationInput = {
  advertSalesId: string;
  advertPlacementId?: string;
  proposal: string;
  missedDate?: Date;
  compensationType?: string;
  compensationDetails?: Record<string, unknown>;
  proposedById?: string;
};

export class ProposeCompensationUseCase {
  constructor(
    private readonly compensationRepo: ICompensationRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
  ) {}

  async execute(input: ProposeCompensationInput): Promise<CompensationEntity> {
    const sale = await this.advertSalesRepo.findById(input.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', input.advertSalesId);
    }

    const entity = new CompensationEntity(
      input.advertSalesId,
      input.proposal,
      CompensationStatus.Proposed,
      input.advertPlacementId,
      input.missedDate,
      input.compensationType,
      input.compensationDetails,
      input.proposedById,
    );

    return this.compensationRepo.create(entity);
  }
}
