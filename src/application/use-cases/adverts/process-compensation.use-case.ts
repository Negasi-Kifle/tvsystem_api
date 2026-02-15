import { CompensationRepository } from '../../../infrastructure/prisma/repositories/compensation.repository';
import { Compensation } from '../../../domain/entities/compensation.entity';
import { EmailService } from '../../../infrastructure/external/email/email.service';

interface Payload {
  advertId: string;
  proposal: string;
  customerEmail?: string;
}

export class ProcessCompensationUseCase {
  constructor(
    private readonly repo = new CompensationRepository(),
    private readonly email = new EmailService()
  ) { }

  async execute(payload: Payload): Promise<Compensation> {
    const compensation = await this.repo.createCompensation({
      advertId: payload.advertId,
      proposal: payload.proposal,
      status: 'Proposed'
    });

    if (payload.customerEmail) {
      // TODO: send compensation proposal email with actionable link
      await this.email.send(
        payload.customerEmail,
        'Compensation Proposal',
        `Compensation proposed for advert ${payload.advertId}`
      );
    }

    return compensation;
  }
}
