# Abbay TV Sales Automation System - Project Index

## Overview

This repository is a **single-tenant** backend API for TV sales and operations automation at Abbay TV.  
It follows a layered architecture inspired by Clean Architecture + DDD, with pragmatic direct wiring in some controllers/use-cases.

- Project: `media_automation`
- Version: `1.0.0`
- Language: TypeScript (`strict: true`)
- Runtime: Node.js
- Framework: Express `^5.2.1`
- Primary Database: PostgreSQL via Prisma
- Legacy Dependency Present: Mongoose (no active MongoDB route surface)


## Current State Snapshot

- Multi-tenant design from original docs is removed in runtime code; system now operates as single-tenant.
- Primary data access is Prisma (`src/infrastructure/prisma/*`).
- Permission model is DB-backed and auto-synced at startup from `PERMISSIONS`.
- API surface includes user, employee, permission, user-permission, shows, telegram groups/members, adverts, finance, compensations, and analytics.
- Several business TODOs remain (alerts, richer emails, some domain workflows).


## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | - |
| Language | TypeScript | `^5.9.3` |
| API | Express | `^5.2.1` |
| ORM | Prisma Client + Prisma CLI | `^6.19.2` |
| Database | PostgreSQL | via `DATABASE_URL` |
| Auth | jsonwebtoken | `^9.0.3` |
| Validation | Zod | `^4.3.5` |
| Hashing | bcryptjs | `^3.0.3` |
| Scheduling | node-cron | `^4.2.1` |
| Email | Nodemailer | `^7.0.12` |
| HTTP Middleware | cors, helmet, morgan | `^2.8.6`, `^8.1.0`, `^1.10.1` |
| Legacy/Compatibility | mongoose | `^9.1.3` |
| Testing | Jest + Supertest | `^29.7.0`, `^7.2.2` |
| Formatting/Linting | Prettier + ESLint + TS ESLint | configured |


## Top-Level Structure

```text
tvsystem_api/
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── presentation/
│   ├── shared/
│   ├── tests/
│   └── index.ts
├── docs/
├── postman_collection.json
├── prisma.config.ts
├── PROJECT_INDEX.md
├── TODO.md
├── package.json
└── tsconfig.json
```


## Architecture and Layer Responsibilities

### 1) Domain Layer (`src/domain`)

Core business types and contracts:

- Entities (`15`): includes `user`, `employee`, `show`, `advert`, `permission`, `user-permissions`, `telegram-groups`, `telegram-group-member`, `payment`, `compensation`, `partner`, `customer`, `satellite-log`, `media-pack`, and `media_monitroing`.
- Repositories interfaces (`10`): contracts for users, employees, permissions, shows, adverts, telegram groups/members, user-permissions, etc.
- Value objects (`4`): `money`, `percentage`, `schedule-slot`, `calendar-date`.
- Enums (`8`): user roles, show type, advert/payment statuses, user ref model, sex, status.
- Domain errors: `EntityNotFoundError`, `EntityAlreadyExistsError`, `ValidationError`.

### 2) Application Layer (`src/application`)

- Services (`3`):
  - `AuthService`: access/refresh token generation and verification.
  - `AnalyticsService`: aggregations (currently sales by show/status and totals).
  - `AlertService`: scheduled alert entry point (implementation TODO).
- Use-cases (`49`): organized by module folders:
  - users
  - employee
  - permissions
  - user-permissions
  - shows
  - adverts
  - finance
  - telegram-groups
  - telegram-group-members

### 3) Infrastructure Layer (`src/infrastructure`)

- Prisma client, repositories, entity mappers, where-clause builders, and Prisma error mapping:
  - `prisma.client.ts`
  - `repositories/*`
  - `model_entity_mappers/*`
  - `where_clauses/*`
  - `exceptions.ts`
- Middleware:
  - `auth.middleware.ts`
  - `permission.middleware.ts`
- Services:
  - `permission-sync.service.ts`
  - `scheduler.service.ts`
  - `hash.service.ts`
- Config:
  - `jwt.config.ts`
  - `email.config.ts`
  - `database.config.ts` (legacy mongoose connector)
- External:
  - `external/email/email.service.ts`
  - email templates under `external/email/templates/`

### 4) Presentation Layer (`src/presentation`)

- `app.ts`: express app wiring (JSON parsing, CORS, Helmet, Morgan, routes, unknown route handling, global error handler).
- Routes (`13`) and Controllers (`13`) for all HTTP modules.
- DTOs (`28`) with Zod validation.
- Query mapper utilities (`7`) from request DTOs to query options.
- Validators:
  - `validate-body.ts`
  - `validate-query.ts`

### 5) Shared Layer (`src/shared`)

- Permissions constants (`PERMISSIONS`)
- Error constructor and HTTP code registry
- Password and error utility helpers


## Bootstrap and Runtime Flow

### Startup (`src/index.ts`)

1. Loads env (`dotenv`).
2. Connects Prisma (`connectPrisma`).
3. Fires permission sync in background (`PermissionSyncService.syncPermissions()`).
4. Schedules daily 6:00 AM alert job (`SchedulerService` + `AlertService.processOffAirAlerts()`).
5. Starts express server on `PORT` (default `3000`).
6. Handles graceful shutdown on `SIGTERM`/`SIGINT` (server close + `disconnectPrisma`).

### Request Execution Flow

1. `presentation/routes/*` selects endpoint.
2. Zod validation middleware parses/coerces request (`validateBody`/`validateQuery`).
3. `authMiddleware` verifies bearer JWT and sets `req.user`.
4. `requirePermission` checks permission slug.
5. Controller executes use-case/service.
6. Use-case talks to repository (interface-driven in many places, direct repo in others).
7. Prisma repository executes SQL through Prisma Client.
8. Response returns success envelope or global error mapping handles failure.


## Module and Endpoint Index

All routes are mounted under `/api` in `presentation/routes/index.ts`.

| Module | Base Path | Route File | Controller File | Notes |
|--------|-----------|------------|-----------------|-------|
| Health | `/health` | `routes/index.ts` | `health.controller.ts` | Public health probe |
| Auth | `/auth` | `auth.routes.ts` | `auth.controller.ts` | Register, login, refresh token |
| Users | `/users` | `users.routes.ts` | `user.controller.ts` | CRUD-like user admin + `me` |
| Shows | `/shows` | `shows.routes.ts` | `show.controller.ts` | Create/list/get/update/delete |
| Adverts | `/adverts` | `adverts.routes.ts` | `advert.controller.ts` | Create advert |
| Finance | `/finance` | `finance.routes.ts` | `finance.controller.ts` | Create payment requests |
| Compensations | `/compensations` | `compensation.routes.ts` | `compensation.controller.ts` | Propose compensations |
| Analytics | `/analytics` | `analytics.routes.ts` | `analytics.controller.ts` | Summary endpoint |
| Permissions | `/permissions` | `permissions.routes.ts` | `permission.controller.ts` | Permission CRUD/query |
| User Permissions | `/user-permissions` | `user-permissions.routes.ts` | `user-permission.controller.ts` | Grant/list/get/revoke |
| Employees | `/employees` | `employee.route.ts` | `employee.controller.ts` | Employee + linked user lifecycle |
| Telegram Groups | `/telegram-groups` | `telegram-groups.routes.ts` | `telegram-group.controller.ts` | Group CRUD/query |
| Telegram Group Members | `/telegram-group-members` | `telegram-group-member.routes.ts` | `telegram-group-member.controller.ts` | Membership CRUD/query |


## Data Model Index (Prisma)

Prisma schema path: `src/infrastructure/prisma/schema.prisma`  
Prisma config path: `prisma.config.ts`

### Enums in Prisma

- `UserRefModel`: `Partner`, `Employee`, `Internal`

### Models

- `User` (`users`)
- `Show` (`shows`)
- `Customer` (`customers`)
- `Advert` (`adverts`)
- `Partner` (`partners`)
- `Employee` (`employees`)
- `Payment` (`payments`)
- `Compensation` (`compensations`)
- `SatelliteLog` (`satellite_logs`)
- `MediaPack` (`media_packs`)
- `TelegramGroup` (`telegram_groups`)
- `TelegramGroupMember` (`telegram_group_members`)
- `Permission` (table name defaults to prisma convention)
- `UserPermission` (`user_permissions`)

### Relationship Highlights

- `User` can reference either `Partner` or `Employee` via polymorphic-like fields + `refModel`.
- `UserPermission` maps users to permissions with optional granter and expiration.
- `TelegramGroupMember` is a junction table (`@@unique([telegramGroupId, userId])`).
- `Advert` links `Show` + `Customer`, then `Payment` and `Compensation` link to `Advert`.

### Migration Status

Migrations present: `9` SQL migrations in `src/infrastructure/prisma/migrations/*/migration.sql`.


## Security Model

### Authentication

- JWT access + refresh token flow via `AuthService`.
- Access token payload uses `{ userId, permissions }`.
- `authMiddleware` reads bearer token and injects `req.user`.

### Authorization

- Permission slugs are centrally defined in `shared/constants/permissions.constants.ts`.
- `requirePermission(permissionSlug)` enforces endpoint-level access.
- On startup, `PermissionSyncService` ensures DB permission rows exist for current constant set.


## Error Handling Strategy

- Domain/application errors map to HTTP codes in `shared/utils/global-error-handler.ts`.
- Prisma known request errors are converted in `infrastructure/prisma/exceptions.ts` (`P2002`, `P2003`, `P2025`, fallback).
- Validation middleware returns normalized bad request errors via `Exception` + `Code`.


## Background Jobs and Async Processes

- Daily cron job at `0 6 * * *` executes `AlertService.processOffAirAlerts()`.
- Permission sync is fire-and-forget during bootstrap.
- Alert processing and richer mail workflows are partially TODO.


## Dependencies by Concern

- API and HTTP: `express`, `cors`, `helmet`, `morgan`
- Data and ORM: `@prisma/client`, `prisma`, `mongoose` (legacy)
- Auth and security: `jsonwebtoken`, `bcryptjs`
- Validation: `zod`
- Scheduling: `node-cron`
- Messaging/email: `nodemailer`
- Utilities: `dotenv`, `dayjs`, `uuid`, `multer`
- Dev/test: `typescript`, `ts-node-dev`, `jest`, `ts-jest`, `supertest`, ESLint toolchain, Prettier


## Build, Run, and Test

Scripts from `package.json`:

- `npm run dev` - start dev server with `ts-node-dev`
- `npm run build` - compile TypeScript (`tsc`)
- `npm run start` - run compiled app
- `npm run lint` - eslint for `src/**/*.{ts,tsx}`
- `npm run format` - prettier write
- `npm run test` - run jest serially
- `npm run test:watch` - watch mode

Current tests in repo:

- `src/tests/integration/health.spec.ts`
- `src/tests/unit/money.spec.ts`


## Environment Variables

| Variable | Purpose | Used In |
|----------|---------|---------|
| `PORT` | HTTP listen port | `src/index.ts` |
| `DATABASE_URL` | PostgreSQL connection for Prisma | `prisma.client.ts`, Prisma CLI |
| `JWT_SECRET` | JWT signing/verifying secret | `jwt.config.ts` |
| `SMTP_HOST` | SMTP host | `email.config.ts` |
| `SMTP_PORT` | SMTP port | `email.config.ts` |
| `SMTP_USER` | SMTP username | `email.config.ts` |
| `SMTP_PASS` | SMTP password | `email.config.ts` |
| `EMAIL_FROM` | Default sender address | `email.config.ts` |
| `DEFAULT_PASSWORD` | Reset password fallback | `user.controller.ts` |
| `NODE_ENV` | runtime mode (dev/prod behavior toggles) | multiple files |
| `MONGO_URI` | legacy connector only | `database.config.ts` |


## Known Gaps and Technical Debt

- `docs/technical_specifications.mdc` still describes old multi-tenant + MongoDB architecture; runtime code is now single-tenant + Prisma.
- `AlertService.processOffAirAlerts()` not implemented.
- Payment/compensation email content is placeholder-level and marked TODO.
- Mixed dependency style: some use-cases use injected interfaces, others instantiate infra repositories directly.
- Some naming/typo inconsistencies remain in filenames (e.g., `delete-user.uase-case.ts`, `media_monitroing.entity.ts`, `employee.route.ts` singular naming).


## Approximate File Count Summary (Current Codebase)

| Area | Count |
|------|-------|
| Domain entities | 15 |
| Domain repositories/interfaces | 10 |
| Domain enums | 8 |
| Domain value-objects | 4 |
| Application services | 3 |
| Application use-cases | 49 |
| Infrastructure TS files | 40 |
| Presentation routes | 13 |
| Presentation controllers | 13 |
| Presentation DTOs | 28 |
| Presentation mappers | 7 |
| Tests | 2 |
| Total project files (all types) | ~243 |


## References

- Architecture baseline docs: `docs/technical_specifications.mdc` (partially outdated)
- Active API test collection: `postman_collection.json`
- Task tracker: `TODO.md`


*Last Updated: March 5, 2026*
