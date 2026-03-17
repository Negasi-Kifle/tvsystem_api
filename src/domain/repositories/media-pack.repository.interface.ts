import { MediaPackEntity } from "../entities/media-pack.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IMediaPackRepository extends IBaseRepository<MediaPackEntity> {
    findByVersionSlug(versionSlug: string): Promise<MediaPackEntity | null>;
}