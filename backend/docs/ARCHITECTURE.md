# BodyQ Backend — Architecture & Design

**Modern & bold.** Clean boundaries, strong separation of concerns, high contrast between layers.  
This document defines the backend architecture, database schema, and REST API for the AI-powered Fitness & Health Assistant.

---

## 1. Architecture Overview

### 1.1 Principles

| Principle | Meaning |
|-----------|--------|
| **Stateless** | No server-side session storage; JWT carries identity. Horizontal scaling without sticky sessions. |
| **API as single gateway** | Mobile app talks only to this backend. AI services and DB are never exposed to clients. |
| **Validate at the edge** | All incoming and outgoing data (including AI responses) is validated and normalized. |
| **Layered** | Controllers → Services → Repositories. No business logic in controllers; no SQL in services. |

### 1.2 High-Level Flow

```
┌─────────────────┐      HTTPS + JWT       ┌──────────────────────┐
│  React Native   │ ◄───────────────────► │   BodyQ Backend API   │
│  Mobile App     │      REST / JSON       │   (this service)       │
└─────────────────┘                        └───────────┬──────────┘
                                                       │
                        ┌──────────────────────────────┼──────────────────────────────┐
                        │                              │                              │
                        ▼                              ▼                              ▼
              ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
              │  PostgreSQL     │            │  Posture AI     │            │  Food / Recs     │
              │  (users,        │            │  (microservice) │            │  (microservices) │
              │   health data)  │            │                 │            │                 │
              └─────────────────┘            └─────────────────┘            └─────────────────┘
```

- **Backend** owns: auth, validation, orchestration, persistence, notifications scheduling.
- **AI services** own: inference only. Backend calls them via HTTP, validates responses, then stores or returns to client.

### 1.3 Theme Alignment (Modern & Bold)

- **Modern:** Clear module boundaries, RESTful resource naming, structured errors, env-based config.
- **Bold:** Explicit DTOs, strict validation, single responsibility per layer, confident naming (e.g. `PostureAnalysisService`, not generic “AI service”).

---

## 2. Folder Structure

Two options: **NestJS** (recommended for strong structure and DI) or **Express + TypeScript** (manual layers).

### 2.1 Option A — NestJS (recommended)

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/                 # Shared pipes, filters, guards, decorators
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── decorators/
│   │       └── current-user.decorator.ts
│   ├── config/                 # ConfigModule, env validation
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts  # or TypeORM entity + repository
│   │   ├── entities/
│   │   └── dto/
│   ├── health/
│   │   ├── health.module.ts
│   │   ├── health.controller.ts
│   │   ├── health.service.ts
│   │   ├── health.repository.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── workouts/
│   │   ├── workouts.module.ts
│   │   ├── workouts.controller.ts
│   │   ├── workouts.service.ts
│   │   ├── workouts.repository.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── posture/                # Orchestrates posture AI microservice
│   │   ├── posture.module.ts
│   │   ├── posture.controller.ts
│   │   ├── posture.service.ts
│   │   ├── posture.repository.ts
│   │   ├── clients/
│   │   │   └── posture-ai.client.ts   # HTTP client to AI service
│   │   ├── entities/
│   │   └── dto/
│   ├── nutrition/              # Food recognition + recommendations
│   │   ├── nutrition.module.ts
│   │   ├── nutrition.controller.ts
│   │   ├── nutrition.service.ts
│   │   ├── nutrition.repository.ts
│   │   ├── clients/
│   │   │   └── food-ai.client.ts
│   │   ├── entities/
│   │   └── dto/
│   ├── recommendations/        # Personalized health recommendations
│   │   ├── recommendations.module.ts
│   │   ├── recommendations.controller.ts
│   │   ├── recommendations.service.ts
│   │   ├── clients/
│   │   └── dto/
│   └── notifications/
│       ├── notifications.module.ts
│       ├── notifications.controller.ts
│       ├── notifications.service.ts
│       ├── notifications.repository.ts
│       ├── entities/
│       └── dto/
├── test/
├── docs/
│   ├── ARCHITECTURE.md         # this file
│   ├── SCHEMA.md               # DB schema (see below)
│   └── API.md                  # REST API spec (see below)
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

### 2.2 Option B — Express + TypeScript (manual layers)

```
backend/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   ├── common/
│   ├── middleware/             # auth, validation, error handler
│   ├── routes/                 # route definitions only
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── health.routes.ts
│   │   ├── workouts.routes.ts
│   │   ├── posture.routes.ts
│   │   ├── nutrition.routes.ts
│   │   ├── recommendations.routes.ts
│   │   └── notifications.routes.ts
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── clients/                # HTTP clients to AI microservices
│   ├── entities/               # or models/
│   └── dto/
├── test/
├── docs/
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 3. Layer Responsibilities

| Layer | Responsibility | Does not |
|-------|----------------|----------|
| **Controller** | Parse request, call service, return response status + body | Business logic, DB, external HTTP |
| **Service** | Business logic, validation of domain rules, orchestrate repos + AI clients | Raw SQL, HTTP details |
| **Repository** | CRUD and queries against DB | Business rules, calling AI |
| **Client** | HTTP calls to AI microservices, map request/response | Business logic, persistence |

---

## 4. Security & Validation

- **Auth:** JWT in `Authorization: Bearer <token>`. Refresh token optional (store hashes if used).
- **Validation:** All request bodies validated with DTOs (e.g. class-validator + class-transformer in NestJS, or Joi/Zod in Express). Validate and sanitize all AI service responses before persisting or returning.
- **Idempotency:** For critical write operations, consider idempotency keys in headers (future enhancement).
- **Rate limiting:** Apply per-IP or per-user on public and AI-heavy endpoints.

---

## 5. Next Steps

1. **Choose stack:** NestJS vs Express + TypeScript (see above).
2. **Implement in order:** Config + DB connection → Auth → Users → Health/Workouts → Posture/Nutrition/Recommendations → Notifications.
3. **Database:** Use the schema in `docs/SCHEMA.md` and add migrations (e.g. TypeORM, Prisma, or raw SQL).

All REST endpoints and request/response shapes are defined in `docs/API.md`.
