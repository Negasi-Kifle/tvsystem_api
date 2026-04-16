export class AuditLogEntity {
  constructor(
    public action: string,
    public resourceType: string,
    public userId?: string | null,
    public resourceId?: string | null,
    public metadata?: Record<string, unknown> | null,
    public ipAddress?: string | null,
    public createdAt?: Date,
    public id?: string,
  ) {}
}
