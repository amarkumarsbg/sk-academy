# SK Academy — School Management System

A full-stack school management app for **SK Academy** with a public website and staff admin portal.

## Tech Stack

### Frontend
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Leaflet (school map), Motion (animations)

### Backend (`server/`)
- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- JWT auth (httpOnly cookie)
- Multer (image uploads to local `/uploads`)

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB running locally (or MongoDB Atlas URI in `server/.env`)

### 1. Install dependencies

```bash
npm install
npm install --prefix server
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
cp .env.local.example .env.local
```

Edit `server/.env` if needed (MongoDB URI, JWT secret, admin credentials).

### 3. Seed the database

```bash
npm run seed
```

Creates admin user, site content, and sample school data.

### 4. Run development servers

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- API (direct): [http://localhost:4000](http://localhost:4000)

**Default admin credentials** (after seed):
- Email: `admin@skacademy.edu`
- Password: `admin1234`

## Project Structure

```
src/                    # Next.js frontend
  app/(public)/         # Public website
  app/admin/            # Staff portal
  lib/api/              # API client
server/                 # Express REST API
  src/models/           # Mongoose models
  src/routes/           # API routes
  src/scripts/seed.ts   # Database seed
```

## API Overview

All routes are proxied via Next.js rewrites at `/api/*`.

| Route | Auth | Description |
|-------|------|-------------|
| `POST /api/auth/login` | Public | Staff login |
| `GET /api/site-content` | Public | Website CMS content |
| `PUT /api/site-content` | Staff | Update CMS content |
| `GET/POST /api/students` etc. | Staff | CRUD for school modules |
| `POST /api/contact` | Public | Contact form submission |
| `POST /api/admission-inquiries` | Public | Admission inquiry |
| `POST /api/upload` | Staff | Image upload |

## Deployment

Deploy with **Vercel** (frontend) + **Render** (backend) + **MongoDB Atlas** (database).

See **[DEPLOY.md](./DEPLOY.md)** for the full step-by-step guide.

Quick summary:

1. Deploy `server/` to **Render** (uses `render.yaml`).
2. Deploy the repo root to **Vercel** with `API_URL=https://your-api.onrender.com`.
3. Set Render `CLIENT_URL` to your Vercel URL.
4. Run `npm run seed` once against Atlas.
