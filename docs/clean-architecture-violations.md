# Clean Architecture — Deviations and Technical Debt

This document lists ways the codebase diverges from strict Clean Architecture / dependency rules, with **impact** ratings to prioritize refactors. It is descriptive, not prescriptive for this sprint: many patterns were accepted for delivery speed.

**Update (March 2026):** Much of the **High** / **Medium (composition root)** debt is addressed via `src/composition/app-container.ts`, `ApiRouterDeps`, and factory-based controllers/routers. JWT auth is built with `createAuthMiddleware` at bootstrap and passed on deps (routes no longer import a static `authMiddleware` singleton). Advert-package multipart middleware is factory-wired the same way. An **Advert** domain boundary and `/api/adverts` HTTP module exist; **Payment** / **Compensation** domain slices are still outstanding. Legacy **mongoose** was removed.

**Impact scale**

- **Critical** — Security, correctness, or data integrity at risk if left unchecked.
- **High** — Undermines testability, replaceability of infrastructure, or consistent architecture as the system grows.
- **Medium** — Localized coupling or missing domain boundaries that will slow the next features (advert placement, finance, compensation).
- **Low** — Naming, duplication, or style that is annoying but not blocking.


## High

### Presentation constructs infrastructure repositories directly

**Where:** Most `src/presentation/controllers/*.ts` files instantiate concrete Prisma repositories at module scope, e.g. `new UserRepository()`, `new MediaPackRepository()`, `new BroadcastSlotRepository()`, rather than receiving implementations from a composition root.

**Why it matters:** The dependency rule (inner layers must not depend on outer layers) is inverted in spirit: the presentation layer is tightly bound to concrete infrastructure types. Unit tests must patch modules or spin up real DB-backed repos; swapping persistence or adding decorators is mechanical across many files.

**Remediation direction:** Introduce a small composition module (e.g. `src/composition` or wire inside `createApp` / `createApiRouter`) that builds repository singletons (or scoped instances) and passes them into controllers or use-case factories. Controllers should depend on repository **interfaces** from `domain/repositories` only.


## Medium

### Minimal composition root; almost no constructor injection

**Where:** [src/index.ts](src/index.ts) passes `{ storageService }` into [src/presentation/app.ts](src/presentation/app.ts) → `createApiRouter(deps)` for advert-package image handling only. Everything else is `new` inside controllers.

**Why it matters:** Cross-cutting concerns (logging, metrics, transaction boundaries, mockability) are harder to apply uniformly.

**Remediation direction:** Expand `createApiRouter` / app bootstrap to supply a “container” or explicit factory map for repositories and services used by HTTP handlers.


### Presentation routes import infrastructure modules

**Where:** e.g. [src/presentation/routes/advert-package.route.ts](src/presentation/routes/advert-package.route.ts) imports `advert-package-upload.middleware` from `src/infrastructure/middlewares/`.

**Why it matters:** Route definitions are no longer a thin adapter over application entry points; they embed infrastructure details (multer, disk paths). Harder to test routes in isolation without filesystem/network.

**Remediation direction:** Define a narrow port in application or presentation for “parse multipart advert package + image” and bind multer in the composition root, or wrap middleware construction in a factory passed via `createApiRouter` deps (same pattern as `storageService`).


### Campaign domain missing while persistence exists

**Where:** Prisma models `Advert`, `Payment`, `Compensation` in [src/infrastructure/prisma/schema.prisma](src/infrastructure/prisma/schema.prisma); [src/domain/entities/satellite-log.entity.ts](src/domain/entities/satellite-log.entity.ts) exists but there is no `advert.entity.ts`, no `IAdvertRepository`, and no `adverts` use-case folder.

**Why it matters:** The next features (placement → finance → compensation) risk leaking Prisma shapes and status strings into controllers if domain types and repository contracts are not introduced first. Duplicated validation and inconsistent enums become likely.

**Remediation direction:** For **advert placement**, add domain entity (and link to `BroadcastSlot` per product decision), repository interface, mappers, then Prisma repository. Keep HTTP DTOs separate from persistence models.


### Use-cases sometimes bypass explicit interfaces in practice

**Where:** Many use-cases accept repository interfaces in constructors (good), but callers always pass the concrete Prisma class from controllers simultaneously constructed in the same file—so the indirection is nominal only.

**Why it matters:** Interface-at-constructor is healthy, but without a composition root the benefit is mostly documentation-level.

**Remediation direction:** Same as “composition root”: single place that satisfies use-case constructors.


## Low

### Duplicate repository instances per controller

**Where:** e.g. [src/presentation/controllers/show.controller.ts](src/presentation/controllers/show.controller.ts) keeps a `showRepo` plus multiple `new ShowRepository()` for individual use-cases.

**Why it matters:** Extra allocations, confusing ownership, and risk of inconsistent configuration if repositories gain options later.

**Remediation direction:** One shared instance per repository per process (or per request if you add Unit of Work later), injected or created once in the controller module.


### Inconsistent file naming

**Where:** Examples include `delete-user.uase-case.ts`, singular `employee.route.ts` / `partner.route.ts` vs plural `users.routes.ts`.

**Why it matters:** Discoverability and tooling consistency only.

**Remediation direction:** Rename in a dedicated churn-minimizing PR; update imports (ESM `.js` extensions).


### Legacy Mongo config still present

**Where:** [src/infrastructure/config/database.config.ts](src/infrastructure/config/database.config.ts), mongoose in [package.json](package.json).

**Why it matters:** Dependency bloat and cognitive noise; not a layering violation per se.

**Remediation direction:** Remove when team confirms no rollback need ([TODO.md](../TODO.md)).


## Critical

*None identified in this audit* (no finding where security or integrity is definitively broken solely by layering). Revisit after advert/finance flows add payment and customer-facing links.


## References

- Requirements context: [requirements.mdc](requirements.mdc)
- Current module index: [PROJECT_INDEX_AUTO.md](../PROJECT_INDEX_AUTO.md)
- Task tracker: [TODO.md](../TODO.md)
