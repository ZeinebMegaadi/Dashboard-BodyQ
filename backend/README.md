# BodyQ Backend

Central API for the AI-powered Fitness & Health Assistant. Serves the React Native app and orchestrates AI microservices. **Stateless**, REST/JSON, JWT auth.

## Design (Modern & Bold)

- **Clear boundaries:** Controllers → Services → Repositories; AI calls via dedicated clients.
- **Strong validation:** All inputs and AI outputs validated before use or persistence.
- **Confident structure:** Explicit modules (auth, users, health, workouts, posture, nutrition, recommendations, notifications).

## Docs

| Document | Description |
|----------|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture overview, principles, folder structure (NestJS vs Express). |
| [docs/SCHEMA.md](docs/SCHEMA.md) | Core PostgreSQL schema (users, health_metrics, workouts, posture_analyses, nutrition_logs, recommendations, notifications). |
| [docs/API.md](docs/API.md) | REST API specification (base `/api/v1`). |

## Tech stack (choose one)

Before implementation, choose:

1. **NestJS** (recommended) — TypeScript, built-in modules/DI, validation, and structure. Best fit for “professional architecture” with minimal boilerplate.
2. **Express + TypeScript** — Manual layers (routes, controllers, services, repositories). More control, slightly more setup.
3. **Spring Boot** — Java/Kotlin, strong typing and ecosystem. Good if the team prefers JVM.
4. **FastAPI** — Python, async, automatic OpenAPI. Good if AI services are Python and you want one language.

Reply with your choice and we can scaffold the project and implement incrementally (e.g. config → auth → users → health/workouts → posture/nutrition → recommendations → notifications).

## Environment (example)

See [.env.example](.env.example). Required: `PORT`, `DATABASE_URL`, `JWT_SECRET`, and (later) AI service base URLs and API keys.

## Running (after implementation)

- Install: `npm install` (or `pip install -r requirements.txt` for FastAPI).
- DB: Run migrations, then start app (e.g. `npm run start:dev` for NestJS).
- API base: `http://localhost:3000/api/v1` (or port from env).
