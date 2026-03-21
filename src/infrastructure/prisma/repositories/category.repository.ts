import { PrismaBaseRepository } from './base.repository';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { CategoryEntity } from '../../../domain/entities/category.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { modelToEntity, entityToModel } from '../model_entity_mappers/category';
import { buildWhereClauseForCategory } from '../where_clauses/category';

export class CategoryRepository extends PrismaBaseRepository implements ICategoryRepository {
  async findById(id: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category ? modelToEntity(category) : null;
  }

  async findByNameSlug(nameSlug: string): Promise<CategoryEntity | null> {
    const category = await this.prisma.category.findUnique({ where: { nameSlug } });
    return category ? modelToEntity(category) : null;
  }

  async findMany(query: QueryOptions<CategoryEntity>): Promise<CategoryEntity[]> {
    const where = buildWhereClauseForCategory(query.filters ?? {});
    const list = await this.prisma.category.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
    });
    return list.map(modelToEntity);
  }

  async count(filters?: Partial<CategoryEntity>): Promise<number> {
    const where = buildWhereClauseForCategory(filters ?? {});
    return this.prisma.category.count({ where });
  }

  async create(data: Omit<CategoryEntity, 'id'>): Promise<CategoryEntity> {
    const entity = data as CategoryEntity;
    const createData = entityToModel(entity);
    const { id: _omit, ...rest } = createData;
    const saved = await this.prisma.category.create({ data: rest });
    return modelToEntity(saved);
  }

  async update(entity: CategoryEntity): Promise<CategoryEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.category.update({
      where: { id: entity.id },
      data: entityToModel(entity),
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<CategoryEntity | null> {
    try {
      const deleted = await this.prisma.category.delete({ where: { id } });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }
}
