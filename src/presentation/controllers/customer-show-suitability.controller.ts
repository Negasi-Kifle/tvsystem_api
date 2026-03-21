import { Request, Response, NextFunction } from 'express';
import { CustomerShowSuitabilityRepository } from '../../infrastructure/prisma/repositories/customer-show-suitability.repository';
import { CustomerRepository } from '../../infrastructure/prisma/repositories/customer.repository';
import { ShowSegmentSlotRepository } from '../../infrastructure/prisma/repositories/show-segment-slot.repository';
import { LinkCustomerToShowSlotUseCase } from '../../application/use-cases/customer-show-suitability/link-customer-to-show-slot.use-case';
import { LinkCustomerToShowSlotDto } from '../dtos/requests/customer-show-suitability/link-customer-to-show-slot.dto';

const suitabilityRepo = new CustomerShowSuitabilityRepository();
const customerRepo = new CustomerRepository();
const showSegmentSlotRepo = new ShowSegmentSlotRepository();

const linkCustomerToShowSlotUseCase = new LinkCustomerToShowSlotUseCase(
  suitabilityRepo,
  customerRepo,
  showSegmentSlotRepo,
);

export async function linkCustomerToShowSlot(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as LinkCustomerToShowSlotDto;
    const suitability = await linkCustomerToShowSlotUseCase.execute({
      customerId: payload.customerId,
      showSegmentSlotId: payload.showSegmentSlotId,
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Customer linked to show slot successfully',
      data: { suitability },
    });
  } catch (error) {
    next(error);
  }
}
