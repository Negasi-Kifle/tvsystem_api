import { Prisma, Show } from '@prisma/client';
import { ShowRepositoryInterface } from '../../../domain/repositories/show.repository.interface';
import { Show as DomainShow } from '../../../domain/entities/show.entity';
import { PrismaBaseRepository } from './base.repository';

type ScheduleItem = { day: string; startTime: string; endTime: string };

export class ShowRepository extends PrismaBaseRepository implements ShowRepositoryInterface {
  /**
   * Map Prisma Show to Domain Show
   */
  private toDomain(show: Show): DomainShow {
    return {
      id: show.id,
      title: show.title,
      type: show.type as DomainShow['type'],
      durationMinutes: show.durationMinutes,
      maxAdLengthSeconds: show.maxAdLengthSeconds,
      schedule: (show.schedule as ScheduleItem[]) || [],
      assignedStaff: show.assignedStaff ?? undefined,
      createdAt: show.createdAt
    };
  }

  /**
   * Create a new show
   */
  async create(data: Omit<DomainShow, 'id'>): Promise<DomainShow> {
    const show = await this.prisma.show.create({
      data: {
        title: data.title,
        type: data.type,
        durationMinutes: data.durationMinutes,
        maxAdLengthSeconds: data.maxAdLengthSeconds,
        schedule: data.schedule as Prisma.InputJsonValue,
        assignedStaff: data.assignedStaff
      }
    });
    return this.toDomain(show);
  }

  /**
   * Find show by ID
   */
  async findById(id: string): Promise<DomainShow | null> {
    const show = await this.prisma.show.findUnique({
      where: { id }
    });
    return show ? this.toDomain(show) : null;
  }

  /**
   * List all shows
   */
  async list(): Promise<DomainShow[]> {
    const shows = await this.prisma.show.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return shows.map((show) => this.toDomain(show));
  }

  /**
   * Update show by ID
   */
  async updateById(
    id: string,
    update: Partial<DomainShow>
  ): Promise<DomainShow | null> {
    const existing = await this.prisma.show.findUnique({
      where: { id }
    });

    if (!existing) {
      return null;
    }

    const show = await this.prisma.show.update({
      where: { id },
      data: {
        ...(update.title !== undefined && { title: update.title }),
        ...(update.type !== undefined && { type: update.type }),
        ...(update.durationMinutes !== undefined && {
          durationMinutes: update.durationMinutes
        }),
        ...(update.maxAdLengthSeconds !== undefined && {
          maxAdLengthSeconds: update.maxAdLengthSeconds
        }),
        ...(update.schedule !== undefined && {
          schedule: update.schedule as Prisma.InputJsonValue
        }),
        ...(update.assignedStaff !== undefined && { assignedStaff: update.assignedStaff })
      }
    });

    return this.toDomain(show);
  }

  /**
   * Delete show by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const existing = await this.prisma.show.findUnique({
      where: { id }
    });

    if (!existing) {
      return false;
    }

    await this.prisma.show.delete({ where: { id } });
    return true;
  }
}
