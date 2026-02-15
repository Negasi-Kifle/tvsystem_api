import { IUserRepository } from '../../../domain/repositories/user.repo';
import { UserEntity } from '../../../domain/entities/user.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class CountUsersUseCase {
    constructor(private readonly userRepo: IUserRepository) { }

    async execute(query: QueryOptions<UserEntity, Partial<UserEntity>>): Promise<number> {
        return await this.userRepo.count(query.filters ?? {});
    }
}