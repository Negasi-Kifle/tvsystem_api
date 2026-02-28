import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';
import { ShowEntity } from '../../../domain/entities/show.entity';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';

export class GetShowByIdUseCase {
    constructor(private readonly showRepo: IShowRepository) { }

    async execute(id: string): Promise<ShowEntity> {
        const show = await this.showRepo.findById(id);
        
        if (!show) throw new EntityNotFoundError('Show not found', 'Show', id);
        
        return show;
    }
}