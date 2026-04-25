import type { IAdvertPlacementRepository } from '../domain/repositories/advert-placement.repository.interface';
import type { IAdvertSalesRepository } from '../domain/repositories/adver-sales.repository.interface';
import type { IAdvertPackageMediaPackRepository } from '../domain/repositories/advert-package-media-pack.repository.interface';
import type { IAdvertPackageRepository } from '../domain/repositories/advert-package.repository.interface';
import type { IBroadcastSlotRepository } from '../domain/repositories/broadcast-slot.repository.interface';
import type { ICategoryRepository } from '../domain/repositories/category.repository.interface';
import type { ICommunicationLogRepository } from '../domain/repositories/communication-log.repository.interface';
import type { ICustomerRepository } from '../domain/repositories/customer.repository.interface';
import type { IEmployeeRepository } from '../domain/repositories/employee.repo';
import type { IMediaMonitoringRecordRepository } from '../domain/repositories/media-monitoring-record.repository.interface';
import type { IMediaPackRepository } from '../domain/repositories/media-pack.repository.interface';
import type { IPermissionRepository } from '../domain/repositories/permission.repository.repo';
import type { IPartnerRepository } from '../domain/repositories/partner.repo';
import type { IScheduleBlockRepository } from '../domain/repositories/schedule-block.repository.interface';
import type { ISatelliteScheduleRepository } from '../domain/repositories/satellite-schedule.repository.interface';
import type { IShowHostRepository } from '../domain/repositories/show-host.repository.interface';
import type { IShowRepository } from '../domain/repositories/show.repository.interface';
import type { IShowSegmentSlotRepository } from '../domain/repositories/show-segment-slot.repository.interface';
import type { ISubCategoryRepository } from '../domain/repositories/sub-category.repository.interface';
import type { ITelegramGroupMembersRepository } from '../domain/repositories/telegram-group-members.repo';
import type { ITelegramGroupRepository } from '../domain/repositories/telegram-group.repo';
import type { IUserPermissionsRepository } from '../domain/repositories/user-permissions.repo';
import type { IUserRepository } from '../domain/repositories/user.repo';
import type { IHashService } from '../domain/services/hash-service.service';
import type { ICalendarService } from '../domain/services/calendar.service';
import type { IGenerateBusinessRefService } from '../domain/services/generate-business-ref.service';
import type { IEmailService } from '../domain/services/email.service';
import type { ISatelliteLogUploadRepository } from '../domain/repositories/satellite-log-upload.repository.interface';
import type { ISatelliteLogEntryRepository } from '../domain/repositories/satellite-log-entry.repository.interface';
import type { ICompensationRepository } from '../domain/repositories/compensation.repository.interface';
import type { IPaymentRepository } from '../domain/repositories/payment.repository.interface';
import type { IRevenueShareRepository } from '../domain/repositories/revenue-share.repository.interface';
import type { IAgentCommissionRepository } from '../domain/repositories/agent-commission.repository.interface';
import type { IAuditLogRepository } from '../domain/repositories/audit-log.repository.interface';
import { AdvertPlacementRepository } from '../infrastructure/prisma/repositories/advert-placement.repository';
import { AdvertSalesRepository } from '../infrastructure/prisma/repositories/advert-sales.repository';
import { AdvertPackageMediaPackRepository } from '../infrastructure/prisma/repositories/advert-package-media-pack.repository';
import { AdvertPackageRepository } from '../infrastructure/prisma/repositories/advert-package.repository';
import { BroadcastSlotRepository } from '../infrastructure/prisma/repositories/broadcast-slot.repository';
import { CategoryRepository } from '../infrastructure/prisma/repositories/category.repository';
import { CommunicationLogRepository } from '../infrastructure/prisma/repositories/communication-log.repository';
import { CustomerRepository } from '../infrastructure/prisma/repositories/customer.repository';
import { EmployeeRepository } from '../infrastructure/prisma/repositories/employee.repository';
import { MediaMonitoringRecordRepository } from '../infrastructure/prisma/repositories/media-monitoring-record.repository';
import { MediaPackRepository } from '../infrastructure/prisma/repositories/media-pack.repository';
import { PermissionRepository } from '../infrastructure/prisma/repositories/permission.repository';
import { PartnerRepository } from '../infrastructure/prisma/repositories/partner.repository';
import { ScheduleBlockRepository } from '../infrastructure/prisma/repositories/schedule-block.repository';
import { SatelliteScheduleRepository } from '../infrastructure/prisma/repositories/satellite-schedule.repository';
import { ShowHostRepository } from '../infrastructure/prisma/repositories/show-host.repository';
import { ShowRepository } from '../infrastructure/prisma/repositories/show.repository';
import { ShowSegmentSlotRepository } from '../infrastructure/prisma/repositories/show-segment-slot.repository';
import { SubCategoryRepository } from '../infrastructure/prisma/repositories/sub-category.repository';
import { TelegramGroupMemberRepository } from '../infrastructure/prisma/repositories/telegram-group-member.repository';
import { TelegramGroupRepository } from '../infrastructure/prisma/repositories/telegram-group.repository';
import { UserPermissionsRepository } from '../infrastructure/prisma/repositories/user-permissions.repository';
import { UserRepository } from '../infrastructure/prisma/repositories/user.repository';
import { HashService } from '../infrastructure/services/hash.service';
import { CalendarService } from '../infrastructure/services/calendar.service';
import { GenerateBusinessRefService } from '../infrastructure/services/generate-business-ref.service';
import { EmailService } from '../infrastructure/external/email/email.service';
import { SatelliteLogUploadRepository } from '../infrastructure/prisma/repositories/satellite-log-upload.repository';
import { SatelliteLogEntryRepository } from '../infrastructure/prisma/repositories/satellite-log-entry.repository';
import { CompensationRepository } from '../infrastructure/prisma/repositories/compensation.repository';
import { PaymentRepository } from '../infrastructure/prisma/repositories/payment.repository';
import { RevenueShareRepository } from '../infrastructure/prisma/repositories/revenue-share.repository';
import { AgentCommissionRepository } from '../infrastructure/prisma/repositories/agent-commission.repository';
import { AuditLogRepository } from '../infrastructure/prisma/repositories/audit-log.repository';
import { AnalyticsService } from '../application/services/analytics.service';
import { InsightService } from '../application/services/insight.service';
import { createOpenAIModel } from '../infrastructure/ai/openai-model.provider';

export interface AppContainer {
  userRepository: IUserRepository;
  showRepository: IShowRepository;
  userPermissionsRepository: IUserPermissionsRepository;
  employeeRepository: IEmployeeRepository;
  partnerRepository: IPartnerRepository;
  scheduleBlockRepository: IScheduleBlockRepository;
  broadcastSlotRepository: IBroadcastSlotRepository;
  showHostRepository: IShowHostRepository;
  mediaPackRepository: IMediaPackRepository;
  advertPlacementRepository: IAdvertPlacementRepository;
  advertSalesRepository: IAdvertSalesRepository;
  advertPackageRepository: IAdvertPackageRepository;
  advertPackageMediaPackRepository: IAdvertPackageMediaPackRepository;
  mediaMonitoringRecordRepository: IMediaMonitoringRecordRepository;
  communicationLogRepository: ICommunicationLogRepository;
  customerRepository: ICustomerRepository;
  categoryRepository: ICategoryRepository;
  subCategoryRepository: ISubCategoryRepository;
  showSegmentSlotRepository: IShowSegmentSlotRepository;
  telegramGroupRepository: ITelegramGroupRepository;
  telegramGroupMemberRepository: ITelegramGroupMembersRepository;
  satelliteScheduleRepository: ISatelliteScheduleRepository;
  permissionRepository: IPermissionRepository;
  satelliteLogUploadRepository: ISatelliteLogUploadRepository;
  satelliteLogEntryRepository: ISatelliteLogEntryRepository;
  compensationRepository: ICompensationRepository;
  paymentRepository: IPaymentRepository;
  revenueShareRepository: IRevenueShareRepository;
  agentCommissionRepository: IAgentCommissionRepository;
  auditLogRepository: IAuditLogRepository;
  hashService: IHashService;
  calendarService: ICalendarService;
  generateBusinessRefService: IGenerateBusinessRefService;
  emailService: IEmailService;
  analyticsService: AnalyticsService;
  insightService: InsightService;
}

export function buildAppContainer(): AppContainer {
  return {
    userRepository: new UserRepository(),
    showRepository: new ShowRepository(),
    userPermissionsRepository: new UserPermissionsRepository(),
    employeeRepository: new EmployeeRepository(),
    partnerRepository: new PartnerRepository(),
    scheduleBlockRepository: new ScheduleBlockRepository(),
    broadcastSlotRepository: new BroadcastSlotRepository(),
    showHostRepository: new ShowHostRepository(),
    mediaPackRepository: new MediaPackRepository(),
    advertPlacementRepository: new AdvertPlacementRepository(),
    advertSalesRepository: new AdvertSalesRepository(),
    advertPackageRepository: new AdvertPackageRepository(),
    advertPackageMediaPackRepository: new AdvertPackageMediaPackRepository(),
    mediaMonitoringRecordRepository: new MediaMonitoringRecordRepository(),
    communicationLogRepository: new CommunicationLogRepository(),
    customerRepository: new CustomerRepository(),
    categoryRepository: new CategoryRepository(),
    subCategoryRepository: new SubCategoryRepository(),
    showSegmentSlotRepository: new ShowSegmentSlotRepository(),
    telegramGroupRepository: new TelegramGroupRepository(),
    telegramGroupMemberRepository: new TelegramGroupMemberRepository(),
    satelliteScheduleRepository: new SatelliteScheduleRepository(),
    permissionRepository: new PermissionRepository(),
    hashService: new HashService(),
    calendarService: new CalendarService(),
    satelliteLogUploadRepository: new SatelliteLogUploadRepository(),
    satelliteLogEntryRepository: new SatelliteLogEntryRepository(),
    compensationRepository: new CompensationRepository(),
    paymentRepository: new PaymentRepository(),
    revenueShareRepository: new RevenueShareRepository(),
    agentCommissionRepository: new AgentCommissionRepository(),
    auditLogRepository: new AuditLogRepository(),
    generateBusinessRefService: new GenerateBusinessRefService(),
    emailService: new EmailService(),
    analyticsService: new AnalyticsService(
      new PaymentRepository(),
      new ShowRepository(),
      new AdvertPlacementRepository(),
      new AdvertSalesRepository(),
      new CustomerRepository(),
    ),
    insightService: new InsightService(
      createOpenAIModel(),
      new AnalyticsService(
        new PaymentRepository(),
        new ShowRepository(),
        new AdvertPlacementRepository(),
        new AdvertSalesRepository(),
        new CustomerRepository(),
      ),
      new AdvertPlacementRepository(),
      new PaymentRepository(),
      new EmployeeRepository(),
    ),
  };
}

export function buildAppContainerForTests(overrides: Partial<AppContainer> = {}): AppContainer {
  return { ...buildAppContainer(), ...overrides };
}
