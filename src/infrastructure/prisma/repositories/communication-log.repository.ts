import { PrismaBaseRepository } from './base.repository';
import { ICommunicationLogRepository } from '../../../domain/repositories/communication-log.repository.interface';
import { CommunicationLogEntity } from '../../../domain/entities/communication-log.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { modelToEntity, entityToModel } from '../model_entity_mappers/communication-log';
import { buildWhereClauseForCommunicationLog } from '../where_clauses/communication-log';
import { CommunicationLogWriteOnlyError } from '../../../domain/errors/communication-log-write-only.error';

export class CommunicationLogRepository extends PrismaBaseRepository implements ICommunicationLogRepository {
  async findById(id: string): Promise<CommunicationLogEntity | null> {
    const log = await this.prisma.communicationLog.findUnique({
      where: { id },
      include: { salesAgent: true, mediaPack: true },
    });
    return log ? modelToEntity(log) : null;
  }

  async findByCustomerId(customerId: string, limit = 50): Promise<CommunicationLogEntity[]> {
    const logs = await this.prisma.communicationLog.findMany({
      where: { customerId },
      orderBy: { logDate: 'desc' },
      take: limit,
      include: { salesAgent: true, mediaPack: true },
    });
    return logs.map(modelToEntity);
  }

  async findMany(query: QueryOptions<CommunicationLogEntity>): Promise<CommunicationLogEntity[]> {
    const where = buildWhereClauseForCommunicationLog(query.filters ?? {});
    const list = await this.prisma.communicationLog.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { logDate: 'desc' },
      include: { salesAgent: true, mediaPack: true },
    });
    return list.map(modelToEntity);
  }

  async count(filters?: Partial<CommunicationLogEntity>): Promise<number> {
    const where = buildWhereClauseForCommunicationLog(filters ?? {});
    return this.prisma.communicationLog.count({ where });
  }

  async create(data: Omit<CommunicationLogEntity, 'id'>): Promise<CommunicationLogEntity> {
    const entity = data as CommunicationLogEntity;
    const createData = entityToModel(entity);
    const { id: _omit, ...rest } = createData;
    const saved = await this.prisma.communicationLog.create({ data: rest });
    return modelToEntity(saved);
  }

  async update(_entity: CommunicationLogEntity): Promise<CommunicationLogEntity | null> {
    throw new CommunicationLogWriteOnlyError();
  }

  async deleteById(_id: string): Promise<CommunicationLogEntity | null> {
    throw new CommunicationLogWriteOnlyError();
  }
}
