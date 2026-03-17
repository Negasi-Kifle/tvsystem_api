import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { EntityAlreadyExistsError, EntityNotFoundError } from "../../../domain/errors";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";

export type UpdateMediaPackInput = {
    version?: string;
    versionSlug?: string;
    description?: string;
    isActive?: boolean;
}

export class UpdateMediaPackUseCase {
    constructor(private readonly mediaPackRepository: IMediaPackRepository) { }

    async execute(id: string, payload: UpdateMediaPackInput): Promise<MediaPackEntity | null> {
        const mediaPack = await this.mediaPackRepository.findById(id);
        if (!mediaPack) {
            throw new EntityNotFoundError('Media pack not found', 'MediaPack', id);
        }

        const versionSlug = payload.version ? payload.version.toLowerCase().replace(/ /g, '-') : mediaPack.versionSlug;
        if (payload.versionSlug !== undefined && versionSlug !== mediaPack.versionSlug) {
            const existing = await this.mediaPackRepository.findByVersionSlug(versionSlug);
            if (existing && existing.id !== id) {
                throw new EntityAlreadyExistsError(
                    'Media pack with this version already exists',
                    'MediaPack',
                    versionSlug
                );
            }
        }

        const updated = mediaPack.updateInstance(
            payload.version,
            versionSlug,
            payload.description,
            payload.isActive
        );
        return await this.mediaPackRepository.update(updated);
    }
}
