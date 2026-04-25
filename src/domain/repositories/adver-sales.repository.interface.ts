import { AdvertSalesEntity } from "../entities/advert-sales.entity";
import { IBaseRepository } from "./base.repository.interface";
import type { TopShowEntry } from "../interfaces/analytics.interface";

export interface IAdvertSalesRepository extends IBaseRepository<AdvertSalesEntity> {
  findCampaignsNeedingEndAlert(now: Date, windowEnd: Date): Promise<AdvertSalesEntity[]>;
  /**
   * Returns top shows ranked by paid revenue (descending).
   * Revenue = sum of Paid bankDeposit for payments on sales with placements for that show.
   * Target  = sum of finalPrice for advert sales with placements for that show.
   * activeAdsCount = count of SCHEDULED placements for that show.
   */
  getTopShowsByRevenue(limit: number): Promise<TopShowEntry[]>;
}