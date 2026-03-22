import { Request, Response, NextFunction } from 'express';
import { CustomerRepository } from '../../infrastructure/prisma/repositories/customer.repository';
import { MediaMonitoringRecordRepository } from '../../infrastructure/prisma/repositories/media-monitoring-record.repository';
import { CreateCustomerUseCase } from '../../application/use-cases/customers/create-customer.use-case';
import { UpdateCustomerUseCase } from '../../application/use-cases/customers/update-customer.use-case';
import { GetCustomerByIdUseCase } from '../../application/use-cases/customers/get-customer-by-id.use-case';
import { FetchAllCustomersUseCase } from '../../application/use-cases/customers/fetch-all-customers.use-case';
import { CountCustomersUseCase } from '../../application/use-cases/customers/count-customers.use-case';
import { mapFetchAllCustomersDtoToQueryOptions } from '../mappers/customer-to-query-options.mapper';
import { CreateCustomerDto } from '../dtos/requests/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/requests/customer/update-customer.dto';
import { FetchAllCustomersDto } from '../dtos/requests/customer/fetch-all-customers.dto';
import { GenerateBusinessRefService } from '../../infrastructure/services/generate-business-ref.service';
import { DeleteByIdUseCase } from '../../application/use-cases/customers/delete-by-id.use-case';

const customerRepo = new CustomerRepository();
const mediaMonitoringRepo = new MediaMonitoringRecordRepository();
const generateBusinessRefService = new GenerateBusinessRefService();

const createCustomerUseCase = new CreateCustomerUseCase(customerRepo, generateBusinessRefService);
const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepo, mediaMonitoringRepo);
const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepo);
const fetchAllCustomersUseCase = new FetchAllCustomersUseCase(customerRepo);
const countCustomersUseCase = new CountCustomersUseCase(customerRepo);
const deleteCustomerByIdUseCase = new DeleteByIdUseCase(customerRepo);


export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as CreateCustomerDto;
    const customer = await createCustomerUseCase.execute({
      name: payload.name,
      contacts: payload.contacts,
      industry: payload.industry,
      categoryId: payload.categoryId,
      subCategoryId: payload.subCategoryId,
      location: payload.location,
      salesAgentId: payload.salesAgentId,
      nextReviewDate: payload.nextReviewDate,
      status: payload.status,
      holidayStatus: payload.holidayStatus,
      studioVisit: payload.studioVisit,
      otherMediaCampaign: payload.otherMediaCampaign,
      sourceFromMediaMonitoring: payload.sourceFromMediaMonitoring,
      inPersonUpdate: payload.inPersonUpdate,
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Customer created successfully',
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as UpdateCustomerDto;

    const updatePayload: Parameters<UpdateCustomerUseCase['execute']>[1] = {};
    if (payload.name !== undefined) updatePayload.name = payload.name;
    if (payload.industry !== undefined) updatePayload.industry = payload.industry;
    if (payload.categoryId !== undefined) updatePayload.categoryId = payload.categoryId ?? undefined;
    if (payload.subCategoryId !== undefined) updatePayload.subCategoryId = payload.subCategoryId ?? undefined;
    if (payload.location !== undefined) updatePayload.location = payload.location;
    if (payload.salesAgentId !== undefined) updatePayload.salesAgentId = payload.salesAgentId ?? undefined;
    if (payload.nextReviewDate !== undefined) updatePayload.nextReviewDate = payload.nextReviewDate ?? undefined;
    if (payload.status !== undefined) updatePayload.status = payload.status;
    if (payload.holidayStatus !== undefined) updatePayload.holidayStatus = payload.holidayStatus;
    if (payload.studioVisit !== undefined) updatePayload.studioVisit = payload.studioVisit;
    if (payload.otherMediaCampaign !== undefined) updatePayload.otherMediaCampaign = payload.otherMediaCampaign;
    if (payload.inPersonUpdate !== undefined) updatePayload.inPersonUpdate = payload.inPersonUpdate ?? undefined;
    if (payload.contacts !== undefined) updatePayload.contacts = payload.contacts;

    const customer = await updateCustomerUseCase.execute(id, updatePayload);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Customer updated successfully',
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomerById(req: Request, res: Response, next: NextFunction) {
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

export async function fetchAllCustomers(req: Request, res: Response, next: NextFunction) {
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


export async function deleteCustomerById(req: Request, res: Response, next: NextFunction) {
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