import { NextFunction, Request, Response } from 'express';
import { CreateAdvertSalesUseCase } from '../../application/use-cases/advert-sales/create-advert-sales.use-case';
import { FetchAllAdvertSalesUseCase } from '../../application/use-cases/advert-sales/fetch-all-advert-sales.use-case';
import { CountAdvertSalesUseCase } from '../../application/use-cases/advert-sales/count-advert-sales.use-case';
import { GetAdvertSalesByIdUseCase } from '../../application/use-cases/advert-sales/get-advert-sales-by-id.use-case';
import { UpdateAdvertSalesUseCase } from '../../application/use-cases/advert-sales/update-advert-sales.use-case';
import { DeleteAdvertSalesUseCase } from '../../application/use-cases/advert-sales/delete-advert-sales.use-case';
import { GenerateAdvertScheduleUseCase } from '../../application/use-cases/advert-schedule/generate-advert-schedule.use-case';
import { GenerateAdvertReportUseCase } from '../../application/use-cases/advert-schedule/generate-advert-report.use-case';
import { SendScheduleEmailUseCase } from '../../application/use-cases/advert-schedule/send-schedule-email.use-case';
import { SendReportEmailUseCase } from '../../application/use-cases/advert-schedule/send-report-email.use-case';
import { SendScheduleToFinanceEmailUseCase } from '../../application/use-cases/advert-schedule/send-schedule-to-finance-email.use-case';
import { SendScheduleFileEmailUseCase } from '../../application/use-cases/advert-schedule/send-schedule-file-email.use-case';
import { SendReportFileEmailUseCase } from '../../application/use-cases/advert-schedule/send-report-file-email.use-case';
import { emailConfig } from '../../infrastructure/config/email.config';
import { mapFetchAllAdvertSalesDtoToQueryOptions } from '../mappers/advert-sales-to-query-options.mapper';
import type { CreateAdvertSalesDto } from '../dtos/requests/advert-sales/create.dto';
import type { UpdateAdvertSalesDto } from '../dtos/requests/advert-sales/update.dto';
import type { FetchAllAdvertSalesDto } from '../dtos/requests/advert-sales/fetch-all.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertSalesHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'advertSalesRepository'
    | 'advertPackageRepository'
    | 'advertPlacementRepository'
    | 'customerRepository'
    | 'generateBusinessRefService'
    | 'userRepository'
    | 'categoryRepository'
    | 'subCategoryRepository'
    | 'emailService'
    | 'advertPlacementRepository'
  >,
) {
  const {
    advertSalesRepository,
    advertPackageRepository,
    customerRepository,
    generateBusinessRefService,
    userRepository,
    categoryRepository,
    subCategoryRepository,
    advertPlacementRepository,
  } = deps;

  const createAdvertSalesUseCase = new CreateAdvertSalesUseCase(
    advertSalesRepository,
    advertPackageRepository,
    customerRepository,
    generateBusinessRefService,
    userRepository,
    categoryRepository,
    subCategoryRepository,
  );

  const fetchAllAdvertSalesUseCase = new FetchAllAdvertSalesUseCase(advertSalesRepository);
  const countAdvertSalesUseCase = new CountAdvertSalesUseCase(advertSalesRepository);
  const getAdvertSalesByIdUseCase = new GetAdvertSalesByIdUseCase(advertSalesRepository);
  const updateAdvertSalesUseCase = new UpdateAdvertSalesUseCase(
    advertSalesRepository,
    advertPackageRepository,
    customerRepository,
    userRepository,
    categoryRepository,
    subCategoryRepository,
  );
  const deleteAdvertSalesUseCase = new DeleteAdvertSalesUseCase(advertSalesRepository);

  const generateScheduleUseCase = new GenerateAdvertScheduleUseCase(
    advertSalesRepository,
    deps.advertPlacementRepository,
    advertPackageRepository,
    customerRepository,
  );
  const generateReportUseCase = new GenerateAdvertReportUseCase(
    advertSalesRepository,
    deps.advertPlacementRepository,
    advertPackageRepository,
    customerRepository,
  );
  const sendScheduleEmailUseCase = new SendScheduleEmailUseCase(
    generateScheduleUseCase,
    advertSalesRepository,
    customerRepository,
    deps.emailService,
    advertPlacementRepository,
  );
  const sendReportEmailUseCase = new SendReportEmailUseCase(
    generateReportUseCase,
    advertSalesRepository,
    customerRepository,
    deps.emailService,
  );
  const sendScheduleToFinanceEmailUseCase = new SendScheduleToFinanceEmailUseCase(
    advertSalesRepository,
    userRepository,
    deps.emailService,
    emailConfig.financeEmail,
  );
  const sendScheduleFileEmailUseCase = new SendScheduleFileEmailUseCase(
    advertSalesRepository,
    customerRepository,
    deps.emailService,
  );
  const sendReportFileEmailUseCase = new SendReportFileEmailUseCase(
    advertSalesRepository,
    customerRepository,
    deps.emailService,
  );

  async function create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateAdvertSalesDto;
      const salesRepId = req.user!.id!;

      const advertSales = await createAdvertSalesUseCase.execute({
        adPackageId: payload.adPackageId,
        customerId: payload.customerId,
        status: payload.status,
        advertType: payload.advertType,
        adStartDate: payload.adStartDate,
        adEndDate: payload.adEndDate,
        adLengthSeconds: payload.adLengthSeconds,
        numOfSlots: payload.numOfSlots,
        discountPercentage: payload.discountPercentage ?? 0,
        installmentCount: payload.installmentCount,
        campaignName: payload.campaignName,
        contractSignDate: payload.contractSignDate,
        salesRepId,
        categoryId: payload.categoryId,
        subCategoryId: payload.subCategoryId,
        salesAgentId: payload.salesAgentId,
        festiveSeason: payload.festiveSeason,
        referralSource: payload.referralSource,
        notes: payload.notes,
      });
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Advert sales created successfully',
        data: { advertSales },
      });
    } catch (error) {
      next(error);
    }
  }

  async function list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllAdvertSalesDto;
      const queryOptions = mapFetchAllAdvertSalesDtoToQueryOptions(query);
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [advertSalesList, total] = await Promise.all([
        fetchAllAdvertSalesUseCase.execute(queryOptions),
        countAdvertSalesUseCase.execute(queryOptions),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { advertSales: advertSalesList },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const advertSales = await getAdvertSalesByIdUseCase.execute(id);
      res.status(200).json({
        status: 'SUCCESS',
        data: { advertSales },
      });
    } catch (error) {
      next(error);
    }
  }

  async function update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateAdvertSalesDto;
      const patch: Parameters<UpdateAdvertSalesUseCase['execute']>[1] = {};
      if (payload.adPackageId !== undefined) patch.adPackageId = payload.adPackageId;
      if (payload.customerId !== undefined) patch.customerId = payload.customerId;
      if (payload.status !== undefined) patch.status = payload.status;
      if (payload.advertType !== undefined) patch.advertType = payload.advertType;
      if (payload.adStartDate !== undefined) patch.adStartDate = payload.adStartDate;
      if (payload.adEndDate !== undefined) patch.adEndDate = payload.adEndDate;
      if (payload.adLengthSeconds !== undefined) patch.adLengthSeconds = payload.adLengthSeconds;
      if (payload.numOfSlots !== undefined) patch.numOfSlots = payload.numOfSlots;
      if (payload.adPackagePrice !== undefined) patch.adPackagePrice = payload.adPackagePrice;
      if (payload.discountPercentage !== undefined) patch.discountPercentage = payload.discountPercentage;
      if (payload.finalPrice !== undefined) patch.finalPrice = payload.finalPrice;
      if (payload.installmentCount !== undefined) patch.installmentCount = payload.installmentCount;
      if (payload.campaignName !== undefined) patch.campaignName = payload.campaignName;
      if (payload.contractSignDate !== undefined) patch.contractSignDate = payload.contractSignDate;
      if (payload.salesRepId !== undefined) patch.salesRepId = payload.salesRepId;
      if (payload.salesRepCommissionPercentage !== undefined) {
        patch.salesRepCommissionPercentage = payload.salesRepCommissionPercentage;
      }
      if (payload.categoryId !== undefined) patch.categoryId = payload.categoryId;
      if (payload.subCategoryId !== undefined) patch.subCategoryId = payload.subCategoryId;
      if (payload.salesAgentId !== undefined) patch.salesAgentId = payload.salesAgentId;
      if (payload.salesAgentCommissionPercentage !== undefined) {
        patch.salesAgentCommissionPercentage = payload.salesAgentCommissionPercentage;
      }
      if (payload.festiveSeason !== undefined) patch.festiveSeason = payload.festiveSeason;
      if (payload.referralSource !== undefined) patch.referralSource = payload.referralSource;
      if (payload.notes !== undefined) patch.notes = payload.notes;

      const advertSales = await updateAdvertSalesUseCase.execute(id, patch);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert sales updated successfully',
        data: { advertSales },
      });
    } catch (error) {
      next(error);
    }
  }

  async function remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteAdvertSalesUseCase.execute(id);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert sales deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async function getSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const schedule = await generateScheduleUseCase.execute(id);
      res.status(200).json({ status: 'SUCCESS', data: { schedule } });
    } catch (error) {
      next(error);
    }
  }

  async function sendSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await sendScheduleEmailUseCase.execute(id);
      res.status(200).json({ status: 'SUCCESS', message: 'Schedule email sent' });
    } catch (error) {
      next(error);
    }
  }

  async function getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const report = await generateReportUseCase.execute(id);
      res.status(200).json({ status: 'SUCCESS', data: { report } });
    } catch (error) {
      next(error);
    }
  }

  async function sendReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await sendReportEmailUseCase.execute(id);
      res.status(200).json({ status: 'SUCCESS', message: 'Report email sent' });
    } catch (error) {
      next(error);
    }
  }

  async function emailScheduleToFinance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const file = req.file;

      await sendScheduleToFinanceEmailUseCase.execute({
        advertSalesId: id,
        file: {
          buffer: file!.buffer,
          originalname: file!.originalname,
          mimetype: file!.mimetype,
          size: file!.size,
        },
        sentByUserId: req.user!.id,
      });

      res.status(200).json({ status: 'SUCCESS', message: 'Schedule email sent to finance' });
    } catch (error) {
      next(error);
    }
  }

  async function sendScheduleFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const file = req.file;
      const email =
        typeof req.body.email === 'string' && req.body.email.trim()
          ? req.body.email.trim()
          : undefined;

      await sendScheduleFileEmailUseCase.execute({
        advertSalesId: id,
        file: {
          buffer: file!.buffer,
          originalname: file!.originalname,
          mimetype: file!.mimetype,
          size: file!.size,
        },
        recipientEmail: email,
      });

      res.status(200).json({ status: 'SUCCESS', message: 'Schedule file email sent' });
    } catch (error) {
      next(error);
    }
  }

  async function sendReportFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const file = req.file;
      const email =
        typeof req.body.email === 'string' && req.body.email.trim()
          ? req.body.email.trim()
          : undefined;

      await sendReportFileEmailUseCase.execute({
        advertSalesId: id,
        file: {
          buffer: file!.buffer,
          originalname: file!.originalname,
          mimetype: file!.mimetype,
          size: file!.size,
        },
        recipientEmail: email,
      });

      res.status(200).json({ status: 'SUCCESS', message: 'Report file email sent' });
    } catch (error) {
      next(error);
    }
  }

  return {
    create,
    list,
    getById,
    update,
    remove,
    getSchedule,
    sendSchedule,
    getReport,
    sendReport,
    emailScheduleToFinance,
    sendScheduleFile,
    sendReportFile,
  };
}
