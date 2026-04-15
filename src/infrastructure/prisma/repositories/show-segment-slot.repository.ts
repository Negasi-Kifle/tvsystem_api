import { PrismaBaseRepository } from './base.repository';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';
import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { modelToEntity, entityToModel } from '../model_entity_mappers/show-segment-slot';
import { buildWhereClauseForShowSegmentSlot } from '../where_clauses/show-segment-slot';

export class ShowSegmentSlotRepository extends PrismaBaseRepository implements IShowSegmentSlotRepository {
  async findById(id: string): Promise<ShowSegmentSlotEntity | null> {
    const slot = await this.prisma.showSegmentSlot.findUnique({
      where: { id },
      include: { show: true, customer: true },
    });
    return slot ? modelToEntity(slot) : null;
  }

  async findByShowAndCustomer(showId: string, customerId: string): Promise<ShowSegmentSlotEntity | null> {
    const slot = await this.prisma.showSegmentSlot.findFirst({
      where: { showId, customerId },
    });
    return slot ? modelToEntity(slot) : null;
  }


  async findMany(query: QueryOptions<ShowSegmentSlotEntity>): Promise<ShowSegmentSlotEntity[]> {
    const where = buildWhereClauseForShowSegmentSlot(query.filters ?? {});
    const list = await this.prisma.showSegmentSlot.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      include: { show: true, customer: true },
    });
    return list.map(modelToEntity);
  }

  async count(filters?: Partial<ShowSegmentSlotEntity>): Promise<number> {
    const where = buildWhereClauseForShowSegmentSlot(filters ?? {});
    return this.prisma.showSegmentSlot.count({ where });
  }

  async create(data: Omit<ShowSegmentSlotEntity, 'id'>): Promise<ShowSegmentSlotEntity> {
    const entity = data as ShowSegmentSlotEntity;
    const createData = entityToModel(entity);
    const { id: _omit, ...rest } = createData;
    const saved = await this.prisma.showSegmentSlot.create({ data: rest });
    return modelToEntity(saved);
  }

  async update(entity: ShowSegmentSlotEntity): Promise<ShowSegmentSlotEntity | null> {
    if (!entity.id) return null;
    const updateData = entityToModel(entity);
    const { id: _omit, ...rest } = updateData;
    const updated = await this.prisma.showSegmentSlot.update({
      where: { id: entity.id },
      data: rest,
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<ShowSegmentSlotEntity | null> {
    try {
      const deleted = await this.prisma.showSegmentSlot.delete({ where: { id } });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }
}
