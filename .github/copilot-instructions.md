# Copilot Instructions for RichList Admin

## Big Picture Architecture
- RichList Admin is a React + TypeScript web admin panel, scaffolded with Vite and styled using Tailwind CSS.
- Main app code is in `src/react-app/`, organized by domain:
  - `api/` (direct REST API calls)
  - `services/` (API abstractions)
  - `components/` (UI, modals, inputs)
  - `pages/` (routed from `main.tsx`)
  - `hooks/` (custom hooks, named `use*.ts`)
  - `lib/features/` (Redux slices)
  - `contexts/` (context providers)
  - `types/` (TypeScript types)
- Data flows: API calls in `api/` → abstractions in `services/` → state via Redux/context → UI in `components/`/`pages/`.
- Modals are React components (named `*Modal.tsx`), triggered from pages/components, state via context or props.
- Toast notifications use `ToastContext` and `ToastContainer`.
- Auth handled in `api/auth.ts` and `services/authService.ts`.
- Image/video upload: `api/imageUploud.ts`, `components/ImageUpload.tsx`, `VideoUpload.tsx`.
- Deployment: Vercel (`vercel.json`), Cloudflare Workers (`worker/`, `wrangler.json`).

## Key Workflows
- **Development:**
  - Install dependencies: `npm install`
  - Start dev server: `npm run dev`
  - Build for production: `npm run build`
- **Styling:**
  - Tailwind CSS is configured in `tailwind.config.js` and used throughout components.
- **TypeScript:**
  - Types are defined in `src/react-app/types/` and `src/shared/types.ts`.
- **API Integration:**
  - Use `api/` for direct API calls, and `services/` for higher-level abstractions.
- **Modals & UI Patterns:**
  - Modals are implemented as React components in `components/`, often named `*Modal.tsx`.
  - Toast notifications use `ToastContext` and `ToastContainer`.

## Project Conventions
- **Component Structure:**
  - Pages live in `pages/`, and are routed from `main.tsx`.
  - Shared UI and form elements are in `components/` and `components/input/`.
- **Hooks:**
  - Custom hooks are in `hooks/`, named as `use*.ts`.
- **State:**
  - Redux slices are in `lib/features/`.
  - Contexts are in `contexts/`.
- **File Naming:**
  - Use PascalCase for components, camelCase for hooks and utility functions.
- **Testing:**
  - No explicit test setup found; add tests in a `__tests__` or `tests/` directory if needed.

## Integration & External Services
- **Auth:**
  - Auth logic is in `api/auth.ts` and `services/authService.ts`.
- **Image/Video Upload:**
  - Handled in `api/imageUploud.ts` and `components/ImageUpload.tsx`/`VideoUpload.tsx`.
- **Vercel:**
  - Deployment config in `vercel.json`.
- **Cloudflare Workers:**
  - Worker code in `worker/`, config in `wrangler.json`.

## Examples
- To add a new modal: create `components/NewFeatureModal.tsx`, use context for state, and trigger from a page or parent component.
- To add a new API endpoint: add to `api/feature.ts`, export functions, and use in `services/` or directly in hooks/components.

## References
- See `README.md` for basic setup.
- See `vite.config.ts` and `tailwind.config.js` for build and styling config.
- See `src/react-app/types/` for type definitions.

---
For more, review the structure in `src/react-app/` and follow existing patterns for new features.
