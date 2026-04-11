import { ISatelliteLogUploadRepository } from '../../../domain/repositories/satellite-log-upload.repository.interface';
import { SatelliteLogUploadEntity, SatelliteLogUploadStatus } from '../../../domain/entities/satellite-log-upload.entity';
import { PrismaBaseRepository } from './base.repository';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class SatelliteLogUploadRepository extends PrismaBaseRepository implements ISatelliteLogUploadRepository {
  async create(data: Omit<SatelliteLogUploadEntity, 'id'>): Promise<SatelliteLogUploadEntity> {
    const saved = await this.prisma.satelliteLogUpload.create({
      data: {
        logDate: data.logDate,
        uploadedById: data.uploadedById,
        fileName: data.fileName,
        status: data.status,
      },
    });
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<SatelliteLogUploadEntity | null> {
    const row = await this.prisma.satelliteLogUpload.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findMany(query: QueryOptions<SatelliteLogUploadEntity>): Promise<SatelliteLogUploadEntity[]> {
    const rows = await this.prisma.satelliteLogUpload.findMany({
      skip: query.skip ?? 0,
      take: query.take ?? 10,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(): Promise<number> {
    return this.prisma.satelliteLogUpload.count();
  }

  async update(entity: SatelliteLogUploadEntity): Promise<SatelliteLogUploadEntity | null> {
    if (!entity.id) return null;
    const updated = await this.prisma.satelliteLogUpload.update({
      where: { id: entity.id },
      data: { status: entity.status },
    });
    return this.toEntity(updated);
  }

  async deleteById(id: string): Promise<SatelliteLogUploadEntity | null> {
    const row = await this.prisma.satelliteLogUpload.delete({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  private toEntity(row: any): SatelliteLogUploadEntity {
    return new SatelliteLogUploadEntity(
      row.logDate,
      row.uploadedById,
      row.fileName,
      row.status as SatelliteLogUploadStatus,
      row.createdAt,
      row.updatedAt,
      row.id,
    );
  }
}
