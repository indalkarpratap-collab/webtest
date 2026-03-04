# MCQ Exam System

MCQ exam platform with React frontend and Express backend, now upgraded to:
- MongoDB Atlas (Mongoose) for persistence
- Vite for frontend dev/build tooling

## Tech Stack

### Frontend
- React 18
- React Router 6
- Axios
- Vite 7

### Backend
- Express 5
- Mongoose 8 (MongoDB Atlas)
- JWT authentication
- bcryptjs
- Zod validation
- Helmet, Morgan, express-rate-limit

## Quick Start

### 1) Configure backend env

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=replace_with_strong_secret
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
```

### 2) Install and run backend

```bash
cd backend
npm install
npm run dev
```

### 3) Configure frontend env

Create `frontend/.env`:

```env
PORT=5173
VITE_API_PROXY_TARGET=http://localhost:5000
VITE_API_URL=
```

### 4) Install and run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Exams
- `GET /api/exams`
- `GET /api/exams/:id`
- `POST /api/exams` (auth required)
- `PUT /api/exams/:id` (auth required, owner only)
- `DELETE /api/exams/:id` (auth required, owner only)

## Notes

- If you are migrating old JSON data, import it into MongoDB Atlas separately.
