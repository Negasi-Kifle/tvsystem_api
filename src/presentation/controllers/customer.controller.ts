import { Request, Response, NextFunction } from 'express';
import { CreateCustomerUseCase } from '../../application/use-cases/customers/create-customer.use-case';
import { UpdateCustomerUseCase } from '../../application/use-cases/customers/update-customer.use-case';
import { GetCustomerByIdUseCase } from '../../application/use-cases/customers/get-customer-by-id.use-case';
import { FetchAllCustomersUseCase } from '../../application/use-cases/customers/fetch-all-customers.use-case';
import { CountCustomersUseCase } from '../../application/use-cases/customers/count-customers.use-case';
import { mapFetchAllCustomersDtoToQueryOptions } from '../mappers/customer-to-query-options.mapper';
import { CreateCustomerDto } from '../dtos/requests/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/requests/customer/update-customer.dto';
import { FetchAllCustomersDto } from '../dtos/requests/customer/fetch-all-customers.dto';
import { DeleteByIdUseCase } from '../../application/use-cases/customers/delete-by-id.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCustomerHandlers(
  deps: Pick<
    ApiRouterDeps,
    'customerRepository' | 'mediaMonitoringRecordRepository' | 'generateBusinessRefService'
  >,
) {
  const {
    customerRepository: customerRepo,
    mediaMonitoringRecordRepository: mediaMonitoringRepo,
    generateBusinessRefService
  } = deps;

  const createCustomerUseCase = new CreateCustomerUseCase(customerRepo, generateBusinessRefService);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepo, mediaMonitoringRepo);
  const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepo);
  const fetchAllCustomersUseCase = new FetchAllCustomersUseCase(customerRepo);
  const countCustomersUseCase = new CountCustomersUseCase(customerRepo);
  const deleteCustomerByIdUseCase = new DeleteByIdUseCase(customerRepo);

  async function createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateCustomerDto;
      const customer = await createCustomerUseCase.execute(payload);

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Customer created successfully',
        data: { customer },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateCustomerDto;

      const customer = await updateCustomerUseCase.execute(id, payload);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Customer updated successfully',
        data: { customer },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const customer = await getCustomerByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { customer },
      });
    } catch (error) {
      next(error);
    }
  }

  async function fetchAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = res.locals.query as FetchAllCustomersDto;
      const queryOptions = mapFetchAllCustomersDtoToQueryOptions(dto);

      const page = dto.page ?? 1;
      const limit = dto.limit ?? 10;

      const [customers, total] = await Promise.all([
        fetchAllCustomersUseCase.execute(queryOptions),
        countCustomersUseCase.execute(queryOptions.filters),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { customers },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteCustomerByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    createCustomer,
    updateCustomer,
    getCustomerById,
    fetchAllCustomers,
    deleteCustomerById,
  };
}
