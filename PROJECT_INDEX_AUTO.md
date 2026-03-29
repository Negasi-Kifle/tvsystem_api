# Abbay TV Sales Automation System - Project Index

## Overview

This repository is a **single-tenant** backend API for TV sales and operations automation at Abbay TV.  
It follows a layered architecture inspired by Clean Architecture + DDD, with pragmatic direct wiring in many controllers (see [docs/clean-architecture-violations.md](docs/clean-architecture-violations.md)).

- Project: `media_automation`
- Version: `1.0.0`
- Language: TypeScript (`strict: true`), **ESM** (`"type": "module"` in [package.json](package.json))
- Runtime: Node.js (Prisma 7 typically targets current LTS; see team environment)
- Framework: Express `^5.2.1`
- Primary Database: PostgreSQL via Prisma (client + CLI `^7.4.2`)
- Legacy Dependency Present: Mongoose (no active MongoDB route surface)


## Current State Snapshot

- Multi-tenant design from original docs is removed in runtime code; system now operates as single-tenant.
- Primary data access is Prisma under [src/infrastructure/prisma](src/infrastructure/prisma) (`prisma.client.ts`, repositories, mappers, `where_clauses`, `exceptions.ts`).
- Permission model is DB-backed and auto-synced at startup from `PERMISSIONS`.
- **Implemented HTTP modules** include: health, auth, users, employees, partners, permissions, user-permissions, shows, show-hosts, satellite schedules (with nested schedule blocks and broadcast slots), telegram groups/members, **sales follow-up** (customers, communication logs, media monitoring, categories, sub-categories, show segment slots, customer–show suitability), **media packs**, **advert packages** (catalog + multipart image upload), **advert-package ↔ media-pack** junction.
- **Prisma models without active HTTP/domain modules yet**: `Advert` (campaign), `Payment`, `Compensation`; **SatelliteLog** has a domain entity only—no upload/verification workflow. Planned build order: **advert placement** (binding to [BroadcastSlot](src/domain/entities/broadcast-slot.entity.ts)) → **advert finance** → **compensation**.
- **AlertService** cron hook exists; off-air/expiry logic is not implemented.
- For layering issues and remediation hints, see [docs/clean-architecture-violations.md](docs/clean-architecture-violations.md).


## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | (see CI / local; Prisma 7 aligned) |
| Language | TypeScript | `^5.9.3` |
| Module system | ESM | `type: module`, NodeNext resolution |
| Dev server | tsx | `^4.19.0` |
| API | Express | `^5.2.1` |
| ORM | Prisma Client + Prisma CLI + `@prisma/adapter-pg` | `^7.4.2` |
| Database | PostgreSQL | via `DATABASE_URL` |
| Auth | jsonwebtoken | `^9.0.3` |
| Validation | Zod | `^4.3.5` |
| Hashing | bcryptjs | `^3.0.3` |
| Scheduling | node-cron | `^4.2.1` |
| Email | Nodemailer | `^7.0.12` |
| Uploads | multer | `^2.0.2` |
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
├── PROJECT_INDEX_AUTO.md
├── TODO.md
├── package.json
└── tsconfig.json
```


## Architecture and Layer Responsibilities

### 1) Domain Layer (`src/domain`)

Core business types and contracts (approximate counts from current tree):

- **Entities (`23`)**: user, employee, partner, permission, user-permissions, show, show-host, satellite-schedule, satellite-schedule-block, broadcast-slot, satellite-log, telegram-groups, telegram-group-member, customer, communication-log, category, sub-category, media-monitoring-record, show-segment-slot, customer-show-suitability, media-pack, advert-package, advert-package-media-pack.
- **Repository contracts (`23` files under `domain/repositories/`)**: includes `*.repository.interface.ts`, `*.repo.ts`, `base.repository.interface.ts`, etc.
- **Filter/summary interfaces**: under `domain/interfaces/` (e.g. broadcast-slot, customer, satellite-schedule, advert-package).
- **Domain services (`IStorageService`, calendar, hash, email, schedule handlers, business-ref)** under `domain/services/`.
- **Value objects (`5`)**: money, percentage, schedule-slot, calendar-date, ethiopian-time.
- **Enums (`14` enum files + `enums/index.ts`)**: user roles, show type, advert status, payment status, broadcast slot status, customer status, revenue share type, user ref model, sex, status, broadcast type, satellite schedule status/type, day-of-week, etc.
- **Domain errors**: e.g. `EntityNotFoundError`, `EntityAlreadyExistsError`, `ValidationError`, communication-log write-only error.

**Note:** Prisma `Advert` / `Payment` / `Compensation` tables exist; there is **no** `advert.entity.ts` or advert repository interface yet—intentional gap until the advert placement module is built.

### 2) Application Layer (`src/application`)

- **Services (`3`)**:
  - `AuthService`: access/refresh token generation and verification.
  - `AnalyticsService`: aggregations (sales/summary-oriented).
  - `AlertService`: scheduled alert entry point (**TODO**: implement detection/notification).
- **Use-cases (`123`)**, grouped by folders including:
  - users, partners, permissions, user-permissions
  - shows, show-hosts
  - satellite-schedules, satellite-schedule-blocks, broadcast-slots
  - telegram-groups, telegram-group-members
  - customers, communication-logs, media-monitoring
  - categories, sub-categories, show-segment-slots, customer-show-suitability
  - media-pack, advert-package, advert-package-media-pack  
  **No** `adverts/` or `finance/` use-case folders yet (campaign and payment flows not implemented).


### 3) Infrastructure Layer (`src/infrastructure`)

Approx. **89** TypeScript files, notably:

- **Prisma**: client (`src/infrastructure/prisma/prisma.client.ts`), repositories, `model_entity_mappers/*`, `where_clauses/*`, `exceptions.ts`, `schema.prisma`, migrations, seed.
- **Middleware**: `auth.middleware.ts`, `permission.middleware.ts`, `advert-package-upload.middleware.ts`.
- **Services**: `permission-sync.service.ts`, `scheduler.service.ts`, `hash.service.ts`, calendar mirror, storage factory (`storage.factory.ts`, local + S3 stub), optional business-ref helper.
- **Config**: `jwt.config.ts`, `email.config.ts`, `database.config.ts` (legacy mongoose connector).
- **External**: `external/email/email.service.ts` and templates under `external/email/templates/`.


### 4) Presentation Layer (`src/presentation`)

- `app.ts`: Express wiring (JSON, CORS, Helmet, Morgan, `/api` router, static `/uploads` when not using S3 storage, 404 + global error handler).
- **Route modules (`23` files + `routes/index.ts`)**: top-level mounts in [src/presentation/routes/index.ts](src/presentation/routes/index.ts); nested routers for schedule blocks and broadcast slots under `/satellite-schedules/:scheduleId/...`.
- **Controllers (`24` handler modules + `health.controller.ts`; plus `broadcast-slot-response.formatter.ts`)**.
- **Request DTOs (`65` files)** with Zod.
- **Query mappers (`18`)** under `presentation/mappers/`.
- **Validators**: `validate-body.ts`, `validate-query.ts`, multipart validators for advert packages.


### 5) Shared Layer (`src/shared`)

- Permissions constants (`PERMISSIONS`)
- Error constructor and HTTP code registry
- Password and error utility helpers


## Bootstrap and Runtime Flow

### Startup ([src/index.ts](src/index.ts))

1. Loads env via `import 'dotenv/config'`.
2. Connects Prisma (`connectPrisma` from `src/infrastructure/prisma`).
3. Fires permission sync in background (`PermissionSyncService.syncPermissions()`).
4. Schedules daily 6:00 AM job (`SchedulerService` → `AlertService.processOffAirAlerts()`).
5. Builds Express app with `createApp({ storageService })` ([src/presentation/app.ts](src/presentation/app.ts)); API router receives storage deps for advert-package image upload.
6. Listens on `PORT` (default `3000`).
7. Graceful shutdown on `SIGTERM`/`SIGINT` (server close + `disconnectPrisma`).

### Request Execution Flow

1. `presentation/routes/*` selects endpoint.
2. Zod validation (`validateBody` / `validateQuery` / multipart validators).
3. `authMiddleware` verifies bearer JWT and sets `req.user`.
4. `requirePermission` checks permission slug.
5. Controller invokes use-case or coordinates repositories.
6. Use-case uses repository interface (implementation in infrastructure).
7. Prisma repository executes SQL.
8. Success envelope or global error handler.


## Module and Endpoint Index

All top-level routes are mounted under `/api` via [src/presentation/routes/index.ts](src/presentation/routes/index.ts) (`createApiRouter`).

| Module | Base Path | Route file(s) | Primary controller(s) | Notes |
|--------|-----------|---------------|------------------------|-------|
| Health | `/health` | `routes/index.ts` | `health.controller.ts` | Public |
| Auth | `/auth` | `auth.routes.ts` | `auth.controller.ts` | Login, register, refresh |
| Users | `/users` | `users.routes.ts` | `user.controller.ts` | Admin + `me` |
| Shows | `/shows` | `shows.routes.ts` | `show.controller.ts` | CRUD |
| Show hosts | `/show-hosts` | `show-hosts.routes.ts` | `show-host.controller.ts` | Host assignment + revenue share metadata |
| Permissions | `/permissions` | `permissions.routes.ts` | `permission.controller.ts` | CRUD/query |
| User permissions | `/user-permissions` | `user-permissions.routes.ts` | `user-permission.controller.ts` | Grant/revoke/list |
| Employees | `/employees` | `employee.route.ts` | `employee.controller.ts` | Employee + linked user |
| Partners | `/partners` | `partner.route.ts` | `partner.controller.ts` | CRUD + status |
| Media packs | `/media-packs` | `media-pack.route.ts` | `media-pack.controller.ts` | CRUD + `POST .../with-ad-packages` |
| Advert packages | `/advert-packages` | `advert-package.route.ts` | `advert-package.controller.ts` | Multipart create/update; uses `storageService` |
| Advert-package ↔ media-pack | `/advert-package-media-packs` | `advert-package-media-packs.routes.ts` | `advert-package-media-pack.controller.ts` | Junction CRUD |
| Satellite schedules | `/satellite-schedules` | `satellite-schedules.routes.ts` (+ nested) | `satellite-schedule.controller.ts` | CRUD, `with-blocks`, nested routes below |
| Schedule blocks | `/satellite-schedules/:scheduleId/blocks` | `schedule-blocks.routes.ts` | `schedule-block.controller.ts` | CRUD + batch |
| Broadcast slots | `/satellite-schedules/:scheduleId/broadcast-slots` | `broadcast-slots.routes.ts` | `broadcast-slot.controller.ts` | List/update/delete; materialize slots |
| Customers | `/customers` | `customers.routes.ts` | `customer.controller.ts` | Sales follow-up |
| Communication logs | `/communication-logs` | `communication-logs.routes.ts` | `communication-log.controller.ts` | Append-only log |
| Media monitoring | `/media-monitoring` | `media-monitoring.routes.ts` | `media-monitoring.controller.ts` | Competitor tracking |
| Categories | `/categories` | `categories.routes.ts` | `category.controller.ts` | |
| Sub-categories | `/sub-categories` | `sub-categories.routes.ts` | `sub-category.controller.ts` | |
| Show segment slots | `/show-segment-slots` | `show-segment-slots.routes.ts` | `show-segment-slot.controller.ts` | Segment industries |
| Customer–show suitability | `/customer-show-suitability` | `customer-show-suitability.routes.ts` | `customer-show-suitability.controller.ts` | |
| Telegram groups | `/telegram-groups` | `telegram-groups.routes.ts` | `telegram-group.controller.ts` | |
| Telegram group members | `/telegram-group-members` | `telegram-group-member.routes.ts` | `telegram-group-member.controller.ts` | |


## Data Model Index (Prisma)

Prisma schema: [src/infrastructure/prisma/schema.prisma](src/infrastructure/prisma/schema.prisma)  
Prisma CLI config: [prisma.config.ts](prisma.config.ts)

### Enums in Prisma

- `UserRefModel`: `Partner`, `Employee`, `Internal`

### Models (tables)

- `User` (`users`)
- `Show` (`shows`)
- `ShowHost` (`show_hosts`)
- `Category` / `SubCategory`
- `Customer` (`customers`)
- `CommunicationLog` (`communication_logs`)
- `MediaMonitoringRecord` (`media_monitoring_records`)
- `ShowSegmentSlot` / `CustomerShowSuitability`
- **`Advert` (`adverts`)** — schema only (campaign module not exposed)
- `Partner` (`partners`)
- `Employee` (`employees`)
- **`Payment` (`payments`)** — schema only
- **`Compensation` (`compensations`)** — schema only
- `SatelliteSchedule` / `SatelliteScheduleBlock` / `BroadcastSlot`
- **`SatelliteLog` (`satellite_logs`)** — no upload API yet
- `MediaPack` / `AdvertPackage` / `AdvertPackageShow` / `AdvertPackageMediaPack`
- `TelegramGroup` / `TelegramGroupMember`
- `Permission` / `UserPermission` (`user_permissions`)

### Relationship highlights

- `User` ↔ `Partner` or `Employee` via `refModel` + optional FKs.
- `UserPermission` with optional granter and expiration.
- `Customer` → `CommunicationLog` (immutable in domain rules), `Advert`, media monitoring, suitability links.
- `Advert` → optional `payments` / `compensations` (when finance modules exist).
- `SatelliteSchedule` → `SatelliteScheduleBlock` → `BroadcastSlot` (materialized air instances).
- `AdvertPackage` ↔ `Show` (`AdvertPackageShow`), ↔ `MediaPack` (`AdvertPackageMediaPack`).

### Migration status

**30** SQL migration folders under [src/infrastructure/prisma/migrations](src/infrastructure/prisma/migrations) (each with `migration.sql`).


## Security Model

### Authentication

- JWT access + refresh via `AuthService`.
- Access token payload includes user identity and resolved permission slugs (see auth implementation).
- `authMiddleware` reads Bearer token and sets `req.user`.

### Authorization

- Permission slugs: [src/shared/constants/permissions.constants.ts](src/shared/constants/permissions.constants.ts).
- `requirePermission(slug)` on protected routes.
- `PermissionSyncService` ensures DB rows exist for defined permissions at startup.


## Error Handling Strategy

- Domain/application errors → HTTP mapping in [src/shared/utils/global-error-handler.ts](src/shared/utils/global-error-handler.ts).
- Prisma errors → [src/infrastructure/prisma/exceptions.ts](src/infrastructure/prisma/exceptions.ts) (`P2002`, `P2003`, `P2025`, fallback).
- Validation failures → normalized client errors via shared `Exception` + codes.


## Background Jobs and Async Processes

- Daily cron (`0 6 * * *`) → `AlertService.processOffAirAlerts()` (**unimplemented body**).
- Permission sync: fire-and-forget on bootstrap.


## Dependencies by Concern

- API: `express`, `cors`, `helmet`, `morgan`, `multer`
- Data: `@prisma/client`, `prisma`, `@prisma/adapter-pg`, `mongoose` (legacy)
- Auth: `jsonwebtoken`, `bcryptjs`
- Validation: `zod`
- Scheduling: `node-cron`
- Email: `nodemailer`
- Utilities: `dotenv`, `dayjs`, `uuid`, `ethiopian-calendar-date-converter`
- Dev/test: `typescript`, `tsx`, `jest`, `ts-jest`, `supertest`, ESLint, Prettier


## Build, Run, and Test

Scripts ([package.json](package.json)):

- `npm run dev` — `tsx watch src/index.ts`
- `npm run build` — `prisma generate && tsc`
- `npm run start` — `node --import tsx dist/index.js`
- `npm run lint` — ESLint on `src/**/*.{ts,tsx}`
- `npm run format` — Prettier
- `npm run test` — Jest (serial, ESM config in `jest.config.mjs`)

### Tests present

- [src/tests/integration/health.spec.ts](src/tests/integration/health.spec.ts)
- [src/tests/unit/money.spec.ts](src/tests/unit/money.spec.ts)
- [src/tests/unit/advert-package-media-pack-query-options.mapper.spec.ts](src/tests/unit/advert-package-media-pack-query-options.mapper.spec.ts)


## Environment Variables

| Variable | Purpose | Notes |
|----------|---------|--------|
| `PORT` | HTTP port | default `3000` |
| `DATABASE_URL` | PostgreSQL for Prisma | required |
| `JWT_SECRET` | JWT signing | required for auth |
| `SMTP_*`, `EMAIL_FROM` | Outbound email | see `email.config.ts` |
| `DEFAULT_PASSWORD` | User reset fallback | `user.controller.ts` |
| `NODE_ENV` | Environment mode | various |
| `MONGO_URI` | Legacy mongoose | `database.config.ts` |
| `STORAGE_TYPE` | `s3` vs local | `storage.factory.ts`; local serves `./uploads` at `/uploads` |
| `BASE_URL` | Public base for stored file URLs | comment/TODO in storage factory — set for local URLs |
| `CDN_MOCK_BASE_URL` | Optional stub CDN base | S3 stub |


## Known Gaps and Technical Debt

- `docs/technical_specifications.mdc` may still reference older multi-tenant/Mongo shapes; runtime is single-tenant + Prisma.
- Campaign **Advert** placement, **Payment** workflows, **Compensation** workflows: schema-ready, application layer not built.
- **Satellite log** ingestion and schedule-vs-log verification: not implemented.
- `AlertService` stub; email templates for compensation/payment still basic (see `TODO.md`).
- Layering: controllers often construct infrastructure repositories directly; see [docs/clean-architecture-violations.md](docs/clean-architecture-violations.md).


## Approximate File Count Summary

| Area | Count |
|------|-------|
| Domain entities | 23 |
| Domain repository / repo contract files | 23 |
| Domain enum files (incl. index) | 15 |
| Domain value-objects | 5 |
| Application services | 3 |
| Application use-cases | 123 |
| Infrastructure TS files (~) | 89 |
| Presentation route TS files | 24 |
| Presentation controllers | ~25 TS files in `controllers/` |
| Presentation DTO TS files | 65 |
| Presentation mappers | 18 |
| Tests | 3 spec files |
| Total project TS/TSX under `src` | Coverage varies — treat as approximate |


## References

- Functional requirements: [docs/requirements.mdc](docs/requirements.mdc)
- Architecture debt: [docs/clean-architecture-violations.md](docs/clean-architecture-violations.md)
- Legacy architecture notes: [docs/technical_specifications.mdc](docs/technical_specifications.mdc)
- API collection: [postman_collection.json](postman_collection.json)
- Tasks: [TODO.md](TODO.md)


*Last Updated: March 29, 2026*
