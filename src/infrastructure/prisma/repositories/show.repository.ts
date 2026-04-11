
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { ShowEntity } from '../../../domain/entities/show.entity';
import { PrismaBaseRepository } from './base.repository';
import { ShowType } from '../../../domain/enums/show-type.enum';
import { entityToModel, modelToEntity } from '../model_entity_mappers/show';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { buildWhereClauseForShow } from '../where_clauses/show';
import { ShowHostEntity } from '../../../domain/entities/show-host.entity';
import {entityToModel as entityToModelShowHost} from '../model_entity_mappers/show-host';
import { Prisma } from '../generated/client';

export class ShowRepository extends PrismaBaseRepository implements IShowRepository {

  async create(data: ShowEntity): Promise<ShowEntity> {
    const showModel = entityToModel(data);

    // Omit id so DB generates it via @default(uuid())
    const { id: _omit, ...createData } = showModel;
    const savedShow = await this.prisma.show.create({ data: createData });
    return modelToEntity(savedShow);
  }

  async findById(id: string): Promise<ShowEntity | null> {
    const show = await this.prisma.show.findUnique({ where: { id }, include: {showHosts: true} });
    return show ? modelToEntity(show) : null;
  }

  async findMany(query: QueryOptions<ShowEntity>): Promise<ShowEntity[]> {
    const where = buildWhereClauseForShow(query.filters ?? {});
    console.log("WHERE: ", where);
    const shows = await this.prisma.show.findMany(
      {
        where,
        skip: query.skip ?? 0,
        take: query.take ?? 10,
        include: {showHosts: true}
      });
    return shows.map(modelToEntity);
  }

  async update(entity: ShowEntity): Promise<ShowEntity | null> {
    const show = await this.prisma.show.update({
      where: { id: entity.id },
      data: entityToModel(entity)
    });

    return modelToEntity(show);
  }


  async deleteById(id: string): Promise<ShowEntity | null> {
    const show = await this.prisma.show.delete({ where: { id } });
    return show ? modelToEntity(show) : null;
  }

  async findByTitleSlug(titleSlug: string): Promise<ShowEntity | null> {
    const show = await this.prisma.show.findUnique({ where: { titleSlug } });
    return show ? modelToEntity(show) : null;
  }


  async count(filters?: Partial<ShowEntity>): Promise<number> {
    return this.prisma.show.count({ where: buildWhereClauseForShow(filters ?? {}) });
  }

async createWithHosts(show: ShowEntity, hosts: ShowHostEntity[]): Promise<ShowEntity> {
  return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const savedShow = await tx.show.create({ data: entityToModel(show) });
    
    await tx.showHost.createMany({
      data: hosts.map(host => ({
        ...entityToModelShowHost(host),
        showId: savedShow.id,
      }))
    });
    
    return modelToEntity(savedShow);
  });
}

}
