# Database Architecture (MVP)

## Core Entities Included in MVP

1. `roles`
2. `users`
3. `food_trucks`
4. `truck_locations`
5. `municipal_licenses`
6. `categories`
7. `menu_items`
8. `orders`
9. `order_items`
10. `payments`
11. `notifications`
12. `favorites`
13. `reviews`
14. `truck_status_history`

## Why These Tables

- `users` + `roles`: required for RBAC (`admin`, `truck_owner`, `customer`).
- `food_trucks`: business entity owned by a truck owner.
- `truck_locations`: live/updatable location with history-friendly design.
- `municipal_licenses`: compliance approval gate before publishing trucks.
- `categories` + `menu_items`: product catalog and filtering.
- `orders` + `order_items`: transactional order state and line-level pricing snapshot.
- `payments`: decouple payment lifecycle from order lifecycle.
- `notifications`: user-facing events for order and platform state changes.
- `favorites`: customer retention and quick access to preferred trucks.
- `reviews`: trust and quality loop.
- `truck_status_history`: operational audit (open/closed/busy/offline).

## Key Relationships

- One `role` to many `users`.
- One truck owner (`users`) to many `food_trucks`.
- One truck to many `truck_locations`, `menu_items`, `orders`, `reviews`, `truck_status_history`.
- One order to many `order_items`, one-to-one with `payments` (MVP).
- One customer to many `orders`, `favorites`, `reviews`, `notifications`.

## MVP vs Later

MVP now:
- Auth + RBAC
- Truck onboarding and admin approval
- Discovery and menu browsing
- Order creation, payment record, status updates, notifications

Defer to later:
- Promotions/coupons
- Rich pickup queue optimization and SLA analytics
- Advanced analytics warehouse
- Multi-payment providers and payout reconciliation
