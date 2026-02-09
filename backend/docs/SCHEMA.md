# BodyQ — Core Database Schema

PostgreSQL recommended. All timestamps in UTC. Use soft deletes (`deleted_at`) where audit/history matters.

---

## 1. Entity Relationship Overview

```
users ──┬──► health_metrics (1:N)
        ├──► workouts (1:N)
        ├──► posture_analyses (1:N)
        ├──► nutrition_logs (1:N)
        ├──► recommendations (1:N)
        ├──► notification_preferences (1:1)
        └──► notifications (1:N)
```

---

## 2. Tables

### 2.1 `users`

Stores authentication identity and profile. Passwords stored hashed (e.g. bcrypt); never plain text.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login identifier |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hash |
| `display_name` | VARCHAR(100) | | Optional |
| `avatar_url` | VARCHAR(512) | | Optional profile image |
| `date_of_birth` | DATE | | For age-based recommendations |
| `gender` | VARCHAR(20) | | e.g. male, female, other, prefer_not_to_say |
| `height_cm` | DECIMAL(5,2) | | |
| `weight_kg` | DECIMAL(5,2) | | Current weight (can also use health_metrics) |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default now() | |
| `deleted_at` | TIMESTAMPTZ | | Soft delete |

**Indexes:** `email` (unique), `created_at`.

---

### 2.2 `health_metrics`

Time-series health data (weight, steps, heart rate, sleep, etc.). One row per metric type per day (or per timestamp if you need finer granularity).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | |
| `user_id` | UUID | FK(users), NOT NULL | |
| `metric_type` | VARCHAR(50) | NOT NULL | e.g. weight_kg, steps, heart_rate_rest, sleep_hours |
| `value` | DECIMAL(10,2) | NOT NULL | Numeric value |
| `unit` | VARCHAR(20) | | e.g. kg, count, bpm, hours |
| `recorded_at` | TIMESTAMPTZ | NOT NULL | When the value was recorded |
| `source` | VARCHAR(50) | | e.g. manual, wearables, ai_derived |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `(user_id, metric_type, recorded_at)`, `user_id`, `recorded_at`.

---

### 2.3 `workouts`

Logged workout sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | |
| `user_id` | UUID | FK(users), NOT NULL | |
| `name` | VARCHAR(200) | | e.g. "Morning run" |
| `workout_type` | VARCHAR(50) | | e.g. running, strength, yoga |
| `started_at` | TIMESTAMPTZ | NOT NULL | |
| `ended_at` | TIMESTAMPTZ | | Null if in progress |
| `duration_seconds` | INTEGER | | Computed or set |
| `calories_estimated` | INTEGER | | Optional |
| `notes` | TEXT | | |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `user_id`, `(user_id, started_at)`.

---

### 2.4 `workout_exercises` (optional, for structured workout detail)

If you want to store individual exercises within a workout (sets, reps, weight).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `workout_id` | UUID | FK(workouts), NOT NULL | |
| `exercise_name` | VARCHAR(150) | NOT NULL | |
| `sets` | INTEGER | | |
| `reps` | INTEGER | | |
| `weight_kg` | DECIMAL(6,2) | | |
| `duration_seconds` | INTEGER | | For time-based exercises |
| `order_index` | SMALLINT | | Order in workout |

**Indexes:** `workout_id`.

---

### 2.5 `posture_analyses`

Results from the posture AI microservice. Backend stores only after validating the AI response.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | |
| `user_id` | UUID | FK(users), NOT NULL | |
| `image_url` | VARCHAR(512) | | Client upload URL or storage key (backend-controlled) |
| `raw_request_id` | VARCHAR(100) | | For idempotency / debugging |
| `status` | VARCHAR(20) | NOT NULL | pending, completed, failed |
| `score` | DECIMAL(5,2) | | Normalized 0–100 or similar |
| `feedback_json` | JSONB | | Validated AI output (issues, suggestions) |
| `analyzed_at` | TIMESTAMPTZ | NOT NULL | When analysis was run |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `user_id`, `(user_id, analyzed_at)`.

---

### 2.6 `nutrition_logs`

Food recognition and manual logs. One entry per meal/snack or per item.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | |
| `user_id` | UUID | FK(users), NOT NULL | |
| `logged_at` | TIMESTAMPTZ | NOT NULL | When the food was consumed |
| `meal_type` | VARCHAR(30) | | breakfast, lunch, dinner, snack |
| `source` | VARCHAR(30) | NOT NULL | manual, ai_recognized |
| `image_url` | VARCHAR(512) | | If from food recognition |
| `food_name` | VARCHAR(200) | | Recognized or user-entered |
| `calories` | INTEGER | | |
| `protein_g` | DECIMAL(6,2) | | |
| `carbs_g` | DECIMAL(6,2) | | |
| `fat_g` | DECIMAL(6,2) | | |
| `raw_ai_response` | JSONB | | Sanitized AI response (optional, for audit) |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `user_id`, `(user_id, logged_at)`.

---

### 2.7 `recommendations`

Personalized health recommendations (from AI or rules). Can be generated on-demand or stored for “daily tip” / history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | |
| `user_id` | UUID | FK(users), NOT NULL | |
| `type` | VARCHAR(50) | NOT NULL | e.g. workout, nutrition, posture, rest |
| `title` | VARCHAR(200) | NOT NULL | |
| `body` | TEXT | | Detailed text |
| `priority` | VARCHAR(20) | | low, medium, high |
| `source` | VARCHAR(50) | | rule_based, ai_generated |
| `read_at` | TIMESTAMPTZ | | When user acknowledged |
| `expires_at` | TIMESTAMPTZ | | Optional |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `user_id`, `(user_id, created_at)`, `(user_id, read_at)`.

---

### 2.8 `notification_preferences`

Per-user settings for notifications (one row per user or key-value per channel).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK(users), UNIQUE, NOT NULL | |
| `push_enabled` | BOOLEAN | NOT NULL, default true | |
| `workout_reminders` | BOOLEAN | NOT NULL, default true | |
| `posture_reminders` | BOOLEAN | NOT NULL, default true | |
| `nutrition_reminders` | BOOLEAN | NOT NULL, default true | |
| `recommendation_digest` | BOOLEAN | NOT NULL, default true | |
| `quiet_hours_start` | TIME | | e.g. 22:00 |
| `quiet_hours_end` | TIME | | e.g. 07:00 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `user_id` (unique).

---

### 2.9 `notifications`

Outgoing notifications (in-app or push). Scheduler/worker marks as sent.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, default gen_random_uuid() | |
| `user_id` | UUID | FK(users), NOT NULL | |
| `channel` | VARCHAR(30) | NOT NULL | push, in_app, email |
| `type` | VARCHAR(50) | NOT NULL | workout_reminder, posture_tip, etc. |
| `title` | VARCHAR(200) | NOT NULL | |
| `body` | TEXT | | |
| `payload_json` | JSONB | | Deep link or extra data |
| `scheduled_for` | TIMESTAMPTZ | NOT NULL | |
| `sent_at` | TIMESTAMPTZ | | Null until sent |
| `read_at` | TIMESTAMPTZ | | For in_app |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `user_id`, `(scheduled_for, sent_at)` for scheduler, `(user_id, read_at)` for inbox.

---

### 2.10 `refresh_tokens` (optional, for JWT refresh)

If you use refresh tokens, store hashes only.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK(users), NOT NULL | |
| `token_hash` | VARCHAR(255) | NOT NULL | Hash of refresh token |
| `expires_at` | TIMESTAMPTZ | NOT NULL | |
| `revoked_at` | TIMESTAMPTZ | | |
| `created_at` | TIMESTAMPTZ | NOT NULL, default now() | |

**Indexes:** `user_id`, `token_hash`, `expires_at`.

---

## 3. Migration Strategy

- Use migrations (TypeORM, Prisma, or raw SQL in versioned files). Never change schema ad hoc in production.
- Initial migration: create tables above in dependency order (users first, then tables with `user_id` FK).
- Add indexes in same or follow-up migration.

---

## 4. Naming Conventions

- **Tables:** `snake_case`, plural for entity tables (`users`, `workouts`).
- **Columns:** `snake_case`.
- **PKs:** `id` (UUID).
- **FKs:** `<table_singular>_id` (e.g. `user_id`).
- **Timestamps:** `created_at`, `updated_at`, `deleted_at` (UTC).

This schema supports the REST API defined in `API.md` and keeps the backend stateless while persisting all required state in PostgreSQL.
