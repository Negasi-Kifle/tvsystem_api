import { PrismaBaseRepository } from './base.repository';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { modelToEntity, entityToModel } from '../model_entity_mappers/customer';
import { buildWhereClauseForCustomer } from '../where_clauses/customer';

export class CustomerRepository extends PrismaBaseRepository implements ICustomerRepository {
  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { category: true, subCategory: true, salesAgent: true },
    });
    return customer ? modelToEntity(customer) : null;
  }

  async findByBusinessRef(businessRef: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { businessRef },
      include: { category: true, subCategory: true, salesAgent: true },
    });
    return customer ? modelToEntity(customer) : null;
  }

  async findMany(query: QueryOptions<CustomerEntity>): Promise<CustomerEntity[]> {
    const where = buildWhereClauseForCustomer(query.filters ?? {});
    const list = await this.prisma.customer.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { category: true, subCategory: true, salesAgent: true },
    });
    return list.map(modelToEntity);
  }

  async count(filters?: Partial<CustomerEntity>): Promise<number> {
    const where = buildWhereClauseForCustomer(filters ?? {});
    return this.prisma.customer.count({ where });
  }

  async create(data: Omit<CustomerEntity, 'id'>): Promise<CustomerEntity> {
    const entity = data as CustomerEntity;
    const createData = entityToModel(entity);
    const { id: _omit, ...rest } = createData;
    const saved = await this.prisma.customer.create({ data: rest });
    return modelToEntity(saved);
  }

  async update(entity: CustomerEntity): Promise<CustomerEntity | null> {
    if (!entity.id) return null;
    const updateData = entityToModel(entity);
    const { id: _omit, ...rest } = updateData;
    const updated = await this.prisma.customer.update({
      where: { id: entity.id },
      data: rest,
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<CustomerEntity | null> {
    try {
      const deleted = await this.prisma.customer.delete({ where: { id } });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }
}
