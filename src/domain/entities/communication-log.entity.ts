export class CommunicationLogEntity {
  constructor(
    public customerId: string,
    public logDate: Date,
    public salesAgentId: string,
    public notes: string,
    public mediaPackId?: string,
    public createdAt?: Date,
    public id?: string,
  ) {}

  public static createInstance(
    customerId: string,
    logDate: Date,
    salesAgentId: string,
    notes: string,
    mediaPackId?: string,
    createdAt?: Date,
    id?: string,
  ): CommunicationLogEntity {
    return new CommunicationLogEntity(
      customerId,
      logDate,
      salesAgentId,
      notes,
      mediaPackId,
      createdAt,
      id,
    );
  }
}
