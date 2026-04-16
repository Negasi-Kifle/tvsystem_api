import { AdvertSalesEntity } from "../entities/advert-sales.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IAdvertSalesRepository extends IBaseRepository<AdvertSalesEntity> {
  findCampaignsNeedingEndAlert(now: Date, windowEnd: Date): Promise<AdvertSalesEntity[]>;
}