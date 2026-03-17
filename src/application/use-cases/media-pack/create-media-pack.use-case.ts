import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";
import { EntityAlreadyExistsError } from "../../../domain/errors/entity-exists.error";



export type CreateMediaPackInput = {
    version: string;
    versionSlug: string;
    description?: string;
    isActive?: boolean;
}

export class CreateMediaPackUseCase {
    constructor(private readonly mediaPackRepository: IMediaPackRepository) { }

    async execute(payload: CreateMediaPackInput): Promise<MediaPackEntity> {
        // Check for duplicate
        const versionSlug = payload.versionSlug ?? payload.version.toLowerCase().replace(/ /g, '-');
        const duplicate = await this.mediaPackRepository.findByVersionSlug(versionSlug);
        if (duplicate) {
            throw new EntityAlreadyExistsError("Media pack with this version already exists", "MediaPack", versionSlug);
        }

        const mediaPackEntity = MediaPackEntity.createInstance(payload.version, versionSlug, payload.description, payload.isActive);
        return await this.mediaPackRepository.create(mediaPackEntity);
    }
}