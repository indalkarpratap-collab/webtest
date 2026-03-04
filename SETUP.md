# Setup Instructions

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas connection string

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
```

Update `backend/.env` with real values:
- `JWT_SECRET`
- `MONGODB_URI`

Run backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
```

Run frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Troubleshooting

1. Backend exits with Mongo error:
- Verify Atlas IP access list includes your machine/server.
- Check username/password/db name in `MONGODB_URI`.

2. Frontend cannot reach backend:
- Ensure backend is running on `5000`.
- Ensure `VITE_API_PROXY_TARGET=http://localhost:5000` in `frontend/.env`.

3. Auth errors (`Invalid token`):
- Ensure `JWT_SECRET` is set and stable across restarts.
