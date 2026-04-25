import { Prisma } from '../generated/client';
import { PrismaBaseRepository } from './base.repository';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { modelToEntity, entityToModel } from '../model_entity_mappers/customer';
import { buildWhereClauseForCustomer } from '../where_clauses/customer';
import { CustomerStatusWithUs } from '../../../domain/enums/customer-status.enum';

export class CustomerRepository extends PrismaBaseRepository implements ICustomerRepository {
  private throwIfUniqueBirthSourceViolation(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      const target = (e.meta as { target?: string[] })?.target;
      if (target?.includes('media_monitoring_id')) {
        throw new ValidationError(
          'This media monitoring record is already the birth source for another customer',
        );
      }
    }
    throw e;
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { category: true, subCategory: true, salesAgent: true, communicationLogs: true },
    });
    return customer ? modelToEntity(customer) : null;
  }

  async findByBusinessRef(businessRef: string): Promise<CustomerEntity | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { businessRef },
      include: { category: true, subCategory: true, salesAgent: true, communicationLogs: true },
    });
    return customer ? modelToEntity(customer) : null;
  }

  async findMany(query: QueryOptions<CustomerEntity>): Promise<CustomerEntity[]> {
    const where = buildWhereClauseForCustomer(query.filters ?? {});
    const list = await this.prisma.customer.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { category: true, subCategory: true, salesAgent: true, communicationLogs: true },
    });
    return list.map(modelToEntity);
  }

  async count(filters?: Partial<CustomerEntity>): Promise<number> {
    const where = buildWhereClauseForCustomer(filters ?? {});
    return this.prisma.customer.count({ where });
  }

  async create(data: Omit<CustomerEntity, 'id'>): Promise<CustomerEntity> {
    try {
      const entity = data as CustomerEntity;
      const createData = entityToModel(entity);
      const { id: _omit, ...rest } = createData;
      const saved = await this.prisma.customer.create({ data: rest });
      return modelToEntity(saved);
    } catch (e) {
      this.throwIfUniqueBirthSourceViolation(e);
    }
  }

  async createWithBirthMonitoringLink(
    data: Omit<CustomerEntity, 'id'>,
    birthMonitoringRecordId: string,
  ): Promise<CustomerEntity> {
    try {
      return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const birth = await tx.mediaMonitoringRecord.findUnique({
          where: { id: birthMonitoringRecordId },
        });
        if (!birth) {
          throw new EntityNotFoundError(
            'Media monitoring record not found',
            'MediaMonitoringRecord',
            birthMonitoringRecordId,
          );
        }
        if (birth.customerId !== null) {
          throw new ValidationError(
            'This media monitoring record is already linked to a customer',
          );
        }

        const createData = entityToModel(data as CustomerEntity);
        const { id: _omit, ...rest } = createData;
        const saved = await tx.customer.create({ data: rest });
        await tx.mediaMonitoringRecord.update({
          where: { id: birthMonitoringRecordId },
          data: { customerId: saved.id },
        });
        return modelToEntity(saved);
      });
    } catch (e) {
      if (e instanceof ValidationError || e instanceof EntityNotFoundError) throw e;
      this.throwIfUniqueBirthSourceViolation(e);
    }
  }

  async update(entity: CustomerEntity): Promise<CustomerEntity | null> {
    if (!entity.id) return null;
    try {
      const updateData = entityToModel(entity);
      const { id: _omit, ...rest } = updateData;
      const updated = await this.prisma.customer.update({
        where: { id: entity.id },
        data: rest,
      });
      return modelToEntity(updated);
    } catch (e) {
      this.throwIfUniqueBirthSourceViolation(e);
    }
  }

  async deleteById(id: string): Promise<CustomerEntity | null> {
    try {
      const deleted = await this.prisma.customer.delete({ where: { id } });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }

  async countByStatuses(statuses: CustomerStatusWithUs[]): Promise<number> {
    return this.prisma.customer.count({ where: { status: { in: statuses } } });
  }

  async countByStatusesCreatedInRange(
    statuses: CustomerStatusWithUs[],
    from: Date,
    to: Date,
  ): Promise<number> {
    return this.prisma.customer.count({
      where: { status: { in: statuses }, createdAt: { gte: from, lte: to } },
    });
  }
}
