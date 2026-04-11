import { AgentCommissionEntity, AgentCommissionStatus } from '../../../domain/entities/agent-commission.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IAgentCommissionRepository } from '../../../domain/repositories/agent-commission.repository.interface';

export class DisburseAgentCommissionUseCase {
  constructor(private readonly commissionRepo: IAgentCommissionRepository) {}

  async execute(id: string): Promise<AgentCommissionEntity | null> {
    const commission = await this.commissionRepo.findById(id);
    if (!commission) {
      throw new EntityNotFoundError('Agent commission not found', 'AgentCommission', id);
    }
    if (commission.status === AgentCommissionStatus.Disbursed) {
      throw new ValidationError('Agent commission has already been disbursed');
    }

    commission.status = AgentCommissionStatus.Disbursed;
    commission.disbursedDate = new Date();

    return this.commissionRepo.update(commission);
  }
}
