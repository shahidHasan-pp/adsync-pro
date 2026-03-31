# AdSync Pro User Guide

## What AdSync Pro Gives You

AdSync Pro helps advertisers track sponsored creator videos in one place.

As a user, you can:

- Sign in quickly with email (current build: no OTP/email verification).
- Add a creator video by platform + video ID.
- Generate a creator approval link.
- Trigger creator approval flow (mocked in current build).
- View synced performance metrics on your dashboard:
  - Total views
  - Unique viewers
  - Engagement rate
  - Average watch time
  - Demographics
  - Retention curve

## Core User Flow

1. Login with your email.
2. Add a video (`platform` + `platform_video_id`).
3. Copy/share the creator sync link (or simulate approval in current UI).
4. Wait for initial metrics sync.
5. Open dashboard and review latest analytics for each video.

## Access URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8001`
- API Docs (Swagger): `http://127.0.0.1:8001/docs`

If your backend runs on a different port (like 8000), adjust frontend `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8001/api/v1
```

## API Overview (User-Focused)

Base path: `/api/v1`

### 1) Login

Creates user automatically if email is new, then returns JWT.

`POST /api/v1/auth/login`

Request:

```json
{
  "email": "you@gmail.com",
  "company_name": "Acme Ads"
}
```

Response:

```json
{
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

Use token in all protected endpoints:

`Authorization: Bearer <access_token>`

### 2) Add Video

Creates a pending video and returns creator approval link.

`POST /api/v1/videos`

Request:

```json
{
  "platform": "youtube",
  "platform_video_id": "dQw4w9WgXcQ"
}
```

Response:

```json
{
  "video": {
    "id": "uuid",
    "advertiser_id": "uuid",
    "creator_id": null,
    "platform": "youtube",
    "platform_video_id": "dQw4w9WgXcQ",
    "status": "pending",
    "title": null,
    "created_at": "2026-03-31T12:00:00Z"
  },
  "creator_oauth_url": "http://127.0.0.1:8001/api/v1/oauth/youtube/authorize?video_id=uuid"
}
```

### 3) List My Videos

`GET /api/v1/videos`

Returns all videos for the logged-in advertiser.

### 4) Video Detail

`GET /api/v1/videos/{video_id}`

Returns one video record and its status (`pending`, `approved`, `failed`).

### 5) Get Latest Metrics

`GET /api/v1/videos/{video_id}/metrics`

Purpose:

- Fetches latest synced analytics for that video.
- Used by dashboard charts and KPI cards.

Sample response:

```json
{
  "id": "uuid",
  "video_id": "uuid",
  "total_views": 10542,
  "unique_viewers": 8240,
  "engagement_rate": 6.4,
  "avg_watch_time_seconds": 31,
  "demographics": {
    "18-24": 44,
    "25-34": 33,
    "35-44": 15,
    "45+": 8
  },
  "retention_curve": [
    { "time": 0, "value": 100 },
    { "time": 10, "value": 82 },
    { "time": 20, "value": 69 }
  ],
  "fetched_at": "2026-03-31T12:05:00Z"
}
```

### 6) Creator Approval Flow

`GET /api/v1/oauth/{platform}/authorize?video_id={video_id}`

- Returns the approval URL for creator flow.
- In current build, this is local/mock and does not require Google OAuth.

`GET /api/v1/oauth/{platform}/callback?code=mock_code&state={video_id}`

- Marks video as approved.
- Stores creator token record.
- Triggers background task to fetch initial metrics.

## Video Status Meaning

- `pending`: video created, waiting for creator approval.
- `approved`: creator approved, sync active.
- `failed`: sync could not be completed.

## Dashboard Data Meaning

- **Total Views**: total counted video views.
- **Unique Viewers**: estimated distinct viewers.
- **Engagement Rate**: percentage score from platform metrics.
- **Avg Watch Time**: average seconds watched.
- **Demographics**: age-group distribution.
- **Retention Curve**: viewer drop-off over timeline.

## Common User Issues

- `401 Unauthorized`:
  - Login again and ensure token is attached.
- CORS/network errors:
  - Backend must be running and `FRONTEND_URL` must match frontend origin.
- No metrics found:
  - Run creator approval first, then retry after a short delay.

## Quick Test with cURL

Login:

```bash
curl -X POST http://127.0.0.1:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"you@gmail.com\",\"company_name\":\"Acme Ads\"}"
```

Create video:

```bash
curl -X POST http://127.0.0.1:8001/api/v1/videos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"platform\":\"youtube\",\"platform_video_id\":\"dQw4w9WgXcQ\"}"
```

Get metrics:

```bash
curl http://127.0.0.1:8001/api/v1/videos/<VIDEO_ID>/metrics \
  -H "Authorization: Bearer <TOKEN>"
```
