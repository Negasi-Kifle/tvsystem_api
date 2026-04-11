export enum AgentCommissionStatus {
  Pending = 'PENDING',
  Disbursed = 'DISBURSED',
}

export class AgentCommissionEntity {
  constructor(
    public advertSalesId: string,
    public agentId: string,
    public commissionPercentage: number,
    public commissionAmount: number,
    public taxAmount: number = 0,
    public netAmount: number = 0,
    public status: AgentCommissionStatus = AgentCommissionStatus.Pending,
    public disbursedDate?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
    public id?: string,
  ) {}
}
