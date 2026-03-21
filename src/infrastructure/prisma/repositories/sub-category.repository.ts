import { PrismaBaseRepository } from './base.repository';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';
import { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { modelToEntity, entityToModel } from '../model_entity_mappers/sub-category';
import { buildWhereClauseForSubCategory } from '../where_clauses/sub-category';

export class SubCategoryRepository extends PrismaBaseRepository implements ISubCategoryRepository {
  async findById(id: string): Promise<SubCategoryEntity | null> {
    const subCategory = await this.prisma.subCategory.findUnique({ where: { id } });
    return subCategory ? modelToEntity(subCategory) : null;
  }

  async findByCategoryAndSlug(categoryId: string, nameSlug: string): Promise<SubCategoryEntity | null> {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { categoryId_nameSlug: { categoryId, nameSlug } },
    });
    return subCategory ? modelToEntity(subCategory) : null;
  }

  async findMany(query: QueryOptions<SubCategoryEntity>): Promise<SubCategoryEntity[]> {
    const where = buildWhereClauseForSubCategory(query.filters ?? {});
    const list = await this.prisma.subCategory.findMany({
      where,
      skip: query.skip ?? 0,
      take: query.take ?? 10,
    });
    return list.map(modelToEntity);
  }

  async count(filters?: Partial<SubCategoryEntity>): Promise<number> {
    const where = buildWhereClauseForSubCategory(filters ?? {});
    return this.prisma.subCategory.count({ where });
  }

  async create(data: Omit<SubCategoryEntity, 'id'>): Promise<SubCategoryEntity> {
    const entity = data as SubCategoryEntity;
    const createData = entityToModel(entity);
    const { id: _omit, ...rest } = createData;
    const saved = await this.prisma.subCategory.create({ data: rest });
    return modelToEntity(saved);
  }

  async update(entity: SubCategoryEntity): Promise<SubCategoryEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.subCategory.update({
      where: { id: entity.id },
      data: entityToModel(entity),
    });
    return modelToEntity(updated);
  }

  async deleteById(id: string): Promise<SubCategoryEntity | null> {
    try {
      const deleted = await this.prisma.subCategory.delete({ where: { id } });
      return modelToEntity(deleted);
    } catch {
      return null;
    }
  }
}
