import { Request, Response, NextFunction } from 'express';
import { LinkCustomerToShowSlotUseCase } from '../../application/use-cases/customer-show-suitability/link-customer-to-show-slot.use-case';
import { LinkCustomerToShowSlotDto } from '../dtos/requests/customer-show-suitability/link-customer-to-show-slot.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCustomerShowSuitabilityHandlers(
  deps: Pick<
    ApiRouterDeps,
    'customerShowSuitabilityRepository' | 'customerRepository' | 'showSegmentSlotRepository'
  >,
) {
  const {
    customerShowSuitabilityRepository,
    customerRepository,
    showSegmentSlotRepository,
  } = deps;

  const linkCustomerToShowSlotUseCase = new LinkCustomerToShowSlotUseCase(
    customerShowSuitabilityRepository,
    customerRepository,
    showSegmentSlotRepository,
  );

  async function linkCustomerToShowSlot(req: Request, res: Response, next: NextFunction) {
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

  return { linkCustomerToShowSlot };
}
