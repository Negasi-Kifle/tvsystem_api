import { UserFilter, UserRepository } from '../../../infrastructure/database/prisma/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { FetchAllUsersDto } from '../../../presentation/dtos/requests/fetch-all-users.dto';

export class CountUsersUseCase {
    constructor(private readonly userRepo = new UserRepository()) { }

    async execute(query: FetchAllUsersDto): Promise<number> {
        // Build filters from query params
        const filters: UserFilter = {
            ...(query.email && { email: query.email }),
            ...(query.phoneNumber && { phoneNumber: query.phoneNumber }),
            ...(query.roles && { roles: query.roles }),
            ...(query.isActive !== undefined && { isActive: query.isActive }),
            ...(query.sex && { sex: query.sex })
        };
        return this.userRepo.count(filters);
    }
}