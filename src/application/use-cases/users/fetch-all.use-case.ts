import { UserRepository, UserQueryOptions, UserFilter } from '../../../infrastructure/database/prisma/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { FetchAllUsersDto } from '../../../presentation/dtos/requests/fetch-all-users.dto';

export class FetchAllUsersUseCase {
    constructor(private readonly userRepo = new UserRepository()) { }

    async execute(query: FetchAllUsersDto): Promise<User[]> {
        // Build filters from query params
        const filters: UserFilter = {
            ...(query.email && { email: query.email }),
            ...(query.phoneNumber && { phoneNumber: query.phoneNumber }),
            ...(query.roles && { roles: query.roles }),
            ...(query.isActive !== undefined && { isActive: query.isActive }),
            ...(query.sex && { sex: query.sex })
        };

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const users = await this.userRepo.findMany({
            skip: (page - 1) * limit,
            take: limit,
            filters
        });
        
        return users;
    }
}