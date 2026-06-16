# SK Academy — School Management System (Frontend Demo)

A modern, full-stack-ready frontend demo for **SK Academy** with two connected portals:

- **Public Website** — About, Admissions, Academics, Events, News, Gallery, Contact
- **Admin Portal** — Dashboard, Students, Teachers, Admissions, Attendance, Fees, Exams, Results, Notices, Events, CMS, Settings

> **Note:** This is a **frontend-only demo** with mock data. Backend API, database, and authentication will be added in a future phase.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Lucide Icons**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

- **Staff Portal:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login) → click "Sign In (Demo)" to enter the admin dashboard.

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   └── admin/
│       ├── login/         # Demo login page
│       └── (portal)/      # Admin dashboard & modules
├── components/
│   ├── public/            # Header, footer, hero
│   └── admin/             # Sidebar, data tables
├── data/mock/             # Mock data (replace with API later)
└── lib/config.ts          # Site config & navigation
```

## Future Backend Integration

When ready, replace mock data in `src/data/mock/` with API calls to:

- PostgreSQL + Prisma
- Auth.js for staff login & RBAC
- REST or tRPC API routes

Forms and action buttons are intentionally disabled or demo-only until the backend is built.
