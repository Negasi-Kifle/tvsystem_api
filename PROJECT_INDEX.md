# Abbay TV Sales Automation System - Project Index

## Overview

A single-tenant platform for TV broadcasting sales automation built for Abbay TV. The system automates end-to-end TV advertising sales operations including show management, ad placement, satellite scheduling, customer communications, finance, and compensation workflows.

**Project Name:** `media_automation`
**Version:** 1.0.0
**Language:** TypeScript (strict mode)
**Runtime:** Node.js
**Framework:** Express.js v5
**Database:** PostgreSQL (Prisma ORM)
**Architecture:** Clean Architecture with Domain-Driven Design

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Runtime | Node.js | - |
| Framework | Express.js | ^5.2.1 |
| Database | PostgreSQL (Prisma) | ^6.19.2 |
| Database (Legacy) | MongoDB (Mongoose) | ^9.1.3 |
| Language | TypeScript | ^5.9.3 |
| Authentication | JWT (jsonwebtoken) | ^9.0.3 |
| Validation | Zod | ^4.3.5 |
| Email | Nodemailer | ^7.0.12 |
| Scheduling | node-cron | ^4.2.1 |
| Password Hashing | bcryptjs | ^3.0.3 |
| Testing | Jest + Supertest | ^29.7.0 |
| File Upload | Multer | ^2.0.2 |

---

## Project Structure

```
tvsystem_api/
├── prisma/
│   └── schema.prisma           # PostgreSQL database schema
│
├── src/
│   ├── domain/                 # Business Logic Layer
│   │   ├── entities/           # Core business objects
│   │   ├── enums/              # Domain enumerations
│   │   ├── interfaces/         # Contracts (repositories/services)
│   │   └── value-objects/      # Immutable value objects
│   │
│   ├── application/            # Application Logic Layer
│   │   ├── services/           # Application services
│   │   └── use-cases/          # Business operations
│   │
│   ├── infrastructure/         # External Concerns Layer
│   │   ├── config/             # Configuration files
│   │   ├── database/
│   │   │   ├── models/         # MongoDB models (legacy/reference)
│   │   │   ├── repositories/   # MongoDB repositories (legacy/reference)
│   │   │   └── prisma/         # PostgreSQL Prisma repositories (PRIMARY)
│   │   │       ├── prisma.client.ts
│   │   │       └── repositories/
│   │   ├── external/           # External service implementations
│   │   ├── middlewares/        # Express middlewares
│   │   └── services/           # Infrastructure services
│   │
│   ├── presentation/           # API Layer
│   │   ├── controllers/        # Route handlers
│   │   ├── dtos/               # Data Transfer Objects
│   │   ├── routes/             # Express route definitions
│   │   └── validators/         # Request validation
│   │
│   ├── shared/                 # Shared Utilities
│   │   ├── constants/          # System constants
│   │   └── utils/              # Utility functions
│   │
│   └── index.ts                # Application entry point
│
├── tests/
│   ├── integration/            # Integration tests
│   └── unit/                   # Unit tests
│
├── system_design/              # Design documentation
│   ├── requirements.mdc        # Functional requirements
│   └── technical_specifications.mdc
│
└── [Config files]              # Project configuration
```

---

## Domain Layer

### Entities

| Entity | File | Description |
|--------|------|-------------|
| User | `domain/entities/user.entity.ts` | System user with roles and permissions |
| Show | `domain/entities/show.entity.ts` | TV show (InHouse/Outsourced) with scheduling |
| Advert | `domain/entities/advert.entity.ts` | Advertisement campaign linked to show/customer |
| Customer | `domain/entities/customer.entity.ts` | Advertiser company with contacts |
| Partner | `domain/entities/partner.entity.ts` | External partner with revenue share |
| Payment | `domain/entities/payment.entity.ts` | Financial transactions with installments |
| Compensation | `domain/entities/compensation.entity.ts` | Missed ad compensation records |
| SatelliteLog | `domain/entities/satellite-log.entity.ts` | Broadcast verification logs |
| MediaPack | `domain/entities/media-pack.entity.ts` | Advertising packages with versioning |

### Enums

| Enum | File | Values |
|------|------|--------|
| UserRole | `domain/enums/user-role.enum.ts` | CEO, SalesRep, SalesAssistant, SalesManager, SatelliteManager, FinanceManager, Partner |
| ShowType | `domain/enums/show-type.enum.ts` | InHouse, Outsourced |
| AdvertStatus | `domain/enums/advert-status.enum.ts` | Draft, Scheduled, Active, Completed, Failed |
| PaymentStatus | `domain/enums/payment-status.enum.ts` | Pending, Sent, Overdue, Paid, Failed |

### Value Objects

| Value Object | File | Purpose |
|--------------|------|---------|
| Money | `domain/value-objects/money.value-object.ts` | Currency handling with add/subtract/multiply (default: ETB) |
| Percentage | `domain/value-objects/percentage.value-object.ts` | Commission/revenue share calculations (0-100) |
| CalendarDate | `domain/value-objects/calendar-date.value-object.ts` | Dual calendar support (Gregorian/Ethiopian) |
| ScheduleSlot | `domain/value-objects/schedule-slot.value-object.ts` | Time slot management with duration calculation |

### Interfaces

#### Repository Interfaces

| Interface | File |
|-----------|------|
| BaseRepositoryInterface | `domain/interfaces/repositories/base.repository.interface.ts` |
| ShowRepositoryInterface | `domain/interfaces/repositories/show.repository.interface.ts` |
| AdvertRepositoryInterface | `domain/interfaces/repositories/advert.repository.interface.ts` |
| UserRepositoryInterface | `domain/interfaces/repositories/user.repository.interface.ts` |

#### Service Interfaces

| Interface | File |
|-----------|------|
| EmailServiceInterface | `domain/interfaces/services/email.service.interface.ts` |
| CalendarServiceInterface | `domain/interfaces/services/calendar.service.interface.ts` |
| CompensationCalculatorInterface | `domain/interfaces/services/compensation-calculator.interface.ts` |

---

## Application Layer

### Services

| Service | File | Purpose |
|---------|------|---------|
| AuthService | `application/services/auth.service.ts` | JWT token generation and verification |
| AlertService | `application/services/alert.service.ts` | Off-air alerts processing (scheduled daily at 6 AM) |
| AnalyticsService | `application/services/analytics.service.ts` | Sales analytics aggregation |

### Use Cases

| Use Case | File | Description |
|----------|------|-------------|
| CreateShowUseCase | `application/use-cases/shows/create-show.use-case.ts` | Create new TV show |
| ListShowsUseCase | `application/use-cases/shows/list-shows.use-case.ts` | List all shows |
| CreateAdvertUseCase | `application/use-cases/adverts/create-advert.use-case.ts` | Create advertisement |
| ProcessCompensationUseCase | `application/use-cases/adverts/process-compensation.use-case.ts` | Handle missed ad compensation |
| GeneratePaymentRequestUseCase | `application/use-cases/finance/generate-payment-request.use-case.ts` | Generate and send payment requests |

---

## Infrastructure Layer

### Configuration

| Config | File | Environment Variables |
|--------|------|----------------------|
| Database | `infrastructure/config/database.config.ts` | MONGO_URI (legacy) |
| JWT | `infrastructure/config/jwt.config.ts` | JWT_SECRET |
| Email | `infrastructure/config/email.config.ts` | SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM |

### PostgreSQL Schema (Prisma)

Schema location: `prisma/schema.prisma`

| Model | Table | Description |
|-------|-------|-------------|
| User | users | System users with roles/permissions |
| Show | shows | TV shows with JSON schedule |
| Customer | customers | Advertiser companies |
| Advert | adverts | Advertisement campaigns |
| Partner | partners | External partners |
| Payment | payments | Financial transactions |
| Compensation | compensations | Missed ad compensation |
| SatelliteLog | satellite_logs | Broadcast verification |
| MediaPack | media_packs | Advertising packages |

### PostgreSQL Repositories

| Repository | File | Implements |
|------------|------|------------|
| PrismaBaseRepository | `infrastructure/database/prisma/repositories/base.repository.ts` | Base class with Prisma client |
| UserRepository | `infrastructure/database/prisma/repositories/user.repository.ts` | UserRepositoryInterface |
| ShowRepository | `infrastructure/database/prisma/repositories/show.repository.ts` | ShowRepositoryInterface |
| AdvertRepository | `infrastructure/database/prisma/repositories/advert.repository.ts` | AdvertRepositoryInterface |
| PaymentRepository | `infrastructure/database/prisma/repositories/payment.repository.ts` | Payment operations |
| CompensationRepository | `infrastructure/database/prisma/repositories/compensation.repository.ts` | Compensation operations |

### MongoDB Models (LEGACY - kept for reference)

| Model | File | Collections |
|-------|------|-------------|
| UserModel | `infrastructure/database/models/user.model.ts` | users |
| ShowModel | `infrastructure/database/models/show.model.ts` | shows |
| AdvertModel | `infrastructure/database/models/advert.model.ts` | adverts |
| PaymentModel | `infrastructure/database/models/payment.model.ts` | payments |
| CompensationModel | `infrastructure/database/models/compensation.model.ts` | compensations |

### MongoDB Repositories (LEGACY - kept for reference)

| Repository | File | Implements |
|------------|------|------------|
| BaseRepository | `infrastructure/database/repositories/base.repository.ts` | Generic CRUD operations |
| UserRepository | `infrastructure/database/repositories/user.repository.ts` | UserRepositoryInterface |
| ShowRepository | `infrastructure/database/repositories/show.repository.ts` | ShowRepositoryInterface |
| AdvertRepository | `infrastructure/database/repositories/advert.repository.ts` | AdvertRepositoryInterface |
| PaymentRepository | `infrastructure/database/repositories/payment.repository.ts` | - |
| CompensationRepository | `infrastructure/database/repositories/compensation.repository.ts` | - |

### Middlewares

| Middleware | File | Purpose |
|------------|------|---------|
| authMiddleware | `infrastructure/middlewares/auth.middleware.ts` | JWT verification |
| requirePermission | `infrastructure/middlewares/permission.middleware.ts` | PBAC enforcement |

### External Services

| Service | File | Description |
|---------|------|-------------|
| EmailService | `infrastructure/external/email/email.service.ts` | Nodemailer implementation |
| SchedulerService | `infrastructure/services/scheduler.service.ts` | Cron job scheduling |

### Email Templates

| Template | File |
|----------|------|
| Ad Schedule | `infrastructure/external/email/templates/ad-schedule.html` |
| Compensation | `infrastructure/external/email/templates/compensation.html` |

---

## Presentation Layer

### API Routes

| Route | File | Base Path |
|-------|------|-----------|
| Health | `presentation/routes/index.ts` | `/api/health` |
| Auth | `presentation/routes/auth.routes.ts` | `/api/auth` |
| Users | `presentation/routes/users.routes.ts` | `/api/users` |
| Shows | `presentation/routes/shows.routes.ts` | `/api/shows` |
| Adverts | `presentation/routes/adverts.routes.ts` | `/api/adverts` |
| Finance | `presentation/routes/finance.routes.ts` | `/api/finance` |
| Compensations | `presentation/routes/compensation.routes.ts` | `/api/compensations` |
| Analytics | `presentation/routes/analytics.routes.ts` | `/api/analytics` |

### API Endpoints

| Method | Endpoint | Auth | Permission | Controller |
|--------|----------|------|------------|------------|
| GET | `/api/health` | No | - | health |
| POST | `/api/auth/register` | No | - | register |
| POST | `/api/auth/login` | No | - | login |
| POST | `/api/auth/refresh` | No | - | refreshToken |
| GET | `/api/users/me` | Yes | - | me |
| POST | `/api/users` | Yes | manage_users | createUser |
| PATCH | `/api/users/:userId/active` | Yes | manage_users | setUserActive |
| POST | `/api/users/reset-password` | No | - | requestPasswordReset |
| GET | `/api/shows` | Yes | - | listShows |
| POST | `/api/shows` | Yes | manage_shows | createShow |
| POST | `/api/adverts` | Yes | manage_adverts | createAdvert |
| POST | `/api/finance/payments` | Yes | manage_finance | createPaymentRequest |
| POST | `/api/compensations` | Yes | manage_adverts | proposeCompensation |
| GET | `/api/analytics/summary` | Yes | view_analytics | analyticsSummary |

### Controllers

| Controller | File | Handlers |
|------------|------|----------|
| health | `presentation/controllers/health.controller.ts` | health |
| auth | `presentation/controllers/auth.controller.ts` | login, register, refreshToken |
| user | `presentation/controllers/user.controller.ts` | createUser, me, setUserActive, requestPasswordReset |
| show | `presentation/controllers/show.controller.ts` | createShow, listShows |
| advert | `presentation/controllers/advert.controller.ts` | createAdvert |
| finance | `presentation/controllers/finance.controller.ts` | createPaymentRequest |
| compensation | `presentation/controllers/compensation.controller.ts` | proposeCompensation |
| analytics | `presentation/controllers/analytics.controller.ts` | analyticsSummary |

### DTOs (Zod Schemas)

| DTO | File | Fields |
|-----|------|--------|
| loginDto | `presentation/dtos/requests/login.dto.ts` | email, password |
| registerDto | `presentation/dtos/requests/register.dto.ts` | email, password, fullName |
| refreshTokenDto | `presentation/dtos/requests/refresh-token.dto.ts` | refreshToken |
| createUserDto | `presentation/dtos/requests/create-user.dto.ts` | email, fullName, password, roles, permissions, isActive |
| createShowDto | `presentation/dtos/requests/create-show.dto.ts` | title, type, durationMinutes, maxAdLengthSeconds, schedule, assignedStaff |
| createAdvertDto | `presentation/dtos/requests/create-advert.dto.ts` | showId, customerId, slot, contractDetails |
| createPaymentDto | `presentation/dtos/requests/create-payment.dto.ts` | advertId, installmentLabel, amount, currency, dueDate, customerEmail |
| compensationDto | `presentation/dtos/requests/compensation.dto.ts` | advertId, proposal, customerEmail |

---

## Shared Utilities

### Constants

| Constant | File | Values |
|----------|------|--------|
| PERMISSIONS | `shared/constants/permissions.constants.ts` | manage_users, manage_shows, manage_schedules, manage_media_packs, manage_employees, manage_partners, manage_adverts, manage_finance, view_analytics |

### Utilities

| Utility | File | Functions |
|---------|------|-----------|
| password | `shared/utils/password.ts` | hashPassword, comparePassword |
| error-handler | `shared/utils/error-handler.ts` | sendErrorResponse, errorHandler |

---

## Authentication & Authorization

### Authentication Flow

1. User registers/logs in with email/password
2. Server issues JWT access token (15m) and refresh token (7d)
3. Client includes `Authorization: Bearer <token>` header
4. `authMiddleware` verifies token and populates `req.user`

### JWT Payload Structure

```typescript
{
  sub: string;        // User ID
  roles: string[];    // User roles
  permissions: string[];  // User permissions
}
```

### Permission-Based Access Control (PBAC)

- Permissions defined in `PERMISSIONS` constant
- `requirePermission(permission)` middleware enforces access
- CEO has superuser access to define all permissions

---

## Scheduled Tasks

| Task | Schedule | Service | Description |
|------|----------|---------|-------------|
| Off-Air Alerts | Daily 6:00 AM | AlertService.processOffAirAlerts() | Check shows/ads ending within 24 hours |

---

## Scripts

```bash
npm run dev      # Start development server (ts-node-dev)
npm run build    # Compile TypeScript
npm run start    # Run production build
npm run lint     # Run ESLint
npm run format   # Run Prettier
npm run test     # Run Jest tests
npm run test:watch  # Run tests in watch mode
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DATABASE_URL | PostgreSQL connection string (Prisma) | - |
| MONGO_URI | MongoDB connection string (legacy) | mongodb://localhost:27017/abbaytv |
| JWT_SECRET | JWT signing secret | changeme |
| SMTP_HOST | SMTP server host | - |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_USER | SMTP username | - |
| SMTP_PASS | SMTP password | - |
| EMAIL_FROM | Default sender email | no-reply@example.com |
| NODE_ENV | Environment mode | development |

---

## Tests

| Type | Location | Files |
|------|----------|-------|
| Unit | `tests/unit/` | money.spec.ts |
| Integration | `tests/integration/` | health.spec.ts |

---

## TODOs in Codebase

| File | TODO |
|------|------|
| `application/services/alert.service.ts` | Implement show/ad expiry detection and notification delivery |
| `application/use-cases/adverts/process-compensation.use-case.ts` | Send compensation proposal email with actionable link |
| `application/use-cases/finance/generate-payment-request.use-case.ts` | Send formatted payment request email with invoice details |
| `presentation/controllers/user.controller.ts` | Implement password reset token generation and email delivery |
| `infrastructure/external/email/templates/compensation.html` | Replace with branded compensation proposal template |
| `infrastructure/external/email/templates/ad-schedule.html` | Replace with branded schedule template |

---

## Key Business Rules

1. **24-Hour Alert Rule:** System checks daily at 6:00 AM for shows/ads ending within 24 hours
2. **Compensation Workflow:** Must allow customer feedback and alternative proposals
3. **Revenue Sharing:** Automatic calculation based on contract terms
4. **Satellite Log Verification:** Manual upload process (no direct integration)
5. **Calendar Support:** All date operations support Ethiopian and Gregorian calendars
6. **Permission Hierarchy:** CEO has superuser access to define all permissions

---

## User Roles & Responsibilities

| Role | Responsibilities |
|------|------------------|
| CEO | Manages shows, employees, partners, schedules, media packs; Views analytics; Full system access |
| SalesManager | Monitors communication logs; Reassigns sales reps |
| SalesRep | Records customers/leads; Logs communications; Records sales deals |
| SalesAssistant | Schedules ads; Verifies delivery; Manages compensations; Generates reports |
| SatelliteManager | Verifies ad placement integrity; Provides broadcast logs |
| FinanceManager | Manages payment requests; Tracks payments; Disburses commissions |
| Partner | Receives revenue share reports |

---

## File Count Summary

| Layer | Files |
|-------|-------|
| Domain (entities) | 9 |
| Domain (enums) | 4 |
| Domain (interfaces) | 7 |
| Domain (value-objects) | 4 |
| Application (services) | 3 |
| Application (use-cases) | 5 |
| Infrastructure (config) | 3 |
| Infrastructure (database) | 10 |
| Infrastructure (middlewares) | 2 |
| Infrastructure (external) | 3 |
| Presentation (controllers) | 7 |
| Presentation (routes) | 8 |
| Presentation (dtos) | 6 |
| Presentation (validators) | 1 |
| Shared | 3 |
| Tests | 2 |
| **Total Source Files** | ~77 |

---

*Last Updated: January 18, 2026*
