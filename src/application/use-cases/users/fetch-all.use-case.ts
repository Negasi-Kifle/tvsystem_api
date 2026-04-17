import { UserEntity } from '../../../domain/entities/user.entity';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';
import { IUserRepository } from '../../../domain/repositories/user.repo';

export class FetchAllUsersUseCase {
    constructor(private readonly userRepo: IUserRepository) { }

    async execute(query: QueryOptions<UserEntity, Partial<UserEntity>>): Promise<UserEntity[]> {
        console.log("query", query.filters?.roles);
        return await this.userRepo.findMany(query);
    }
}