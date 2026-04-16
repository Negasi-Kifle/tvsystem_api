import { CompensationEntity, CompensationStatus } from '../../../domain/entities/compensation.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { ICompensationRepository } from '../../../domain/repositories/compensation.repository.interface';

export type UpdateCompensationInput = Partial<{
  proposal: string;
  advertPlacementId: string | null;
  missedDate: Date | null;
  compensationType: string | null;
  compensationDetails: Record<string, unknown> | null;
}>;

export class UpdateCompensationUseCase {
  constructor(private readonly compensationRepo: ICompensationRepository) {}

  async execute(compensationId: string, payload: UpdateCompensationInput): Promise<CompensationEntity> {
    const existing = await this.compensationRepo.findById(compensationId);
    if (!existing) {
      throw new EntityNotFoundError('Compensation not found', 'Compensation', compensationId);
    }

    if (existing.status !== CompensationStatus.Proposed) {
      throw new ValidationError('Only proposed compensations can be updated');
    }

    existing.updateInstance(
      payload.proposal,
      payload.advertPlacementId,
      payload.missedDate,
      payload.compensationType,
      payload.compensationDetails,
    );

    const updated = await this.compensationRepo.update(existing);
    if (!updated) {
      throw new EntityNotFoundError('Compensation not found', 'Compensation', compensationId);
    }

    return updated;
  }
}
