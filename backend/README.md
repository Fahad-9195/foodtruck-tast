# Backend Architecture (MVP)

## Why Knex + SQL Migrations

- MySQL is mandatory and SQL-level control is important for geolocation and indexing.
- Knex gives clean migration lifecycle without forcing heavy ORM abstractions.
- Query layer can start with Knex now and evolve later if domain complexity grows.

## Domain Modules

- `auth`: registration/login/token issuance.
- `users`: profile and role-aware account operations.
- `trucks`: truck onboarding, approval status, truck details.
- `menus`: categories and menu items.
- `orders`: order lifecycle and status transitions.
- `payments`: payment intent and settlement record.
- `notifications`: in-app notification events.
- `admin`: approvals, moderation, user/truck governance.

## Shared Cross-Cutting Patterns

- Central error model: `AppError`.
- Unified API response: `ok/fail` builders.
- Centralized validation via `zod` per module validator layer.
- Environment schema validation on startup.
- Common security middleware (`helmet`, `cors`, `rate-limit`).
- Structured logging with `pino`.

## Database Lifecycle

- Start local MySQL quickly:
  - `docker compose up -d` (from `backend`)
- Run migrations: `npm run db:migrate`
- Seed required roles: `npm run db:seed`
- Seed includes:
  - Roles: `admin`, `truck_owner`, `customer`
  - Demo users for flow testing:
    - `admin@foodtruck.local`
    - `owner@foodtruck.local`
    - `customer@foodtruck.local`
    - Password for all: `Password123!`
  - Development discovery data:
    - one approved truck
    - location in Riyadh
    - categories + menu items

## Environment Notes

- Dev defaults exist in `env.ts` for faster bootstrap.
- Production must set explicit env values (especially `JWT_ACCESS_SECRET` and DB credentials).

## Trucks Module API (Flow 1)

- `POST /api/v1/trucks` (truck_owner): submit truck + location + municipal license.
- `GET /api/v1/trucks/admin/pending` (admin): list pending trucks.
- `PATCH /api/v1/trucks/:truckId/admin/review` (admin): approve/reject.
- `GET /api/v1/trucks/discovery` (customer/owner/admin): list approved trucks on map.
- `GET /api/v1/trucks/:truckId/details` (customer/owner/admin): get truck details + menu.
