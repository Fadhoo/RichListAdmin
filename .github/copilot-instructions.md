# RichList Admin - AI Coding Agent Instructions

## Project Overview
RichList Admin is a **React + TypeScript admin dashboard** that communicates with an external API backend. The project uses Mocha framework tooling and integrates with Mocha's authentication service.

**Key Architecture:** 
- Frontend: React 19, Vite, TanStack Query, Redux Toolkit, Tailwind CSS
- Backend: External API (configured via `VITE_BASE_URL`)
- Auth: @getmocha/users-service for OAuth/session management
- Deployment: Static SPA (Vercel or similar)

**Note:** `src/worker/index.ts` is **deprecated** - the codebase uses an external backend API.

## Critical Patterns

### 1. Single Page Application
- **Entry point:** `src/react-app/main.tsx` → routes defined in `App.tsx`
- **API communication:** All endpoints accessed via `VITE_BASE_URL` environment variable
- Static build deployed as SPA with client-side routing

### 2. Data Fetching Strategy
**Use custom hooks, NOT direct API calls in components:**
```typescript
// ✅ Correct: Use domain-specific hooks
import { useUsers } from '@/react-app/hooks/useUsers';
const [state, actions] = useUsers({ initialPageSize: 25 });

// ❌ Avoid: Direct axios calls in components
```

**Hook pattern (see `useUsers.ts`, `useVenues.ts`, etc.):**
- Return `[state, actions]` tuple
- State includes `{ data, loading, error, currentPage, pageSize, searchTerm, sortConfig }`
- Actions include `{ refresh, setPage, setSearch, setSort, setFilters, exportData }`
- Server-side pagination/search is the default

### 3. API Layer Structure
All API functions live in `src/react-app/api/` and use the centralized axios instance:

```typescript
import { axiosInstance } from '../hooks/useAxios';
const response = await axiosInstance().get('/v1/users');
```

**Axios instance features (useAxios.ts):**
- Auto-injects `Bearer ${token}` from localStorage
- Base URL from `VITE_BASE_URL` env variable (points to external backend)
- Handles 401 → auto-logout via `logout()` from `lib/localStorage.ts`
- Transforms 500 errors to generic "Server error"

**Important:** The backend API is external and separate from this codebase.

### 4. Modal-Driven CRUD
All create/edit operations use modals (not separate pages):
- `VenueEditModal.tsx`, `UserEditModal.tsx`, `EventEditModal.tsx`, etc.
- Modals receive `isOpen`, `onClose`, `onSuccess`, and optional `initialData` props
- On success, modals call `onSuccess()` to trigger parent refresh + close modal

### 5. Toast Notifications
**Use ToastContext, NOT react-toastify directly:**

```typescript
import { useToast } from '@/react-app/contexts/ToastContext';
const { showSuccessToast, showErrorToast } = useToast();

// Then use in try/catch:
showSuccessToast('User updated successfully');
showErrorToast('Failed to save changes');
```

Toast types: `success`, `error`, `info`, `warning`

### 6. DataTable Component
The reusable `DataTable.tsx` supports:
- **Server-side mode:** Pass `totalItems`, `currentPage`, pagination handlers
- **Client-side mode:** Pass just `data`, component handles filtering/sorting
- Built-in search, sort, filter, export functionality
- Define columns with `key`, `title`, `sortable`, `render` function

Example column definition:
```typescript
const columns: TableColumn<User>[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    render: (value, record) => <span className="font-medium">{value}</span>
  }
];
```

## File Organization Rules

### Path Aliases
Use `@/` alias (configured in `vite.config.ts`):
```typescript
import { axiosInstance } from '@/react-app/hooks/useAxios';
import { User } from '@/react-app/types/users';
import { CreateVenueSchema } from '@/shared/types';
```

### Type Definitions
- **API request/response types:** `src/react-app/types/*.ts` (e.g., `users.ts`, `venues.ts`)
- **Zod schemas for validation:** `src/shared/types.ts` (shared between frontend & worker)
- Always export both Zod schema AND inferred TypeScript type:
  ```typescript
  export const CreateVenueSchema = z.object({ name: z.string() });
  export type CreateVenue = z.infer<typeof CreateVenueSchema>;
  ```

### Component Structure
- Place in `src/react-app/components/` (modals, tables, layouts)
- Page components in `src/react-app/pages/` (one per route)
- Pages import components and hooks, handle routing logic only

## Development Workflows

### Commands
```bash
bun install           # Install dependencies
bun dev              # Start dev server (Vite only)
bun run build        # Production build (static SPA)
bun run lint         # ESLint
```

### Environment Variables
Required in `.env` (not committed):
- `VITE_BASE_URL` - External backend API base URL (e.g., `http://localhost:3000/api` or production URL)

### Authentication Flow
1. User creturned from external backend API
4. Frontend stores JWT in localStorage as `tkn`
5. `ProtectedRoute` checks for `tkn` → redirects to `/login` if missing
6. All subsequent API calls include token via axios interceptor
4. Frontend stores JWT in localStorage as `tkn`
5. `ProtectedRoute` checks for `tkn` → redirects to `/login` if missing

### Adding New Features
**Example: Add a new "Products" CRUD**
1. Define types in `src/react-app/types/produc (for frontend validation)
3. Create API functions in `src/react-app/api/products.ts` (calls external backend)
4. Create custom hook `src/react-app/hooks/useProducts.ts` (follow `useUsers.ts` pattern)
5. Create page `src/react-app/pages/Products.tsx` using DataTable + modal components
6. Create modal `src/react-app/components/ProductEditModal.tsx`
7. Add route in `App.tsx` under ProtectedRoute

**Note:** Backend endpoints must be added to the external API separately.uctEditModal.tsx`
8. Add route in `App.tsx` under ProtectedRoute

## Common Pitfalls

1. **Don't use TanStack Query directly** - Custom hooks already wrap data fetching. Only use `QueryClientProvider` at app root.

2. **LocalStorage keys:** 
   - Auth token: `tkn` (set by login, cleared by logout in `lib/localStorage.ts`)
   - External backend dependency:** All data operations require the external API to be running. Check `VITE_BASE_URL` configuration if API calls fail.

4. **Image/video uploads:** Use `ImageUpload.tsx` and `VideoUpload.tsx` components which handle uploads via the external backendles.

4. **Image/video uploads:** Use `ImageUpload.tsx` and `VideoUpload.tsx` components which handle R2 bucket uploads via the worker API.

5. **Debouncing searches:** Always use `useDebounce` hook for search inputs to avoid excessive API calls (see `DataTable.tsx` implementation).

## Key Freact-app/hooks/useAxios.ts`](../src/react-app/hooks/useAxios.ts) - Axios instance with auth interceptor & backend URL config
- [`src/react-app/hooks/useServerSideTable.ts`](../src/react-app/hooks/useServerSideTable.ts) - Generic server-side table hook
- [`src/react-app/components/DataTable.tsx`](../src/react-app/components/DataTable.tsx) - Reusable table with pagination/search/sort
- [`src/react-app/contexts/ToastContext.tsx`](../src/react-app/contexts/ToastContext.tsx) - Toast notification system
- [`src/react-app/api/`](../src/react-app/api/) - API client functions (all call external backend)
- [`src/shared/types.ts`](../src/shared/types.ts) - Zod schemas for frontend validation

**Deprecated:**
- [`src/worker/index.ts`](../src/worker/index.ts) - No longer used; backend is externalontext.tsx) - Toast notification system
- [`src/shared/types.ts`](../src/shared/types.ts) - Zod schemas for validation
