import { Compensation } from '@prisma/client';
import { Compensation as DomainCompensation } from '../../../../domain/entities/compensation.entity';
import { PrismaBaseRepository } from './base.repository';

export class CompensationRepository extends PrismaBaseRepository {
  /**
   * Map Prisma Compensation to Domain Compensation
   */
  private toDomain(compensation: Compensation): DomainCompensation {
    return {
      id: compensation.id,
      advertId: compensation.advertId,
      proposal: compensation.proposal,
      status: compensation.status as DomainCompensation['status'],
      customerResponse: compensation.customerResponse ?? undefined,
      createdAt: compensation.createdAt
    };
  }

  /**
   * Create a new compensation record
   */
  async createCompensation(
    data: Omit<DomainCompensation, 'id'>
  ): Promise<DomainCompensation> {
    const compensation = await this.prisma.compensation.create({
      data: {
        advertId: data.advertId,
        proposal: data.proposal,
        status: data.status,
        customerResponse: data.customerResponse
      }
    });
    return this.toDomain(compensation);
  }

  /**
   * Find compensation by ID
   */
  async findById(id: string): Promise<DomainCompensation | null> {
    const compensation = await this.prisma.compensation.findUnique({
      where: { id }
    });
    return compensation ? this.toDomain(compensation) : null;
  }

  /**
   * Find compensations by advert ID
   */
  async findByAdvertId(advertId: string): Promise<DomainCompensation[]> {
    const compensations = await this.prisma.compensation.findMany({
      where: { advertId },
      orderBy: { createdAt: 'desc' }
    });
    return compensations.map((comp) => this.toDomain(comp));
  }

  /**
   * Find compensations by status
   */
  async findByStatus(
    status: DomainCompensation['status']
  ): Promise<DomainCompensation[]> {
    const compensations = await this.prisma.compensation.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });
    return compensations.map((comp) => this.toDomain(comp));
  }

  /**
   * Update compensation status and customer response
   */
  async updateStatus(
    id: string,
    status: DomainCompensation['status'],
    customerResponse?: string
  ): Promise<DomainCompensation | null> {
    const existing = await this.prisma.compensation.findUnique({
      where: { id }
    });

    if (!existing) {
      return null;
    }

    const compensation = await this.prisma.compensation.update({
      where: { id },
      data: {
        status,
        ...(customerResponse !== undefined && { customerResponse })
      }
    });

    return this.toDomain(compensation);
  }
}
