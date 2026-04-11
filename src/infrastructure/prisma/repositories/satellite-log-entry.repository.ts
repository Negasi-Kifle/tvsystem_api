import { ISatelliteLogEntryRepository } from '../../../domain/repositories/satellite-log-entry.repository.interface';
import { SatelliteLogEntryEntity, SatelliteLogMatchType } from '../../../domain/entities/satellite-log-entry.entity';
import { PrismaBaseRepository } from './base.repository';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class SatelliteLogEntryRepository extends PrismaBaseRepository implements ISatelliteLogEntryRepository {
  async create(data: Omit<SatelliteLogEntryEntity, 'id'>): Promise<SatelliteLogEntryEntity> {
    const saved = await this.prisma.satelliteLogEntry.create({
      data: {
        satelliteLogUploadId: data.satelliteLogUploadId,
        broadcastDateTime: data.broadcastDateTime,
        hexId: data.hexId,
        description: data.description,
        durationSeconds: data.durationSeconds,
        matchedPlacementId: data.matchedPlacementId,
        matchType: data.matchType,
      },
    });
    return this.toEntity(saved);
  }

  async createMany(entities: SatelliteLogEntryEntity[]): Promise<{ count: number }> {
    const result = await this.prisma.satelliteLogEntry.createMany({
      data: entities.map((e) => ({
        satelliteLogUploadId: e.satelliteLogUploadId,
        broadcastDateTime: e.broadcastDateTime,
        hexId: e.hexId,
        description: e.description,
        durationSeconds: e.durationSeconds,
        matchedPlacementId: e.matchedPlacementId,
        matchType: e.matchType,
      })),
    });
    return { count: result.count };
  }

  async findById(id: string): Promise<SatelliteLogEntryEntity | null> {
    const row = await this.prisma.satelliteLogEntry.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByUploadId(uploadId: string): Promise<SatelliteLogEntryEntity[]> {
    const rows = await this.prisma.satelliteLogEntry.findMany({
      where: { satelliteLogUploadId: uploadId },
      orderBy: { broadcastDateTime: 'asc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findMany(query: QueryOptions<SatelliteLogEntryEntity>): Promise<SatelliteLogEntryEntity[]> {
    const rows = await this.prisma.satelliteLogEntry.findMany({
      skip: query.skip ?? 0,
      take: query.take ?? 100,
      orderBy: { broadcastDateTime: 'asc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(): Promise<number> {
    return this.prisma.satelliteLogEntry.count();
  }

  async update(entity: SatelliteLogEntryEntity): Promise<SatelliteLogEntryEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.satelliteLogEntry.update({
      where: { id: entity.id },
      data: {
        matchedPlacementId: entity.matchedPlacementId,
        matchType: entity.matchType,
      },
    });
    return this.toEntity(updated);
  }

  async deleteById(id: string): Promise<SatelliteLogEntryEntity | null> {
    const row = await this.prisma.satelliteLogEntry.delete({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: any): SatelliteLogEntryEntity {
    return new SatelliteLogEntryEntity(
      row.satelliteLogUploadId,
      row.broadcastDateTime,
      row.hexId,
      row.description,
      row.durationSeconds,
      row.matchedPlacementId,
      row.matchType as SatelliteLogMatchType,
      row.createdAt,
      row.id,
    );
  }
}
