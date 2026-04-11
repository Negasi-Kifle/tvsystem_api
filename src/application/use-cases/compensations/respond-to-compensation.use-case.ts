import { CompensationEntity, CompensationStatus } from '../../../domain/entities/compensation.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { ICompensationRepository } from '../../../domain/repositories/compensation.repository.interface';

export type RespondToCompensationInput = {
  accept: boolean;
  customerResponse?: string;
};

export class RespondToCompensationUseCase {
  constructor(private readonly compensationRepo: ICompensationRepository) {}

  async execute(id: string, input: RespondToCompensationInput): Promise<CompensationEntity | null> {
    const existing = await this.compensationRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Compensation not found', 'Compensation', id);
    }
    if (existing.status !== CompensationStatus.Proposed) {
      throw new ValidationError('Compensation has already been responded to');
    }

    existing.status = input.accept ? CompensationStatus.Accepted : CompensationStatus.Rejected;
    existing.customerResponse = input.customerResponse ?? null;
    existing.respondedAt = new Date();

    return this.compensationRepo.update(existing);
  }
}
