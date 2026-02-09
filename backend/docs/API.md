# BodyQ — REST API Specification

Base path: `/api/v1`. All request/response bodies are JSON. All timestamps in ISO 8601 UTC (e.g. `2025-02-08T12:00:00Z`).

**Auth:** Protected routes require header: `Authorization: Bearer <access_token>`.

**Errors:** Use HTTP status codes and a consistent error body, e.g.:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [ { "field": "email", "message": "Invalid email format" } ]
}
```

---

## 1. Authentication

### 1.1 Register

`POST /auth/register`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "Alex"
}
```

**Response:** `201 Created`

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Alex",
    "avatarUrl": null,
    "createdAt": "2025-02-08T12:00:00Z"
  },
  "accessToken": "eyJ...",
  "expiresIn": 3600
}
```

**Errors:** `400` validation, `409` email already exists.

---

### 1.2 Login

`POST /auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK` — same shape as register (user + accessToken + expiresIn).

**Errors:** `401` invalid credentials.

---

### 1.3 Refresh token (optional)

`POST /auth/refresh`

**Request:**

```json
{
  "refreshToken": "string"
}
```

**Response:** `200 OK` — `{ "accessToken", "expiresIn" }`.

**Errors:** `401` invalid or expired refresh token.

---

### 1.4 Get current user (authenticated)

`GET /auth/me`

**Response:** `200 OK` — same `user` object as in register/login (no token in response).

**Errors:** `401` missing or invalid JWT.

---

## 2. Users & Profile

### 2.1 Get profile

`GET /users/me`

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "Alex",
  "avatarUrl": null,
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "heightCm": 175,
  "weightKg": 70,
  "createdAt": "2025-02-08T12:00:00Z",
  "updatedAt": "2025-02-08T12:00:00Z"
}
```

---

### 2.2 Update profile

`PATCH /users/me`

**Request:** Any subset of profile fields (all optional).

```json
{
  "displayName": "Alex",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "heightCm": 175,
  "weightKg": 70,
  "avatarUrl": "https://..."
}
```

**Response:** `200 OK` — full updated user object.

**Errors:** `400` validation.

---

## 3. Health Metrics

### 3.1 Record metric

`POST /health/metrics`

**Request:**

```json
{
  "metricType": "weight_kg",
  "value": 70.5,
  "unit": "kg",
  "recordedAt": "2025-02-08T08:00:00Z",
  "source": "manual"
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "userId": "uuid",
  "metricType": "weight_kg",
  "value": 70.5,
  "unit": "kg",
  "recordedAt": "2025-02-08T08:00:00Z",
  "source": "manual",
  "createdAt": "2025-02-08T12:00:00Z"
}
```

**Errors:** `400` validation (e.g. invalid metricType).

---

### 3.2 Get metrics

`GET /health/metrics?metricType=weight_kg&from=2025-02-01&to=2025-02-08&limit=100`

**Query:** `metricType` (optional), `from`, `to` (ISO date or datetime), `limit` (default 100, max 500).

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "metricType": "weight_kg",
      "value": 70.5,
      "unit": "kg",
      "recordedAt": "2025-02-08T08:00:00Z",
      "source": "manual"
    }
  ],
  "meta": { "total": 1, "from": "2025-02-01", "to": "2025-02-08" }
}
```

---

## 4. Workouts

### 4.1 Create workout

`POST /workouts`

**Request:**

```json
{
  "name": "Morning run",
  "workoutType": "running",
  "startedAt": "2025-02-08T07:00:00Z",
  "endedAt": "2025-02-08T07:45:00Z",
  "durationSeconds": 2700,
  "caloriesEstimated": 320,
  "notes": "Felt good"
}
```

**Response:** `201 Created` — full workout object (with `id`, `userId`, `createdAt`, `updatedAt`).

**Errors:** `400` validation.

---

### 4.2 List workouts

`GET /workouts?from=2025-02-01&to=2025-02-08&limit=50`

**Query:** `from`, `to`, `limit` (default 50).

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Morning run",
      "workoutType": "running",
      "startedAt": "2025-02-08T07:00:00Z",
      "endedAt": "2025-02-08T07:45:00Z",
      "durationSeconds": 2700,
      "caloriesEstimated": 320,
      "notes": "Felt good",
      "createdAt": "2025-02-08T07:45:00Z"
    }
  ],
  "meta": { "total": 1 }
}
```

---

### 4.3 Get workout

`GET /workouts/:id`

**Response:** `200 OK` — single workout. `404` if not found or not owned by user.

---

### 4.4 Update workout

`PATCH /workouts/:id`

**Request:** Same fields as create (all optional). Only provided fields updated.

**Response:** `200 OK` — updated workout. `404` if not found or not owned.

---

### 4.5 Delete workout

`DELETE /workouts/:id`

**Response:** `204 No Content`. `404` if not found or not owned.

---

## 5. Posture Analysis (AI)

### 5.1 Submit image for analysis

`POST /posture/analyze`

**Request:** `multipart/form-data` or JSON with image URL (depending on whether client uploads file to your storage first or sends base64).

Option A — URL after client uploads to your storage:

```json
{
  "imageUrl": "https://your-storage/..."
}
```

Option B — base64 (if acceptable for size):

```json
{
  "imageBase64": "data:image/jpeg;base64,..."
}
```

Backend forwards to posture AI microservice, validates response, stores result, returns to client.

**Response:** `202 Accepted` (async) or `200 OK` (sync)

```json
{
  "id": "uuid",
  "status": "completed",
  "score": 78.5,
  "feedback": {
    "issues": ["Rounded shoulders detected"],
    "suggestions": ["Try stretching chest muscles"]
  },
  "analyzedAt": "2025-02-08T12:00:00Z"
}
```

If async: `status: "pending"`, client can poll `GET /posture/analyses/:id`.

**Errors:** `400` invalid image, `502` AI service error (after retries).

---

### 5.2 Get analysis result

`GET /posture/analyses/:id`

**Response:** `200 OK` — same shape as above. `404` if not found or not owned.

---

### 5.3 List analyses

`GET /posture/analyses?from=2025-02-01&to=2025-02-08&limit=20`

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "status": "completed",
      "score": 78.5,
      "feedback": { "issues": [], "suggestions": [] },
      "analyzedAt": "2025-02-08T12:00:00Z"
    }
  ],
  "meta": { "total": 1 }
}
```

---

## 6. Nutrition (Food Recognition & Logging)

### 6.1 Log food (manual)

`POST /nutrition/logs`

**Request:**

```json
{
  "loggedAt": "2025-02-08T12:30:00Z",
  "mealType": "lunch",
  "foodName": "Grilled chicken salad",
  "calories": 350,
  "proteinG": 30,
  "carbsG": 15,
  "fatG": 20
}
```

**Response:** `201 Created` — full log entry with `id`, `userId`, `source: "manual"`, `createdAt`.

**Errors:** `400` validation.

---

### 6.2 Recognize food (AI) and log

`POST /nutrition/recognize`

**Request:** Same as posture — `imageUrl` or `imageBase64`. Backend calls food AI, validates response, optionally auto-creates a nutrition log and returns it.

**Response:** `200 OK` or `201 Created`

```json
{
  "log": {
    "id": "uuid",
    "loggedAt": "2025-02-08T12:30:00Z",
    "mealType": "lunch",
    "source": "ai_recognized",
    "foodName": "Grilled chicken salad",
    "calories": 350,
    "proteinG": 30,
    "carbsG": 15,
    "fatG": 20,
    "createdAt": "2025-02-08T12:31:00Z"
  },
  "recognition": {
    "confidence": 0.92,
    "alternatives": ["Caesar salad", "Green salad"]
  }
}
```

**Errors:** `400` invalid image, `502` AI service error.

---

### 6.3 List nutrition logs

`GET /nutrition/logs?from=2025-02-01&to=2025-02-08&mealType=lunch&limit=50`

**Query:** `from`, `to`, `mealType` (optional), `limit`.

**Response:** `200 OK`

```json
{
  "data": [ /* array of log objects */ ],
  "meta": { "total": 10 }
}
```

---

### 6.4 Delete nutrition log

`DELETE /nutrition/logs/:id`

**Response:** `204 No Content`. `404` if not found or not owned.

---

## 7. Recommendations

### 7.1 Get recommendations

`GET /recommendations?limit=10&unreadOnly=true`

**Query:** `limit` (default 10), `unreadOnly` (default false).

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "workout",
      "title": "Try a 20-min stretch",
      "body": "Based on your recent activity...",
      "priority": "medium",
      "source": "ai_generated",
      "readAt": null,
      "expiresAt": "2025-02-15T00:00:00Z",
      "createdAt": "2025-02-08T12:00:00Z"
    }
  ],
  "meta": { "total": 1 }
}
```

---

### 7.2 Mark as read

`PATCH /recommendations/:id/read`

**Request:** empty body or `{ "readAt": "2025-02-08T12:00:00Z" }` (optional, server can set).

**Response:** `200 OK` — updated recommendation with `readAt` set.

**Errors:** `404` not found or not owned.

---

### 7.3 Request new recommendations (optional)

`POST /recommendations/generate`

**Request:** optional context, e.g. `{ "context": "post_workout" }`.

**Response:** `202 Accepted` — job id or list of new recommendations when sync.

Backend may call recommendation AI/service and store new rows, then return them or redirect to `GET /recommendations`.

---

## 8. Notifications

### 8.1 Get preferences

`GET /notifications/preferences`

**Response:** `200 OK`

```json
{
  "pushEnabled": true,
  "workoutReminders": true,
  "postureReminders": true,
  "nutritionReminders": true,
  "recommendationDigest": true,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "07:00",
  "updatedAt": "2025-02-08T12:00:00Z"
}
```

---

### 8.2 Update preferences

`PATCH /notifications/preferences`

**Request:** Any subset of preference fields.

**Response:** `200 OK` — full preferences object.

---

### 8.3 List notifications (in-app inbox)

`GET /notifications?limit=20&unreadOnly=false`

**Query:** `limit`, `unreadOnly`.

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "channel": "in_app",
      "type": "workout_reminder",
      "title": "Time for your workout",
      "body": "You usually train at this time.",
      "payload": { "screen": "Workout" },
      "scheduledFor": "2025-02-08T18:00:00Z",
      "sentAt": "2025-02-08T18:00:00Z",
      "readAt": null,
      "createdAt": "2025-02-08T12:00:00Z"
    }
  ],
  "meta": { "total": 1 }
}
```

---

### 8.4 Mark notification as read

`PATCH /notifications/:id/read`

**Response:** `200 OK` — notification with `readAt` set. `404` if not found or not owned.

---

### 8.5 Register device for push (optional)

`POST /notifications/devices`

**Request:**

```json
{
  "deviceToken": "fcm_or_apns_token",
  "platform": "ios"
}
```

**Response:** `201 Created` or `200 OK`. Backend stores token for user for later push sending (e.g. via FCM/APNs).

---

## 9. Summary Table

| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, optional refresh |
| Users | `GET /users/me`, `PATCH /users/me` |
| Health | `POST /health/metrics`, `GET /health/metrics` |
| Workouts | `POST /workouts`, `GET /workouts`, `GET /workouts/:id`, `PATCH /workouts/:id`, `DELETE /workouts/:id` |
| Posture | `POST /posture/analyze`, `GET /posture/analyses/:id`, `GET /posture/analyses` |
| Nutrition | `POST /nutrition/logs`, `POST /nutrition/recognize`, `GET /nutrition/logs`, `DELETE /nutrition/logs/:id` |
| Recommendations | `GET /recommendations`, `PATCH /recommendations/:id/read`, optional `POST /recommendations/generate` |
| Notifications | `GET /notifications/preferences`, `PATCH /notifications/preferences`, `GET /notifications`, `PATCH /notifications/:id/read`, optional `POST /notifications/devices` |

All of the above align with the stateless, validation-heavy, and single-gateway design described in `ARCHITECTURE.md`.
