import { Prisma, Advert } from '@prisma/client';
import { AdvertRepositoryInterface } from '../../../domain/repositories/advert.repository.interface';
import { Advert as DomainAdvert } from '../../../domain/entities/advert.entity';
import { PrismaBaseRepository } from './base.repository';

type SlotJson = { start: string; end: string } | null;

export class AdvertRepository extends PrismaBaseRepository implements AdvertRepositoryInterface {
  /**
   * Map Prisma Advert to Domain Advert
   */
  private toDomain(advert: Advert): DomainAdvert {
    const slot = advert.slot as SlotJson;
    return {
      id: advert.id,
      showId: advert.showId,
      customerId: advert.customerId,
      status: advert.status as DomainAdvert['status'],
      slot: slot
        ? {
          start: new Date(slot.start),
          end: new Date(slot.end)
        }
        : undefined,
      contractDetails: advert.contractDetails ?? undefined,
      createdAt: advert.createdAt
    };
  }

  /**
   * Create a new advert
   */
  async create(data: Omit<DomainAdvert, 'id'>): Promise<DomainAdvert> {
    const advert = await this.prisma.advert.create({
      data: {
        showId: data.showId,
        customerId: data.customerId,
        status: data.status,
        slot: data.slot
          ? ({ start: data.slot.start.toISOString(), end: data.slot.end.toISOString() } as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        contractDetails: data.contractDetails
      }
    });
    return this.toDomain(advert);
  }

  /**
   * Find advert by ID
   */
  async findById(id: string): Promise<DomainAdvert | null> {
    const advert = await this.prisma.advert.findUnique({
      where: { id }
    });
    return advert ? this.toDomain(advert) : null;
  }

  /**
   * Update advert by ID
   */
  async updateById(
    id: string,
    update: Partial<DomainAdvert>
  ): Promise<DomainAdvert | null> {
    const existing = await this.prisma.advert.findUnique({
      where: { id }
    });

    if (!existing) {
      return null;
    }

    const advert = await this.prisma.advert.update({
      where: { id },
      data: {
        ...(update.showId !== undefined && { showId: update.showId }),
        ...(update.customerId !== undefined && { customerId: update.customerId }),
        ...(update.status !== undefined && { status: update.status }),
        ...(update.slot !== undefined && {
          slot: update.slot
            ? ({ start: update.slot.start.toISOString(), end: update.slot.end.toISOString() } as Prisma.InputJsonValue)
            : Prisma.JsonNull
        }),
        ...(update.contractDetails !== undefined && {
          contractDetails: update.contractDetails
        })
      }
    });

    return this.toDomain(advert);
  }

  /**
   * List all adverts
   */
  async list(): Promise<DomainAdvert[]> {
    const adverts = await this.prisma.advert.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return adverts.map((advert) => this.toDomain(advert));
  }

  /**
   * Find adverts by show ID
   */
  async findByShowId(showId: string): Promise<DomainAdvert[]> {
    const adverts = await this.prisma.advert.findMany({
      where: { showId },
      orderBy: { createdAt: 'desc' }
    });
    return adverts.map((advert) => this.toDomain(advert));
  }

  /**
   * Find adverts by customer ID
   */
  async findByCustomerId(customerId: string): Promise<DomainAdvert[]> {
    const adverts = await this.prisma.advert.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    });
    return adverts.map((advert) => this.toDomain(advert));
  }

  /**
   * Find adverts by status
   */
  async findByStatus(status: string): Promise<DomainAdvert[]> {
    const adverts = await this.prisma.advert.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });
    return adverts.map((advert) => this.toDomain(advert));
  }
}
