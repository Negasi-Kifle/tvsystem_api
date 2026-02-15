import { TelegramGroupEntity } from "../entities/telegram-groups.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface ITelegramGroupRepository extends IBaseRepository<TelegramGroupEntity> {
}