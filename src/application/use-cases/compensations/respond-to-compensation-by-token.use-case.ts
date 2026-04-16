import { CompensationEntity, CompensationStatus } from '../../../domain/entities/compensation.entity';
import { ValidationError } from '../../../domain/errors';
import { ICompensationRepository } from '../../../domain/repositories/compensation.repository.interface';
import { sha256Hex } from '../../../shared/utils/secure-token';

export type RespondToCompensationByTokenInput = {
  plainToken: string;
  accept: boolean;
  customerResponse?: string;
};

export class RespondToCompensationByTokenUseCase {
  constructor(private readonly compensationRepo: ICompensationRepository) {}

  async execute(input: RespondToCompensationByTokenInput): Promise<CompensationEntity | null> {
    const tokenHash = sha256Hex(input.plainToken);
    const existing = await this.compensationRepo.findByCustomerResponseTokenHash(tokenHash);
    if (!existing?.id) {
      throw new ValidationError('Invalid or expired token');
    }

    if (
      existing.customerResponseTokenExpiresAt &&
      existing.customerResponseTokenExpiresAt.getTime() < Date.now()
    ) {
      throw new ValidationError('Response link has expired');
    }

    if (existing.status !== CompensationStatus.Proposed) {
      throw new ValidationError('Compensation has already been responded to');
    }

    existing.updateInstance(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      input.accept ? CompensationStatus.Accepted : CompensationStatus.Rejected,
      input.customerResponse ?? null,
      new Date(),
      null,
      null,
    );

    return this.compensationRepo.update(existing);
  }
}
