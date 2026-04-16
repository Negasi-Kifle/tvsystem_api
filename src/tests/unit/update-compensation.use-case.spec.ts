import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UpdateCompensationUseCase } from '../../application/use-cases/compensations/update-compensation.use-case';
import { CompensationEntity, CompensationStatus } from '../../domain/entities/compensation.entity';
import { ValidationError } from '../../domain/errors';
import type { ICompensationRepository } from '../../domain/repositories/compensation.repository.interface';

describe('UpdateCompensationUseCase', () => {
  const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  const compensationRepo: {
    findById: jest.MockedFunction<ICompensationRepository['findById']>;
    update: jest.MockedFunction<ICompensationRepository['update']>;
  } = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws ValidationError when compensation is not Proposed', async () => {
    const existing = new CompensationEntity(
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'Original proposal',
      CompensationStatus.Accepted,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      id,
    );

    compensationRepo.findById.mockResolvedValue(existing);

    const uc = new UpdateCompensationUseCase(compensationRepo as unknown as ICompensationRepository);

    await expect(uc.execute(id, { proposal: 'Updated' })).rejects.toBeInstanceOf(ValidationError);
    expect(compensationRepo.update).not.toHaveBeenCalled();
  });

  it('updates proposal when status is Proposed', async () => {
    const existing = new CompensationEntity(
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'Original proposal',
      CompensationStatus.Proposed,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      id,
    );

    const updated = new CompensationEntity(
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'Updated proposal',
      CompensationStatus.Proposed,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      id,
    );

    compensationRepo.findById.mockResolvedValue(existing);
    compensationRepo.update.mockResolvedValue(updated);

    const uc = new UpdateCompensationUseCase(compensationRepo as unknown as ICompensationRepository);
    const result = await uc.execute(id, { proposal: 'Updated proposal' });

    expect(result.proposal).toBe('Updated proposal');
    expect(compensationRepo.update).toHaveBeenCalled();
  });
});
