import { PrismaBaseRepository } from './base.repository';
import { IShowHostRepository } from '../../../domain/repositories/show-host.repository.interface';
import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { ShowHostFilters } from '../../../domain/interfaces/show-host-filters.interface';
import { entityToModel, modelToEntity } from '../model_entity_mappers/show-host';
import { buildWhereClauseForShowHost } from '../where_clauses/show-host';

export class ShowHostRepository extends PrismaBaseRepository implements IShowHostRepository {
  async create(entity: ShowHostEntity): Promise<ShowHostEntity> {
    const model = entityToModel(entity);
    const { id: _omit, ...data } = model;
    const saved = await this.prisma.showHost.create({ data });
    return modelToEntity(saved);
  }

  async findById(id: string): Promise<ShowHostEntity | null> {
    const record = await this.prisma.showHost.findUnique({ where: { id }, include: { show: true, user: true } });
    return record ? modelToEntity(record) : null;
  }

  async findMany(query: QueryOptions<ShowHostEntity, ShowHostFilters>): Promise<ShowHostEntity[]> {
    const where = buildWhereClauseForShowHost(query.filters ?? {});
    const records = await this.prisma.showHost.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { show: true, user: true },
    });
    return records.map(modelToEntity);
  }

  async update(entity: ShowHostEntity): Promise<ShowHostEntity | null> {
    const model = entityToModel(entity);
    const updated = await this.prisma.showHost.update({
      where: { id: model.id },
      data: model,
      include: { show: true, user: true },
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<ShowHostEntity | null> {
    const deleted = await this.prisma.showHost.delete({ where: { id } });
    return deleted ? modelToEntity(deleted) : null;
  }

  async findByShowAndUser(showId: string, userId: string): Promise<ShowHostEntity | null> {
    const record = await this.prisma.showHost.findUnique({
      where: { showId_userId: { showId, userId } },
    });
    return record ? modelToEntity(record) : null;
  }

  async findByShow(showId: string): Promise<ShowHostEntity[]> {
    const records = await this.prisma.showHost.findMany({ where: { showId } });
    return records.map(modelToEntity);
  }

  async count(filters: ShowHostFilters): Promise<number> {
    const where = buildWhereClauseForShowHost(filters ?? {});
    const count = await this.prisma.showHost.count({ where });
    return count;
  }
}

