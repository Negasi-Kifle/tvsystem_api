import { MediaPackEntity } from "../../../domain/entities/media-pack.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IMediaPackRepository } from "../../../domain/repositories/media-pack.repository.interface";

export class DeleteMediaPackUseCase {
    constructor(private readonly mediaPackRepository: IMediaPackRepository) { }

    async execute(id: string): Promise<MediaPackEntity | null> {
        const mediaPack = await this.mediaPackRepository.findById(id);
        if (!mediaPack) {
            throw new EntityNotFoundError('Media pack not found', 'MediaPack', id);
        }

        const deleted = await this.mediaPackRepository.deleteById(id);
        if (!deleted) {
            throw new EntityNotFoundError('Media pack not found', 'MediaPack', id);
        }
        return deleted;
    }
}
