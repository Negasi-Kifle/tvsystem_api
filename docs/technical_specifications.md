**1. SYSTEM OVERVIEW**

Build a multi-tenant SaaS platform for TV broadcasting sales automation based on the provided Abbay TV system design. The system must support multiple independent TV stations (tenants) with complete data isolation. Each tenant operates as if they have their own dedicated system.

Core Objectives:

- Automate end-to-end TV advertising sales operations
- Provide full lifecycle management from lead to payment distribution
- Support both Ethiopian and Gregorian calendars
- Enable complete traceability and auditability

**2. Tech Stack**
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB
- Language: TypeScript (strict mode)
- Authentication: JWT with refresh tokens
- Email: Nodemailer
- File Upload: Multer for satellite log uploads


**3. Architecture**
Clean Architecture with Domain-Driven Design:

src/
│
├── domain/                           # BUSINESS LOGIC LAYER
│   ├── entities/                     # Core business objects
│   │   ├── tenant.entity.ts          # Tenant entity (root)
│   │   ├── user.entity.ts            # User with roles
│   │   ├── show.entity.ts            # TV show with scheduling
│   │   ├── advert.entity.ts          # Advertisement campaign
│   │   ├── customer.entity.ts        # Advertiser companies
│   │   ├── satellite-log.entity.ts   # Broadcast verification
│   │   ├── payment.entity.ts         # Financial transactions
│   │   ├── partner.entity.ts         # External partners
│   │   ├── media-pack.entity.ts      # Advertising packages
│   │   └── compensation.entity.ts    # Missed ad compensation
│   │
│   ├── value-objects/                # Immutable value objects
│   │   ├── money.value-object.ts     # Currency handling
│   │   ├── schedule-slot.value-object.ts # Time slot management
│   │   ├── percentage.value-object.ts # Commission calculations
│   │   └── calendar-date.value-object.ts # Dual calendar support
│   │
│   ├── interfaces/                   # Repository & service contracts
│   │   ├── repositories/             # Data persistence contracts
│   │   │   ├── show.repository.interface.ts
│   │   │   ├── advert.repository.interface.ts
│   │   │   └── user.repository.interface.ts
│   │   │
│   │   └── services/                 # External service contracts
│   │       ├── email.service.interface.ts
│   │       ├── calendar.service.interface.ts
│   │       └── compensation-calculator.interface.ts
│   │
│   └── enums/                        # Domain enums
│       ├── user-role.enum.ts
│       ├── show-type.enum.ts
│       ├── advert-status.enum.ts
│       └── payment-status.enum.ts
│
├── application/                      # APPLICATION LOGIC LAYER
│   ├── use-cases/                    # Business operations
│   │   ├── shows/
│   │   │   ├── create-show.use-case.ts
│   │   │   ├── schedule-satellite.use-case.ts
│   │   │   └── manage-show.use-case.ts
│   │   │
│   │   ├── adverts/
│   │   │   ├── create-advert.use-case.ts
│   │   │   ├── schedule-advert.use-case.ts
│   │   │   ├── verify-ad-delivery.use-case.ts
│   │   │   └── process-compensation.use-case.ts
│   │   │
│   │   ├── sales/
│   │   │   ├── record-lead.use-case.ts
│   │   │   ├── log-communication.use-case.ts
│   │   │   └── generate-contract.use-case.ts
│   │   │
│   │   ├── finance/
│   │   │   ├── calculate-commission.use-case.ts
│   │   │   ├── distribute-revenue.use-case.ts
│   │   │   └── generate-payment-request.use-case.ts
│   │   │
│   │   └── notifications/
│   │       ├── send-ad-schedule.use-case.ts
│   │       ├── send-compensation-proposal.use-case.ts
│   │       └── alert-off-air.use-case.ts
│   │
│   └── services/                     # Application services
│       ├── scheduling.service.ts     # Ad and show scheduling
│       ├── compensation.service.ts   # Missed ad handling
│       ├── revenue-calculation.service.ts
│       └── report-generation.service.ts
│
├── infrastructure/                   # EXTERNAL CONCERNS LAYER
│   ├── database/
│   │   ├── models/                   # MongoDB schemas
│   │   │   ├── tenant.model.ts       # With tenant isolation
│   │   │   ├── show.model.ts         # Includes tenantId
│   │   │   └── advert.model.ts
│   │   │
│   │   └── repositories/             # MongoDB implementations
│   │       ├── show.repository.ts    # Implements interface
│   │       ├── advert.repository.ts
│   │       └── user.repository.ts
│   │
│   ├── external/
│   │   ├── email/                    # Email service implementation
│   │   │   ├── email.service.ts      # SendGrid/Nodemailer
│   │   │   └── templates/            # Email templates
│   │   │
│   │   ├── calendar/                 # Dual calendar service
│   │   │   └── calendar.service.ts
│   │   │
│   │   └── file-upload/              # Satellite log uploads
│   │       └── file-upload.service.ts
│   │
│   ├── middlewares/                  # Express middlewares
│   │   ├── tenant.middleware.ts      # Extract tenant from JWT
│   │   ├── auth.middleware.ts        # JWT verification
│   │   ├── permission.middleware.ts  # PBAC enforcement
│   │   └── audit.middleware.ts       # Activity logging
│   │
│   └── config/                       # Configuration
│       ├── database.config.ts
│       ├── jwt.config.ts
│       └── email.config.ts
│
├── presentation/                     # API LAYER
│   ├── controllers/                  # Route controllers
│   │   ├── shows.controller.ts
│   │   ├── adverts.controller.ts
│   │   ├── sales.controller.ts
│   │   ├── finance.controller.ts
│   │   └── reports.controller.ts
│   │
│   ├── dtos/                         # Data Transfer Objects
│   │   ├── requests/                 # Input validation
│   │   │   ├── create-show.dto.ts
│   │   │   ├── schedule-advert.dto.ts
│   │   │   └── upload-satellite-log.dto.ts
│   │   │
│   │   └── responses/                # API responses
│   │       ├── show-response.dto.ts
│   │       ├── advert-response.dto.ts
│   │       └── report-response.dto.ts
│   │
│   ├── routes/                       # Express route definitions
│   │   ├── shows.routes.ts
│   │   ├── adverts.routes.ts
│   │   ├── sales.routes.ts
│   │   └── finance.routes.ts
│   │
│   └── validators/                   # Request validation
│       └── show.validator.ts
│
└── shared/                           # SHARED UTILITIES
    ├── utils/
    │   ├── logger.ts                 # Structured logging
    │   ├── error-handler.ts          # Global error handling
    │   └── date-converter.ts         # Calendar conversions
    │
    ├── constants/                    # System constants
    │   ├── permissions.constants.ts  # PBAC permission definitions
    │   └── error-codes.constants.ts
    │
    └── types/                        # Shared TypeScript types
        └── tenant-context.type.ts    # Tenant-aware request context


**4 Multi-Tenancy Implementation Strategy**

- Database per tenant (recommended for maximum isolation)
- Tenant identification via subdomain or JWT claim
- Tenant context middleware that injects tenantId into all operations
- Tenant-aware query filtering at repository level
- Tenant-specific configurations stored in tenant profile

**5 CRITICAL BUSINESS RULES TO IMPLEMENT**

- 24-hour alert rule: System must check daily at 6:00 AM for shows/ads ending within 24 hours
- Compensation workflow: Must allow customer feedback and alternative proposals
- Revenue sharing: Automatic calculation based on contract terms
- Satellite log verification: Manual upload process (no direct integration)
- Calendar support: All date operations must support Ethiopian and Gregorian calendars
- Permission hierarchy: CEO has superuser access to define all permissions