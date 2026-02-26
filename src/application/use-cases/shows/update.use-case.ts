import { IShowRepository } from "../../../domain/repositories/show.repository.interface";
import { ShowEntity } from "../../../domain/entities/show.entity";
import { ShowType } from "../../../domain/enums/show-type.enum";



export type UpdateShowPayload = {
    title?: string;
    titleSlug?: string;
    type?: ShowType;
    durationMinutes?: number;
    maxAdLengthMinutes?: number;
    host?: string;
};

export class UpdateShowUseCase {
    constructor(private readonly showRepo: IShowRepository) { }

    async execute(id: string, payload: UpdateShowPayload): Promise<ShowEntity | null> {
        const show = await this.showRepo.findById(id);
        if (!show) throw new Error('Show not found')

        // Check for duplicate title slug
        if (payload.titleSlug && payload.titleSlug !== show.titleSlug) {
            const duplicateShow = await this.showRepo.findByTitleSlug(payload.titleSlug);
            if (duplicateShow && duplicateShow.id !== id) {
                throw new Error('Show with this title slug already exists')
            }
        }

        const updatedShow = show.updateInstance(
            payload.title,
            payload.titleSlug,
            payload.type,
            payload.durationMinutes,
            payload.maxAdLengthMinutes,
            payload.host);

        return this.showRepo.update(updatedShow);
    }
}