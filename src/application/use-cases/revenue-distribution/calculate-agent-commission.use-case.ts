import { AgentCommissionEntity, AgentCommissionStatus } from '../../../domain/entities/agent-commission.entity';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { IAgentCommissionRepository } from '../../../domain/repositories/agent-commission.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';

const COMMISSION_TAX_RATE = 0.15;

export class CalculateAgentCommissionUseCase {
  constructor(
    private readonly commissionRepo: IAgentCommissionRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
  ) {}

  async execute(advertSalesId: string): Promise<AgentCommissionEntity | null> {
    const sale = await this.advertSalesRepo.findById(advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', advertSalesId);
    }

    if (!sale.salesAgentId || sale.agentCommissionPercentage <= 0) {
      return null;
    }

    const commissionAmount = Math.round(
      sale.finalPrice * (sale.agentCommissionPercentage / 100) * 100,
    ) / 100;
    const taxAmount = Math.round(commissionAmount * COMMISSION_TAX_RATE * 100) / 100;
    const netAmount = Math.round((commissionAmount - taxAmount) * 100) / 100;

    const entity = new AgentCommissionEntity(
      advertSalesId,
      sale.salesAgentId,
      sale.agentCommissionPercentage,
      commissionAmount,
      taxAmount,
      netAmount,
      AgentCommissionStatus.Pending,
    );

    return this.commissionRepo.create(entity);
  }
}
