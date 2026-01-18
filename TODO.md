# TODO - Abbay TV Sales Automation System

## 🟥 High Priority (Known Issues)

- None currently identified

## 🟨 Medium Priority (New Tasks)

### Core Features - Not Yet Implemented

- 🟨 Implement show/ad expiry detection and notification delivery (`application/services/alert.service.ts`)
- 🟨 Implement password reset token generation and email delivery (`presentation/controllers/user.controller.ts`)
- 🟨 Send compensation proposal email with actionable link (`application/use-cases/adverts/process-compensation.use-case.ts`)
- 🟨 Send formatted payment request email with invoice details (`application/use-cases/finance/generate-payment-request.use-case.ts`)

### Email Templates

- 🟨 Replace compensation template with branded design (`infrastructure/external/email/templates/compensation.html`)
- 🟨 Replace ad schedule template with branded design (`infrastructure/external/email/templates/ad-schedule.html`)

### Missing Features from Requirements

- 🟨 Customer entity CRUD operations and endpoints
- 🟨 Partner entity CRUD operations and endpoints
- 🟨 MediaPack entity CRUD operations and endpoints
- 🟨 SatelliteLog upload and verification workflow
- 🟨 Sales follow-up / communication logging functionality
- 🟨 Revenue share calculation and distribution
- 🟨 Commission calculation for sales reps
- 🟨 Ethiopian calendar date conversion service
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
- 🟨 Remove MongoDB dependencies once PostgreSQL is fully tested

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
