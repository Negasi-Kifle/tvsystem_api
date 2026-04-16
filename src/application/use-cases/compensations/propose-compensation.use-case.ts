import { CompensationEntity, CompensationStatus } from '../../../domain/entities/compensation.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { ICompensationRepository } from '../../../domain/repositories/compensation.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPlacementRepository } from '../../../domain/repositories/advert-placement.repository.interface';
import { AdvertPlacementStatus } from '../../../domain/enums/advert-placement-status.enum';

export type ProposeCompensationInput = {
  advertPlacementId: string;
  proposal: string;
  compensationType?: string;
  compensationDetails?: Record<string, unknown>;
  proposedById?: string;
};

export class ProposeCompensationUseCase {
  constructor(
    private readonly compensationRepo: ICompensationRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly advertPlacementRepo: IAdvertPlacementRepository,
  ) { }

  async execute(input: ProposeCompensationInput): Promise<CompensationEntity> {
    // Check advert placement exists and it "Missed"
    const [advertPlacement, existingCompensation] = await Promise.all([
      this.advertPlacementRepo.findById(input.advertPlacementId),
      this.compensationRepo.findMany({ filters: { advertPlacementId: input.advertPlacementId, status: CompensationStatus.Proposed } }),
    ]);

    if (!advertPlacement) {
      throw new EntityNotFoundError('Advert placement not found', 'AdvertPlacement', input.advertPlacementId);
    }

    if (advertPlacement.status !== AdvertPlacementStatus.Missed) {
      throw new ValidationError('Advert placement is not not eligible for compensation.');
    }

    if (existingCompensation.length > 0) {
      throw new ValidationError('Compensation already proposed for this advert placement.');
    }

    const sale = await this.advertSalesRepo.findById(advertPlacement.advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales');
    }

    const entity = CompensationEntity.createInstance(
      advertPlacement.advertSalesId,
      input.proposal,
      CompensationStatus.Proposed,
      input.advertPlacementId,
      advertPlacement.date,
      input.compensationType,
      input.compensationDetails,
      input.proposedById,
    );

    return this.compensationRepo.create(entity);
  }
}
