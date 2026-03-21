import { PrismaBaseRepository } from './base.repository';
import { ICustomerShowSuitabilityRepository } from '../../../domain/repositories/customer-show-suitability.repository.interface';
import { CustomerShowSuitabilityEntity } from '../../../domain/entities/customer-show-suitability.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { modelToEntity, entityToModel } from '../model_entity_mappers/customer-show-suitability';
import { buildWhereClauseForCustomerShowSuitability } from '../where_clauses/customer-show-suitability';

export class CustomerShowSuitabilityRepository
  extends PrismaBaseRepository
  implements ICustomerShowSuitabilityRepository
{
  async findById(id: string): Promise<CustomerShowSuitabilityEntity | null> {
    const suitability = await this.prisma.customerShowSuitability.findUnique({
      where: { id },
      include: { customer: true, showSegmentSlot: { include: { show: true } } },
    });
    return suitability ? modelToEntity(suitability) : null;
  }

  async findByCustomerId(customerId: string): Promise<CustomerShowSuitabilityEntity[]> {
    const suitabilities = await this.prisma.customerShowSuitability.findMany({
      where: { customerId },
      include: { showSegmentSlot: { include: { show: true } } },
    });
    return suitabilities.map(modelToEntity);
  }

  async findMany(query: QueryOptions<CustomerShowSuitabilityEntity>): Promise<CustomerShowSuitabilityEntity[]> {
    const where = buildWhereClauseForCustomerShowSuitability(query.filters ?? {});
    const list = await this.prisma.customerShowSuitability.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { customer: true, showSegmentSlot: { include: { show: true } } },
    });
    return list.map(modelToEntity);
  }

  async count(filters?: Partial<CustomerShowSuitabilityEntity>): Promise<number> {
    const where = buildWhereClauseForCustomerShowSuitability(filters ?? {});
    return this.prisma.customerShowSuitability.count({ where });
  }

  async create(data: Omit<CustomerShowSuitabilityEntity, 'id'>): Promise<CustomerShowSuitabilityEntity> {
    const entity = data as CustomerShowSuitabilityEntity;
    const createData = entityToModel(entity);
    const { id: _omit, ...rest } = createData;
    const saved = await this.prisma.customerShowSuitability.create({ data: rest });
    return modelToEntity(saved);
  }

  async update(entity: CustomerShowSuitabilityEntity): Promise<CustomerShowSuitabilityEntity | null> {
    if (!entity.id) return null;
    const updateData = entityToModel(entity);
    const { id: _omit, ...rest } = updateData;
    const updated = await this.prisma.customerShowSuitability.update({
      where: { id: entity.id },
      data: rest,
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<CustomerShowSuitabilityEntity | null> {
    try {
      const deleted = await this.prisma.customerShowSuitability.delete({ where: { id } });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }
}
