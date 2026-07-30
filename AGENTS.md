# Blog Hub — Agent Guide

## Project structure

```
blog-hub/
├── backend/          # FastAPI + PostgreSQL (Python)
├── web/              # React 19 + Vite + Tailwind v4 (frontend)
```

**Not a monorepo** — two independent apps with separate dependency files and run commands.

---

## Backend (`backend/`)

### Stack
- FastAPI, SQLAlchemy 2.0 (async session via `SessionLocal`), Alembic, PostgreSQL
- Auth: JWT (PyJWT) with access + refresh tokens; password hashing via Argon2 (`pwdlib`)
- File uploads: Cloudinary (cover images, post images, avatars)
- Email: Resend (production), Ethereal (dev)
- Google OAuth: `google-auth` library (ID token verification)

### Key commands
```bash
cd backend
source .venv/Scripts/activate    # Windows
uvicorn app.main:app --reload    # Dev server on :8000
alembic revision --autogenerate -m "msg"
alembic upgrade head
```

### Architecture pattern (every module follows this)
```
Route (api/routes/*.py)
  → Service (services/*_service.py)
    → Repository (repositories/*_repository.py)
      → SQLAlchemy ORM Model (models/*.py)
```

Dependency injection is wired in `api/dependencies/services.py`. Routes declare `Depends(get_<service>_service)`.

### .env required vars
`DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `CLOUDINARY_*`, `GOOGLE_*`, `RESEND_API_KEY`, `MAIL_*`, `FRONTEND_URL`. See `.env` for all keys.

Settings are cached via `@lru_cache` on `get_settings()` — restart server after `.env` changes.

### All routes under `/api/v1/`
Auth, Users, Profile, Categories, Tags, Posts, Comments, Likes, Bookmarks, Follows. See `api/router.py`.

### Pagination
All list endpoints accept `page` (≥1) and `page_size` (1–100) query params. Return `{ data, meta: { total, page, page_size, total_pages } }`.

### Migrations
Alembic revisions in `alembic/versions/`. Models are auto-discovered via `app/models/__init__.py` imports in `alembic/env.py`.

---

## Frontend (`web/`)

### Stack
React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router v7, TanStack React Query v5, Zustand, Axios, shadcn/ui, framer-motion

### Key commands
```bash
cd web
npm run dev           # Vite dev server on :5173
npm run build         # tsc -b && vite build
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm run format        # prettier
```

**Build order**: `npm run build` runs typecheck before vite build. Always run `typecheck` before committing.

### Key architecture
- **Entry**: `src/main.tsx` → `AppProviders` (providers wrapper) → `App` (`AppRoutes`)
- **Routing**: `src/routes/app-routes.tsx` — lazy-loaded pages via `React.lazy` + `Suspense`, `ProtectedRoute` wrapper for auth-guarded pages
- **API client**: Axios instance in `src/api/axios.ts`; interceptors in `src/api/interceptors.ts` (auto-injects Bearer token, handles 401 → refresh → retry)
- **Auth state**: Zustand store `src/store/auth.store.ts` — manual `localStorage`/`sessionStorage` persistence based on "remember me" flag
- **Query keys**: Centralized in `src/hooks/use-posts.ts` (`queryKeys.posts`, `queryKeys.categories`, `queryKeys.tags`)
- **`@/` path alias** → `./src/`

### Service layer
Each domain has a service file in `src/services/*.service.ts`. List methods accept `{ page?, page_size? }` and return `ApiSuccess<T>` (`.data` = items, `.meta` = pagination). `ApiSuccess` type in `src/types/api.ts`.

### Google OAuth
Uses `@react-oauth/google` with `GoogleOAuthProvider` in `app-providers.tsx`. Client ID from `VITE_GOOGLE_CLIENT_ID` env var. The `GoogleLogin` component posts the ID token to `POST /api/v1/auth/google`.

### Auth flow
- Login: `POST /auth/login` → store tokens in `sessionStorage` (unchecked) or `localStorage` (checked "remember me")
- Google: `GoogleLogin` component → `POST /auth/google` with `{ id_token }` → auto-create/link user
- Token refresh: handled by Axios response interceptor (single-flight, queues concurrent 401s)
- Auth guard: `ProtectedRoute` redirects to `/login` preserving `location.state.from`

### Components
- shadcn/ui primitives in `src/components/ui/`
- App-specific: `AuthLayout`, `AuthCard`, `BrandVisual`, `PostCard`, `UserCard`, `LeftSidebar`, `RightSidebar`
- Pagination component in `src/components/ui/pagination.tsx`
