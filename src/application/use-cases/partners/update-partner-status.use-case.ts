import { PartnerEntity } from "../../../domain/entities/partner.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { EntityNotFoundError } from "../../../domain/errors";
import { IPartnerRepository } from "../../../domain/repositories/partner.repo";
import { IUserRepository } from "../../../domain/repositories/user.repo";

export class UpdatePartnerStatusUseCase {
    constructor(
        private readonly partnerRepository: IPartnerRepository,
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(id: string, isActive: boolean): Promise<{ partner: PartnerEntity, user: UserEntity }> {
        const partner = await this.partnerRepository.findById(id);
        if (!partner) {
            throw new EntityNotFoundError('Partner not found', 'Partner', id);
        }

        const users = await this.userRepository.findMany({ filters: { partnerId: id } });
        if (!users || users.length === 0) {
            throw new EntityNotFoundError('User not found', 'User', id);
        }

        const updatedPartner = partner.updateInstance(undefined, isActive);
        const updatedUser = users[0]!.updateInstance(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            isActive,
        );

        return this.partnerRepository.updatePartnerAndUserStatus(updatedPartner, updatedUser);
    }
}
