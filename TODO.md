# TODO - Abbay TV Sales Automation System

## 🟥 High Priority (Known Issues)

- None currently identified

## 🟨 Medium Priority (New Tasks)

### Core Features - Not Yet Implemented

- 🟨 Implement show/ad expiry detection and notification delivery (`application/services/alert.service.ts`)
- 🟨 Implement password reset token generation and email delivery (`presentation/controllers/user.controller.ts`)
- 🟨 Send compensation proposal email with actionable link (implement with the future compensation module; advert CRUD lives under `application/use-cases/adverts/`)
- 🟨 Send formatted payment request email with invoice details (implement with the future advert finance / payment module; there is no `application/use-cases/finance/` tree today)

### Email Templates

- 🟨 Replace compensation template with branded design (`infrastructure/external/email/templates/compensation.html`)
- 🟨 Replace ad schedule template with branded design (`infrastructure/external/email/templates/ad-schedule.html`)

### Missing Features from Requirements

- ✅ Customer entity CRUD operations and endpoints (Sales Follow-up)
- ✅ Partner entity CRUD operations and endpoints (`/api/partners`, `partners.routes.ts`)
- ✅ MediaPack and AdvertPackage catalog CRUD (`/api/media-packs`, `/api/advert-packages`, `POST .../with-ad-packages`, `/api/advert-package-media-packs`; see `PROJECT_INDEX_AUTO.md`)
- 🟨 SatelliteLog upload and verification workflow
- ✅ Sales follow-up / communication logging functionality
- 🟨 Revenue share calculation and distribution
- 🟨 Commission calculation for sales reps
- ✅ Ethiopian calendar date conversion service (CalendarService.formatEthiopianDate)
- 🟨 Audit logging middleware for critical actions
- 🟨 Contract document generation
- 🟨 Ad delivery verification (schedule vs satellite log comparison)
- 🟨 Revenue share reports for external partners
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
- 🟨 Add integration tests for adverts CRUD
- 🟨 Add unit tests for use cases
- 🟨 Add unit tests for value objects (Percentage, ScheduleSlot, CalendarDate)

### Documentation

- 🟨 Add API documentation (Swagger/OpenAPI)
- 🟨 Add deployment guide
- 🟨 Add environment setup guide

## ✅ Completed Tasks

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
