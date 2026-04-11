import { RevenueShareEntity, RevenueShareStatus } from '../../../domain/entities/revenue-share.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { RevenueShareType } from '../../../domain/enums/revenue-share-type.enum';
import { IRevenueShareRepository } from '../../../domain/repositories/revenue-share.repository.interface';
import { IAdvertSalesRepository } from '../../../domain/repositories/adver-sales.repository.interface';
import { IAdvertPackageRepository } from '../../../domain/repositories/advert-package.repository.interface';
import { IShowHostRepository } from '../../../domain/repositories/show-host.repository.interface';

export class CalculateRevenueSharesUseCase {
  constructor(
    private readonly revenueShareRepo: IRevenueShareRepository,
    private readonly advertSalesRepo: IAdvertSalesRepository,
    private readonly advertPackageRepo: IAdvertPackageRepository,
    private readonly showHostRepo: IShowHostRepository,
  ) {}

  async execute(advertSalesId: string): Promise<RevenueShareEntity[]> {
    const sale = await this.advertSalesRepo.findById(advertSalesId);
    if (!sale) {
      throw new EntityNotFoundError('Advert sale not found', 'AdvertSales', advertSalesId);
    }

    const adPackage = await this.advertPackageRepo.findById(sale.adPackageId);
    if (!adPackage) {
      throw new EntityNotFoundError('Advert package not found', 'AdvertPackage', sale.adPackageId);
    }

    const showIds = adPackage.showIds;
    const shares: RevenueShareEntity[] = [];

    for (const showId of showIds) {
      const showHosts = await this.showHostRepo.findMany({
        filters: { showId } as any,
        take: 100,
      });

      for (const host of showHosts) {
        if (!host.revenueShareValue || host.revenueShareValue <= 0) continue;
        if (!host.userId) continue;

        let shareAmount = 0;
        const perShowAmount = sale.finalPrice / showIds.length;

        if (host.revenueShareType === RevenueShareType.Percentage) {
          shareAmount = Math.round(perShowAmount * (host.revenueShareValue / 100) * 100) / 100;
        } else {
          shareAmount = host.revenueShareValue;
        }

        // TODO: look up the partner associated with this user via user.partnerId
        const partnerId = host.userId;

        const entity = new RevenueShareEntity(
          advertSalesId,
          partnerId,
          host.revenueShareValue,
          shareAmount,
          RevenueShareStatus.Pending,
          host.id,
        );

        const created = await this.revenueShareRepo.create(entity);
        shares.push(created);
      }
    }

    return shares;
  }
}
