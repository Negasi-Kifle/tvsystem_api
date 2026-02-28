import { IShowRepository } from "../../../domain/repositories/show.repository.interface";
import { ShowEntity } from "../../../domain/entities/show.entity";
import { EntityNotFoundError } from "../../../domain/errors";



export class DeleteShowUseCase {
    constructor(private readonly showRepo: IShowRepository) { }

    async execute(id: string): Promise<ShowEntity | null> {
        const show = await this.showRepo.findById(id);
        if (!show) throw new EntityNotFoundError('Show not found', 'Show', id);

        return await this.showRepo.deleteById(id);
    }
}