# RichList Admin - AI Coding Agent Instructions

## Project Overview
RichList Admin is a **React + TypeScript admin dashboard** for managing venues, events, bookings, stories, and concierge services. Built with Mocha framework tooling.

**Key Architecture:** 
- Frontend: React 19, Vite, TanStack Query, Tailwind CSS
- Backend: External REST API (configured via `VITE_BASE_URL` env variable)
- Auth: @getmocha/users-service for Google OAuth + session management
- Deployment: Static SPA (Vercel)

**Critical:** `src/worker/index.ts` contains the **deprecated Cloudflare Workers backend** (Hono + D1). The app now uses an external Node.js API. The worker file is kept for reference only.

## Critical Patterns

### 1. Data Fetching with Custom Hooks
**Always use domain-specific hooks, NOT direct API calls in components:**
```typescript
// ✅ Correct: Use custom hooks that encapsulate fetching logic
import { useUsers } from '@/react-app/hooks/useUsers';
const [state, actions] = useUsers({ initialPageSize: 25 });

// ❌ Wrong: Direct API calls in components
import { fetchUsers } from '@/react-app/api/users';
const data = await fetchUsers(1, 25, '');
```

**Hook pattern structure:**
- Return tuple: `[state, actions]`
- State: `{ data, loading, error, totalItems, currentPage, pageSize, searchTerm, sortConfig, filters }`
- Actions: `{ refresh, setPage, setPageSize, setSearch, setSort, setFilters, exportData }`
- Examples: `useUsers`, `useVenues`, `useEvents`, `useStories`, `useBooking`

### 2. API Client Layer
All API functions in `src/react-app/api/` use the centralized axios instance:

```typescript
import { axiosInstance } from '../hooks/useAxios';
const response = await axiosInstance().get('/v1/users', { 
  params: { page, limit, search, sortBy: 'createdAt:desc' }
});
```

**Key axios features:**
- Auto-injects `Bearer ${token}` from localStorage (`tkn` key)
- Base URL from `VITE_BASE_URL` environment variable
- Intercepts 401 → triggers `logout()` (clears localStorage + redirects to `/login`)
- Transforms 500 errors to generic "Server error" message
- Timeout: 5 minutes (300000ms)

### 3. Modal-Driven CRUD Operations
All create/edit operations use modals, not separate pages:

**Modal naming convention:** `{Entity}EditModal.tsx` (e.g., `VenueEditModal`, `UserEditModal`, `EventEditModal`)

**Standard modal props:**
```typescript
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Entity;  // Optional: undefined for create, provided for edit
}
```

**Modal workflow:**
1. Parent page manages modal state with `useState<boolean>`
2. Parent passes `onSuccess` callback that calls `actions.refresh()` from custom hook
3. Modal validates with Zod schema, calls API function, shows toast, then calls `onSuccess()`
4. Modal closes after successful operation

### 4. Toast Notification System
**Use ToastContext, NOT react-toastify directly:**

```typescript
import { useToast } from '@/react-app/contexts/ToastContext';
const { showSuccessToast, showErrorToast } = useToast();

// In try/catch blocks:
try {
  await updateUser(id, data);
  showSuccessToast('User updated successfully');
  onSuccess();
} catch (error) {
  showErrorToast(error.message || 'Failed to update user');
}
```

Available toast types: `showSuccessToast`, `showErrorToast`, `showInfoToast`, `showWarningToast`

### 5. DataTable Component Pattern
The reusable `DataTable.tsx` component is central to all list pages. It automatically detects whether to use server-side or client-side mode:

**Server-side mode** (default for this app - used in all admin pages):
```typescript
<DataTable
  data={state.users}
  columns={userColumns}
  loading={state.loading}
  totalItems={state.totalItems}
  currentPage={state.currentPage}
  pageSize={state.pageSize}
  searchTerm={state.searchTerm}
  sortConfig={state.sortConfig}
  filters={state.filters}
  onPageChange={actions.setPage}
  onPageSizeChange={actions.setPageSize}
  onSearchChange={actions.setSearch}
  onSortChange={actions.setSort}
  onFilterChange={actions.setFilters}
  onRefresh={actions.refresh}
  searchable={true}
  emptyState={{
    icon: Users,
    title: "No users found",
    description: "Get started by adding your first user",
    action: <button onClick={() => setIsModalOpen(true)}>Add User</button>
  }}
/>
```

**Column definition structure:**
```typescript
const columns: TableColumn<User>[] = [
  {
    key: 'name',              // Dot notation supported: 'wallet.balance'
    title: 'Name',
    sortable: true,           // Enable sorting for this column
    render: (value, record) => (  // Custom render function
      <span className="font-medium">{value}</span>
    )
  }
];
```

**Built-in features:**
- Search with debouncing (300ms delay via `useDebounce` hook)
- Sortable columns (click header to toggle asc/desc/none)
- Filter dropdowns (pass `filterOptions` prop)
- Pagination with page size selector
- Export to CSV functionality
- Loading states and empty states
- Responsive design

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
1. User clicks "Login with Google" → redirected to Google OAuth
2. After auth, redirected to `/auth/callback` with code
3. Frontend exchanges code for session token via external backend API
4. Frontend stores JWT in localStorage as `tkn`
5. `ProtectedRoute` checks for `tkn` → redirects to `/login` if missing
6. All subsequent API calls include token via axios interceptor

### Adding New Features
**Example: Add a new "Products" CRUD**
1. Define types in `src/react-app/types/products.ts` (frontend types)
2. Add Zod schemas in `src/shared/types.ts` (for frontend validation)
3. Create API functions in `src/react-app/api/products.ts` (calls external backend)
4. Create custom hook `src/react-app/hooks/useProducts.ts` (follow `useUsers.ts` pattern)
5. Create page `src/react-app/pages/Products.tsx` using DataTable + modal components
6. Create modal `src/react-app/components/ProductEditModal.tsx`
7. Add route in `App.tsx` under ProtectedRoute

**Note:** Backend endpoints must be added to the external API separately.

## Common Pitfalls

1. **Don't use TanStack Query directly** - Custom hooks already wrap data fetching. Only use `QueryClientProvider` at app root.

2. **LocalStorage keys:** 
   - Auth token: `tkn` (set by login, cleared by logout in `lib/localStorage.ts`)

3. **External backend dependency:** All data operations require the external API to be running. Check `VITE_BASE_URL` configuration if API calls fail.

4. **Image/video uploads:** Use `ImageUpload.tsx` and `VideoUpload.tsx` components which handle uploads via the external backend.

5. **Debouncing searches:** Always use `useDebounce` hook for search inputs to avoid excessive API calls (see `DataTable.tsx` implementation).

## Key Files
- [`src/react-app/hooks/useAxios.ts`](../src/react-app/hooks/useAxios.ts) - Axios instance with auth interceptor & backend URL config
- [`src/react-app/hooks/useServerSideTable.ts`](../src/react-app/hooks/useServerSideTable.ts) - Generic server-side table hook
- [`src/react-app/components/DataTable.tsx`](../src/react-app/components/DataTable.tsx) - Reusable table with pagination/search/sort
- [`src/react-app/contexts/ToastContext.tsx`](../src/react-app/contexts/ToastContext.tsx) - Toast notification system
- [`src/react-app/api/`](../src/react-app/api/) - API client functions (all call external backend)
- [`src/shared/types.ts`](../src/shared/types.ts) - Zod schemas for frontend validation

**Deprecated:**
- [`src/worker/index.ts`](../src/worker/index.ts) - No longer used; backend is external
