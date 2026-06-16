# TODO - Abbay TV Sales Automation System

## 🟥 High Priority (Known Issues)

- None currently identified

## 🟨 Medium Priority (New Tasks)

### Core Features - Not Yet Implemented

- 🟨 Extend operational alerting (additional channels, tuning cadence, dashboards) beyond email alerts in `AlertService`
- 🟨 Verify satellite log / compensation flows end-to-end vs requirements §4.7 (batch reporting, polish)
- 🟨 Refine payment request emails further (installment schedules vs contracts, attachments) — base HTML invoice flow exists

### Architecture & documentation

- ✅ `AnalyticsService` CA violation fixed: now uses constructor-injected repository interfaces; 3 analytics endpoints added (`GET /api/analytics/kpis`, `/monthly-revenue`, `/top-shows`)
- 🟨 Deprecate or remove duplicate [docs/requirements.mdc](docs/requirements.mdc); canonical spec is [docs/requirements.md](docs/requirements.md)
- 🟨 Refresh [docs/clean-architecture-violations.md](docs/clean-architecture-violations.md) for current routes (`/api/advert-placements`, `/api/payments`, `/api/compensations`, `/api/satellite-logs`) and `buildAppContainer` wiring
- ✅ `AnalyticsService` wired to HTTP: `GET /api/analytics/kpis`, `GET /api/analytics/monthly-revenue?year=`, `GET /api/analytics/top-shows?limit=` — all guarded by `VIEW_ANALYTICS` permission
- 🟨 Requirements §3 mentions SMS; stack is email-only — product decision (provider vs defer)
- 🟨 Expand audit coverage ([docs/requirements.md](docs/requirements.md) §5): domain events, retention, or admin query API on top of `audit_logs` + middleware

### Email Templates

- 🟨 Replace compensation template with branded design (`infrastructure/external/email/templates/compensation.html`)
- 🟨 Replace ad schedule template with branded design (`infrastructure/external/email/templates/ad-schedule.html`)

### Missing Features from Requirements

- ✅ Customer entity CRUD operations and endpoints (Sales Follow-up)
- ✅ Partner entity CRUD operations and endpoints (`/api/partners`, `partners.routes.ts`)
- ✅ MediaPack and AdvertPackage catalog CRUD (`/api/media-packs`, `/api/advert-packages`, `POST .../with-ad-packages`, `/api/advert-package-media-packs`; see `PROJECT_INDEX_AUTO.md`)
- ✅ Satellite log upload, entries, match, and verify API (`/api/satellite-logs`, `/api/satellite-log-entries`; see `PROJECT_INDEX_AUTO.md`)
- 🟨 Satellite log product completeness (batch reporting, operational polish vs requirements §4.7); customer token response is available at `POST /api/public/compensations/respond`
- ✅ Sales follow-up / communication logging functionality
- 🟨 Revenue share calculation and distribution (API and use cases exist — verify business rules, disbursement, and partner reporting vs requirements §4.9 / §4.15)
- 🟨 Commission calculation for sales reps and agents (API and use cases exist — verify rules vs requirements §4.9)
- ✅ Ethiopian calendar date conversion service (CalendarService.formatEthiopianDate)
- ✅ Audit logging: `audit_logs` table, middleware on mutating `/api` routes, `RecordAuditLogUseCase`
- 🟨 Contract document generation
- 🟨 Ad delivery verification gaps (core compare + operational email alerts exist; remaining: integrations, reporting breadth vs requirements §4.5 / §4.7)
- 🟨 Revenue share reports for external partners (scheduled email weekly/monthly per §4.15)
- 🟨 Batch email sending for ad schedules and reports

### Infrastructure

- 🟨 Add database indexing optimization
- 🟨 Implement rate limiting
- 🟨 Add request logging with correlation IDs
- 🟨 Setup health check for database connectivity
- 🟨 Environment-specific configuration validation
- ✅ Removed legacy `mongoose` / `database.config.ts` (PostgreSQL + Prisma only)

### Testing

- 🟨 Add integration tests for auth flow
- 🟨 Add integration tests for shows CRUD
- 🟨 Add integration tests for advert placements / advert sales (replace legacy “adverts” naming)
- 🟨 Add unit tests for use cases
- 🟨 Add unit tests for value objects (Percentage, ScheduleSlot, CalendarDate)

### Documentation

- 🟨 Add API documentation (Swagger/OpenAPI)
- 🟨 Add deployment guide
- 🟨 Add environment setup guide

## ✅ Completed Tasks

### 06/16/2026

- ✅ **Advert schedule email to Finance:** `POST /api/advert-sales/:id/email-to-finance` accepts multipart PDF (`file`), validates UUID/sale/PDF, emails Finance via `FINANCE_EMAIL` or `FINANCE_TEAM_EMAIL` with metadata summary + attachment; `MANAGE_SALES` permission; `SendScheduleToFinanceEmailUseCase`; extended `IEmailService` for attachments; unit tests in `send-schedule-to-finance-email.use-case.spec.ts`. **//TODO (you):** set `FINANCE_EMAIL` (or `FINANCE_TEAM_EMAIL`) in deployment env.

### 05/20/2026

- ✅ **AI prospect discovery — business directory search:** Seeded domain-scoped search + `directorySearch` tool (Ezega Business Guide default via `businessguide.ezega.com`); `AI_SEARCH_DIRECTORY_DOMAINS` optional comma list; Tavily `include_domains` / SerpAPI `site:` filters; Phase A prompt + directory source ranking boost; unit tests for directory helpers in `ai-search.prospect.utils.spec.ts`. **//TODO (you):** optional `AI_SEARCH_DIRECTORY_DOMAINS` in deployment env to add more directory hosts.

### 04/27/2026

- ✅ **AI Insight — chart-ready tool + UI message stream:** `POST /api/insights/query` now uses `pipeUIMessageStreamToResponse` + `consumeStream` (Vercel AI UI protocol: `text/event-stream`, `x-vercel-ai-ui-message-stream: v1`); `getRevenueByAdvertPackageChart` tool returns `AdvertPackageRevenueChartPayload` (ETB points for bar/pie/line); `sumPaidRevenueByAdvertPackage` on `IPaymentRepository` + `getRevenueByAdvertPackageForMonth` on `AnalyticsService`; domain types in `insight-chart.interface.ts`; unit tests `analytics.service.revenue-by-package.spec.ts`; Postman **AI → Insight** folder updated (second request for chart example). **Frontend:** use `@ai-sdk/react` / UI stream consumer, not plain text.

### 04/26/2026

- ✅ **AI prospect discovery (stateless):** `src/ai-search/` module — `POST /api/ai-search` returns JSON `Prospect[]` (Zod `ProspectListSchema`); Vercel AI SDK `generateText` + `webSearch` / `directorySearch` tools (Tavily or SerpAPI via `SEARCH_PROVIDER`) then `generateObject` extraction + dedupe/rank; `createOpenAIModelForSearch()` (`AI_SEARCH_MODEL` optional); guarded by `VIEW_SALES`; unit tests in `ai-search.prospect.utils.spec.ts`. **//TODO (you):** set `TAVILY_API_KEY` and/or `SERPAPI_API_KEY` and `SEARCH_PROVIDER` in the deployment environment; optionally tune `AI_SEARCH_TIMEOUT_MS` (default 120s) and `AI_SEARCH_DIRECTORY_DOMAINS`.

### 04/25/2026

- ✅ AI Insights API: added `POST /api/insights/query` (see 04/27/2026 for UI message stream + chart tool); earlier: `streamText` tools, `createOpenAIModel()`; `WeeklyRevenueSummary` + `getWeeklyRevenueSummary()` on `IPaymentRepository`; `countActive()` on `IEmployeeRepository`; Postman **Insights (AI)** folder

### 04/22/2026

- ✅ Analytics: fixed CA violation in `AnalyticsService` (removed direct `prisma` import, replaced with constructor-injected interfaces); added analytics query methods to 5 repository interfaces (`IPaymentRepository`, `IShowRepository`, `IAdvertPlacementRepository`, `ICustomerRepository`, `IAdvertSalesRepository`); implemented in 5 Prisma repos; exposed `GET /api/analytics/kpis`, `GET /api/analytics/monthly-revenue?year=`, `GET /api/analytics/top-shows?limit=`; all guarded by `view_analytics` permission
- ✅ Full project analysis: audited all 672 source files, 31 entities, 31 repository interfaces, 180 use cases against requirements and clean architecture rules
- ✅ Updated [PROJECT_INDEX_AUTO.md](PROJECT_INDEX_AUTO.md): corrected entity/repo/use-case counts (30→31, 30→31, 170→180), corrected AlertService from "stub/TODO" to "fully implemented", updated Known Gaps (removed AlertService stub gap, added AnalyticsService CA violation), updated Last Updated date

### 04/17/2026

- ✅ `AdvertPackage`: removed duplicate `show_ids` column; `advert_package_shows` is source of truth; mapper derives `showIds` from `showLinks`; filters use `showLinks`; `ShowSummary.id`; `showModelToSummary`; Postman **Advert Packages** folder description; migration `20260417130000_drop_advert_package_show_ids_column`
- ✅ Prisma `advertSalesReadInclude`: nested `advertPackage` uses `include: { showLinks: … }` so `AdvertSalesGetPayload` matches `AdvertPackageDefaultArgs` (`advert-sales.ts`)
- ✅ `GET /api/users` query `roles`: accept single value, repeated keys, and comma-separated list (`fetch-all-users.dto.ts` preprocess)

### 04/16/2026

- ✅ Compensation: `PATCH /api/compensations/:id` with `UpdateCompensationUseCase`, `CompensationEntity.createInstance` / `updateInstance`, validation on propose/update DTOs; Postman **Update Compensation**
- ✅ `POST /api/payments/create-request`: `CreatePaymentRequestUseCase` (`advertSalesId`, `installmentNumber`); installment bounds + duplicate check; `payment-installment-schedule.service`; Postman
- ✅ `PaymentEntity.recordPaymentReceived`: validates deposit, dates, and total; blocks re-recording when already `Paid`; unit tests in `payment.entity.record-payment.spec.ts`
- ✅ Payment generation: `POST /api/payments/generate` uses `advertSalesId` only; `installmentCount` and even `finalPrice` split from advert sale; rejects if payments already exist; `record-payment.dto` + validation on `PATCH .../record-payment`; unit tests; Postman generate body updated
- ✅ Operational alerts: `AlertService` (campaign end / air), `RECEIVE_OPERATIONAL_ALERTS`, Prisma flags on advert sales/placement; wired from `src/index.ts`
- ✅ Self-service password reset: `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` (token + `newPassword`); secure tokens, user columns; configure `PUBLIC_APP_URL` or `FRONTEND_URL` for reset links
- ✅ Compensation emails: proposal emails include token + SPA link; public `POST /api/public/compensations/respond` (`token`, `accept`, optional `customerResponse`)
- ✅ Payment request emails: richer HTML body in `SendPaymentRequestEmailUseCase`
- ✅ Audit trail: `audit_logs` migration, Prisma repo, `auditMiddleware` registered in `app.ts`
- ✅ Postman: **Public** folder (`/api/public/compensations/respond`); **Auth** requests (`/api/auth/forgot-password`, `/api/auth/reset-password`)
- ✅ Refreshed [PROJECT_INDEX_AUTO.md](PROJECT_INDEX_AUTO.md): current stack (no Mongoose), `buildAppContainer` / `ApiRouterDeps`, full `/api` module table, Prisma model list, requirements ↔ backend mapping ([docs/requirements.md](docs/requirements.md) canonical), migration and file counts, known gaps (unwired `AnalyticsService`, SMS NFR)
- ✅ Updated [TODO.md](TODO.md) architecture recommendations and reconciled satellite log / finance / compensation wording with existing routes
- TODO: Run `npx prisma migrate deploy` (or `migrate dev`) so migration `20260416120000_alerts_password_compensation_audit` is applied
- TODO: Grant `receive_operational_alerts` to users who should receive operational alert emails

### 04/15/2026

- ✅ AdvertSales `installmentCount` (payment rounds): column `installment_count` NOT NULL DEFAULT 1, entity validation, create/update DTOs, list filter `installmentCount`, migration `20260415140000_advert_sales_installment_count`, Postman examples

- ✅ AdvertSales field refactor: Prisma `sales_rep_id` / `sales_rep_commission_percentage`, optional `sales_agent_id` / `sales_agent_commission_percentage`, `category_id` / `sub_category_id`; domain entity, mappers (includes `salesRep`, `salesAgent`, `category`, `subCategory`), `computeStoredAgentCommissionPercentage` in `sales-commission-storage.ts`, create/update use cases with category validation, list filters and DTOs, `CalculateAgentCommissionUseCase` uses rep fields, Postman Advert Sales folder, migration `20260415120000_advert_sales_sales_rep_categories`

- ✅ Customer `mediaMonitoringSourceId` birth link: Prisma relations `CustomerBirthSource` vs `CustomerLinkedMonitoringRecords`, `@unique` + FK migration `20260415120000_customer_media_monitoring_birth_fk_unique`, mapper uses `mediaMonitoringSourceId`, transactional `createWithBirthMonitoringLink`, update validation + P2002 mapping, optional `customerId` on create media monitoring record; unit tests for create/update media monitoring flows

### 04/14/2026

- ✅ Show segment slots: model is `showId` + `customerId` (required); removed `CustomerShowSuitability` and `/customer-show-suitability`; full REST CRUD on `/show-segment-slots` (list with filters, create, get by id, patch, delete, list by show); migration `20260414120000_show_segment_slot_customer_id_drop_suitability`; seed uses seed customers `SEED-SS-001`–`003`; unit tests for query mapper and create use case

### 03/29/2026

- ✅ Clean Architecture wiring: `buildAppContainer`, `ApiRouterDeps` (storage, multipart upload, `createAuthMiddleware`), factory routers/controllers; Jest default `DATABASE_URL` + `.js` `moduleNameMapper`; `Money` currency guard on arithmetic
- ✅ Advert placement slice: `AdvertEntity`, `IAdvertRepository`, Prisma repo + mappers, optional `broadcast_slot_id` migration `20260329120000_advert_broadcast_slot`, use-cases, `/api/adverts` CRUD
- ✅ Phase E churn: `delete-user.use-case.ts`; plural route files (`employees.routes.ts`, `partners.routes.ts`, `media-packs.routes.ts`, `advert-packages.routes.ts`); removed `mongoose` and legacy `database.config.ts`
- TODO: Run `npx prisma migrate deploy` (or `migrate dev`) so `adverts.broadcast_slot_id` exists

### 03/22/2026

- ✅ Pluggable file storage (`IStorageService`, local disk + S3 stub), multer image upload for POST/PATCH `/api/advert-packages` (`multipart/form-data`: JSON field `payload` + file field `image`), `AdvertPackage.imageUrl`, static `/uploads` when not using S3 stub; migration `20260322130000_advert_package_image_url`
- TODO: Run `npx prisma migrate deploy` (or `migrate dev`) so `advert_packages.image_url` exists
- TODO: Set `BASE_URL` in `.env` for public image URLs when using local storage; set `STORAGE_TYPE=s3` to use the CDN mock stub (`CDN_MOCK_BASE_URL` optional)
- TODO: Update Postman collection for multipart create/update advert packages (JSON in `payload` + binary `image`)

### 03/21/2026

- ✅ Moved optional `mediaPackId` from Customer to CommunicationLog (per-send media pack on each log entry); migration `20260321120000_move_media_pack_to_communication_log`
- TODO: Run `npx prisma migrate deploy` (or `migrate dev`) against your database so `communication_logs.media_pack_id` exists and `customers.media_pack_id` is dropped

### 03/18/2026

- ✅ Sales Follow-Up implementation (Section 4.3 of requirements)
  - Customer and CommunicationLog as separate entities (write-only log)
  - Category and SubCategory with hybrid management (predefined + custom)
  - MediaMonitoringRecord with link to Customer; status sync on customer update
  - ShowSegmentSlot for segment industries (show + customer per row; see 04/14/2026 completed entry)
  - API: /customers, /communication-logs, /media-monitoring, /categories, /sub-categories, /show-segment-slots
  - Seed: categories (Finance/BANK, Food/Food), show segment slots from Segment Industries CSV
- TODO: Grant MANAGE_SALES and VIEW_SALES permissions to Sales Rep, Sales Assistant, Sales Manager, CEO roles via user management
- TODO: If media monitoring channels expand beyond EBS, FANA, Arts, Kana, Radio, update create-media-monitoring-record.dto.ts enum

### 03/10/2026

- ✅ Upgraded Prisma from v6.19.2 to v7.4.2 (major version migration)
- ✅ Converted project from CommonJS to ESM (type: module, NodeNext module resolution)
- ✅ Switched to Prisma driver adapter (`@prisma/adapter-pg`) -- no more Rust query engine
- ✅ Created `prisma.config.ts` for centralized Prisma CLI configuration
- ✅ Updated Prisma generator from `prisma-client-js` to `prisma-client` with local output directory
- ✅ Added `.js` extensions to all 949 relative imports across 214 files for ESM compatibility
- ✅ Replaced `ts-node-dev` with `tsx` for ESM-compatible development
- ✅ Fixed ESM module loading order issue (switched to `import 'dotenv/config'`)
- ✅ Updated Jest configuration for ESM support
- ✅ Installed Node.js 22 LTS (required by Prisma 7)
- ✅ Implemented full BroadcastSlot feature (domain entity, Prisma model, repository, use cases, DTOs, controller, routes)
- ✅ Added materialization endpoint (`POST /satellite-schedules/:scheduleId/broadcast-slots`) to generate date-specific slots from weekly ScheduleBlock templates
- ✅ Auto-materialization: BroadcastSlots are automatically generated when a schedule status changes to ACTIVE
- ✅ Added BroadcastSlotStatus enum (SCHEDULED, AIRED, MISSED, PREEMPTED, CANCELLED) with validated status transitions
- ✅ Added Ethiopian calendar date display on BroadcastSlots via CalendarService.formatEthiopianDate
- ✅ BroadcastSlot CRUD: List with filters (date range, status, show, dayOfWeek), GetById, Update (status/time/override), Delete (only SCHEDULED)
- ✅ Idempotent materialization: re-running skips already-existing slots (unique constraint on scheduleBlockId + date)
- ✅ Updated Postman collection with 5 new broadcast-slot endpoints

### 03/09/2026

- ✅ Implemented full SatelliteScheduleBlock CRUD (domain entity, Prisma model, repository, use cases, DTOs, controller, routes)
- ✅ Added batch block creation endpoint (`POST /satellite-schedules/:scheduleId/blocks/batch`) with overlap validation
- ✅ Fixed EthiopianTime.toGregorianMinutes() bug in toEth24Hour for ከሰአት and ሌሊት periods
- ✅ Fixed SatelliteScheduleEntity/mapper mismatch: effectiveFromEth/effectiveToEth changed to optional strings, mapper argument order corrected
- ✅ Added Ethiopian date columns (effective_from_eth, effective_to_eth) to satellite_schedules table
- ✅ Added satellite_schedule_blocks table with unique constraint on (scheduleId, dayOfWeek, startTimeMinutes)
- ✅ Schedule blocks use weekly template model (keyed by dayOfWeek, not specific dates)
- ✅ API accepts Ethiopian time input (hour, minute, dayPart) and returns both Gregorian and Ethiopian time representations

### 01/18/2026

- ✅ Removed multi-tenancy - converted system to single-tenant architecture
  - Deleted 11 tenant-specific files (entity, model, repository, middlewares, routes, controller, DTOs)
  - Removed Tenant model and tenantId from all models in Prisma schema
  - Removed tenantId from all 9 domain entity interfaces
  - Removed TenantContext from repository interfaces
  - Removed TenantContext parameter and tenant filtering from all Prisma repositories
  - Removed tenantId from JWT payload in auth service and middleware
  - Removed TenantContext from all use cases
  - Removed tenantContext usage from all controllers
  - Removed ensureTenant middleware and tenant routes registration
  - Removed tenant middleware from app.ts
  - Removed tenant-related requests and x-tenant-id header from Postman collection
  - Removed tenant from MongoDB base model and repositories (legacy)
  - Applied Prisma schema changes to database
  - Updated PROJECT_INDEX.md and TODO.md
- ✅ Implemented Tenant management API (CRUD operations) - *Now removed as part of single-tenant conversion*
- ✅ Fixed Prisma database connection error (P1010) by creating postgres user and granting database access
- ✅ Successfully ran initial Prisma migration (`npx prisma migrate dev --name init`)

### 01/17/2026

- ✅ Migrated database from MongoDB to PostgreSQL using Prisma ORM
- ✅ Created Prisma schema with all entities (`prisma/schema.prisma`)
- ✅ Implemented Prisma client singleton (`infrastructure/database/prisma/prisma.client.ts`)
- ✅ Created PostgreSQL repositories (User, Show, Advert, Payment, Compensation)
- ✅ Updated application entry point to use Prisma connection with graceful shutdown
- ✅ Updated all use cases to use Prisma repositories
- ✅ Updated controllers to use Prisma repositories
- ✅ Updated analytics service to use Prisma aggregation
- ✅ Updated PROJECT_INDEX.md to reflect PostgreSQL migration
- ✅ Kept MongoDB models and repositories for reference/rollback
- ✅ Created comprehensive PROJECT_INDEX.md with full codebase analysis
- ✅ Created TODO.md for task management

---

*Task Priorities:*
- 🟥 High Priority: Known issues that are currently broken and require immediate attention
- 🟨 Medium Priority: New tasks that need to be addressed
- ✅ Completed: Tasks that have been finished successfully

