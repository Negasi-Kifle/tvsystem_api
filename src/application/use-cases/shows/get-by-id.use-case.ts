import { ShowEntity } from "../../../domain/entities/show.entity";
import { IShowRepository } from "../../../domain/repositories/show.repository.interface";

export class GetShowByIdUseCase {
    constructor(private readonly showRepo: IShowRepository) { }

    async execute(id: string): Promise<ShowEntity | null> {
        const show = await this.showRepo.findById(id);

        if (!show) throw new Error('Show not found')

        return show;
    }
}