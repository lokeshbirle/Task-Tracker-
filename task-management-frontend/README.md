# Task Management Frontend (React + Vite + Tailwind)

Built against the MongoDB/Spring Boot backend from `task-management-backend`.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if your backend isn't on localhost:8080
npm run dev
```

Runs on `http://localhost:5173`.

## First-time use

There's no seeded account. Either:
- Register via the UI (`/register`) — always creates an EMPLOYEE, or
- Use `POST /api/auth/register` directly (e.g. via curl/Postman) with `"role": "ADMIN"` to create your first Admin.

## Structure

```
src/
├── api/            One module per backend resource (auth, users, teams, tasks, comments, activity, notifications, dashboard)
├── context/        AuthContext — holds the JWT + current user, exposes login/register/logout
├── routes/         ProtectedRoute (requires login), AdminRoute (requires ADMIN role)
├── layouts/        DashboardLayout + role-aware Sidebar
├── components/     Reusable pieces: badges, modals (task/team/user forms, status update, reassign), comments, activity timeline
├── pages/
│   ├── Login.jsx, Register.jsx, Notifications.jsx   (shared)
│   ├── admin/                                        (Admin-only screens)
│   ├── employee/                                     (Employee-only screens)
│   └── shared/TaskDetail.jsx                          (used by both — actions shown depend on role/ownership)
└── utils/          Enum constants (mirrors backend exactly) + date formatting
```

## Notes

- **RBAC is UI-only here.** Buttons are hidden based on role so people don't hit 403s, but the backend's
  `@PreAuthorize`/`SecurityConfig` rules are the real enforcement — never trust the frontend for security.
- `GET /api/tasks` returns different data depending on who's logged in (all tasks for Admin, only
  assigned tasks for Employee) — the frontend doesn't filter this client-side, it trusts the backend's scoping.
- `overdue` is a field the backend computes per-request — the frontend never calculates it itself.
- Status update enforces "BLOCKED requires a reason" client-side too, purely for a faster feedback loop;
  the backend rejects it either way if missing.
