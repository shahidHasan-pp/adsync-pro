# AdSync Pro

A Creator Video Advertising Synchronization Platform.

## Architecture
- **Backend:** FastAPI (Python), SQLAlchemy, PostgreSQL
- **Frontend:** React (Vite, TailwindCSS)

## Setup and Running

1. **Pre-requisites:**
   - Docker and Docker Compose
   - Python 3.10+
   - Node.js 18+

2. **Starting the Database:**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   
   Create a `.env` file in the `backend` directory:
   ```env
   PROJECT_NAME=AdSync Pro
   VERSION=1.0.0
   API_V1_STR=/api/v1
   SECRET_KEY=change_me_in_production
   ACCESS_TOKEN_EXPIRE_MINUTES=11520
   ALGORITHM=HS256
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=http://localhost:8000

   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   POSTGRES_DB=adsync_pro
   POSTGRES_SERVER=localhost
   POSTGRES_PORT=5432

   # Optional token encryption key (if not set, SECRET_KEY is used)
   TOKEN_ENCRYPTION_KEY=change_me_too
   
   # Optional platform credentials for future real integrations
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   META_APP_ID=
   META_APP_SECRET=
   TIKTOK_CLIENT_KEY=
   TIKTOK_CLIENT_SECRET=
   ```

   Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Frontend Setup:**
   ```bash
   cd frontend
   copy .env.example .env  # On Linux/macOS: cp .env.example .env
   npm install
   npm run dev
   ```

## Current Auth + Sync Behavior (as requested)

- Internal user auth is **email-only** for now (no OTP/email verification).
- `POST /api/v1/auth/login` accepts:
  ```json
  {
    "email": "you@gmail.com",
    "company_name": "Acme Ads"
  }
  ```
- If the email does not exist, the backend auto-creates the user.
- Creator sync uses a **mock local approval URL** instead of external Google OAuth redirect in this build.

## Main Frontend Features

- Passwordless login page (Gmail input + optional company name).
- Dashboard with sidebar + action bar.
- Add Video form wired to `POST /api/v1/videos`.
- Creator sync link generation and one-click approval simulation.
- Video list table for current advertiser.
- Metrics dashboard with Recharts:
  - Demographics pie chart
  - Retention curve line chart



## New Direct YouTube Flow

- Dashboard now supports direct lookup by YouTube `video_id` without creator OAuth approval.
- Button: `See All My Videos` loads all videos saved for the authenticated advertiser.
- Compare page: `/compare` compares two YouTube videos without saving them to DB.

New APIs:

- `GET /api/v1/videos/youtube/public?video_id=<id>`
- `GET /api/v1/videos/youtube/compare?video_id_1=<id>&video_id_2=<id>`

Both endpoints require JWT authentication and use `YOUTUBE_API_KEY` from backend `.env`.

## YouTube Public Video Snapshot

Set `YOUTUBE_API_KEY` in `backend/.env` to enable public YouTube data in the Performance view.

New endpoint:

- `GET /api/v1/videos/{video_id}/youtube-public`

This returns title, published date, thumbnail, channel info, and public stats (`view_count`, `like_count`, `dislike_count` when available).
