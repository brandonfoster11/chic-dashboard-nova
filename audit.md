## StyleAI: Full Codebase & UX Audit Report

### Overview
This report contains a comprehensive audit of the StyleAI GitHub repository across all pages, components, hooks, libraries, and architectural layers. The audit was conducted page-by-page and file-by-file to support both engineering implementation and design refinement.

The goal is to prepare StyleAI for production-readiness, scalability, and AI-integrated wardrobe personalization. This document is intended to be implementation-ready for integration into Windsurf task management.

---

## ✅ General Strengths

- Modern stack: React, TypeScript, Vite, ShadCN UI, TanStack Query, TailwindCSS, Zod
- Strong architecture: Contexts, hooks, services, and reusable components
- Clean styling: Utility-first design with consistent spacing and motion readiness
- Modular file system: Pages, components, and logic are properly scoped

---

## 📄 Pages: Full Review

**Design Upgrade Overview:**
Every page should move toward a unified visual language that embraces soft depth (via neumorphism), elegant transitions (via Framer Motion), and tonal contrast (via the new grayscale palette). Typography, spacing, layout rhythm, and animation consistency should be applied to all views.

### About.tsx
- ✅ Clean layout, accessible structure, responsive grid
- ❌ No mobile spacing, missing aria-labels, CTA button does not route
- 🔧 Add `onClick` handler for CTA, use semantic regions like `<section>` with ARIA roles for better accessibility, and apply consistent spacing with Tailwind utilities like `p-6` or `space-y-4`

### AddItem.tsx
- ✅ Zod + RHF validation, file input, async mutation
- ❌ No image upload, error toasts, or preview
- 🔧 Integrate Supabase Bucket image upload (e.g., bucket: `wardrobe-items/`), use `URL.createObjectURL()` for preview, and add toast notifications for upload success/failure with fallback image states for failures

### CreateOutfit.tsx
- ✅ Chat-based UX, context-aware AI, isGenerating logic
- ❌ No error fallback, no scroll-to-bottom, missing CTA after generation
- 🔧 Add `react-toast` or `useToast()` for error feedback, implement auto-scroll to new content with a scroll anchor or `ref`, and insert a `Save Outfit` and `Download` button after generation

### Dashboard.tsx
- ✅ Responsive cards, stat layout, recent activity placeholder
- ❌ Static data, no loading states, not personalized
- 🔧 Fetch data using TanStack Query with caching; add `SkeletonCard` loading placeholders for widgets; pull wardrobe stats per authenticated user via Supabase RPC or `from('outfits').count()`

**Visual Enhancements:**
- Cards with neumorphic drop shadow, padded `p-6` and rounded-xl styling
- Animate card entrance with Framer Motion (staggered fade/scale)
- Typography: `text-xl font-semibold` for titles, `text-sm text-gray-500` for metadata
- Group dashboard metrics in a responsive grid with `gap-8` and mobile stacking

### ForgotPassword.tsx
- ✅ Zod validation, success state, alert component
- ❌ No keyboard focus, no error mapping, long redirect delay
- 🔧 Auto-focus first field on mount, add ARIA live region for feedback, shorten redirect to 3–5s, and use form-wide error state to surface auth errors from Supabase

### Help.tsx
- ✅ Clean accordion UI for FAQ, clear sections
- ❌ No search, no ARIA headings, links not actionable
- 🔧 Add a `CommandBar`-style fuzzy search with results scroll; wrap questions in a `<nav aria-labelledby="faq-heading">` container; ensure links have `href` or actionable buttons with `aria-label`

**Visual Enhancements:**
- Use soft card backgrounds (`bg-gray-90`) with padding and shadows
- Animate accordion open/close with spring transitions
- Highlight selected FAQ item with `ring-2 ring-primary` on focus or active

### Landing.tsx
- ✅ Strong visual hierarchy, grid-based features, clean CTA
- ❌ Icons missing, duplicate copy, no animation or meta tags
- 🔧 Use Lucide icons or Heroicons; reduce copy blocks to scannable highlights; use Framer Motion for fade/scale entrance; add meta description, OG image, and Twitter card support

**Visual Enhancements:**
- Use background: `bg-gray-90` (new palette) and contrast headings with `text-gray-100`
- Add neumorphic call-to-action section with glow hover on primary button
- Typography upgrade: headline `text-4xl font-bold`, body `text-lg text-gray-600`
- Layout: center with `max-w-3xl mx-auto pt-20 pb-32 px-6`, add vertical rhythm using `space-y-12`.

**Suggested Animation Example:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <h1 className="text-4xl font-bold">Welcome to StyleAI</h1>
</motion.div>
```

### Login.tsx
- ✅ Strong validation, disabled loading state, clean inputs
- ❌ No toast on login, no password reveal, no "remember me"
- 🔧 Integrate `useToast()` on login success/failure; add toggle to input `type=password` visibility; implement a `remember me` checkbox to persist session in localStorage

### Onboarding.tsx
- ✅ Context-based stepper, progress bar, flexible config
- ❌ No validation per step, abrupt transitions, no save
- 🔧 Add per-step schema validation via `zod` switch or key-by-step object map; animate transitions using `FramerMotion`; store answers in localStorage or Supabase `profiles.meta` column

**Visual Enhancements:**
- Style steps with elevated neumorphic containers and glow progress markers
- Improve spacing with `space-y-8` and consistent margins between steps
- Use animated entrance/exit between steps with stagger delay for inputs.

**Framer Motion Stepper Example:**
```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={step}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.4 }}
  >
    {stepComponent}
  </motion.div>
</AnimatePresence>
```

### Outfit.tsx
- ✅ Responsive grid, clear card structure
- ❌ Static data, no search/filter logic, no empty state
- 🔧 Fetch outfit list via Supabase with user filtering; add filter by `tag` or `occasion`; show an empty state with illustration and `Add First Outfit` CTA

### Privacy.tsx
- ✅ Semantic HTML and layout
- ❌ No contact email, no TOC or timestamp
- 🔧 Include a "last updated" date at the top; generate Table of Contents dynamically if Markdown; add a support email at the bottom

### Pricing.tsx
- ✅ Highlighted "Pro" plan, icon usage, responsive layout
- ❌ Plan clicks not tracked, no animation, no payment integration
- 🔧 Use analytics to track click-throughs; animate plan selection; wire checkout session via Stripe and save plan metadata to Supabase user profile

---

## 🧩 Components Audit

### Footer.tsx
- ✅ Logical link sections, grid layout
- ❌ Buttons used instead of `<Link>`, no `target="_blank"` on socials
- 🔧 Use `Link` from `react-router-dom` for SPA routing and `<a target="_blank" rel="noopener noreferrer">` for external links; fix semantic roles

### ImageUpload.tsx
- ✅ Dropzone logic, validation, modular
- ❌ No image previews, no keyboard nav, no aria labels
- 🔧 Show previews using `URL.createObjectURL`; allow keyboard focus with `tabIndex`; add `role="button"` and `aria-label="Upload an image"`

### Navbar.tsx
- ✅ Role-based links, logout, dark mode
- ❌ Uses next-themes (bad for Vite), no mobile nav, no dropdown
- 🔧 Replace `next-themes` with context-based theme; add mobile `DropdownMenu` with conditional rendering based on auth; use `aria-expanded` for menu button

### OutfitCard.tsx
- ✅ Clean structure, zoom hover, alt text
- ❌ No routing, no actions, no accessibility
- 🔧 Wrap card in `<Link to={/outfit/${id}}>`; add action buttons (like, save, share); include `aria-label="Outfit Card"` and keyboard shortcuts for favoriting

### QuickAction.tsx
- ✅ Icon-based button card, type-safe props
- ❌ No loading state, no a11y labels
- 🔧 Add `isLoading` spinner prop; use `aria-label` for each quick action button and describe the shortcut

### ProgressBar.tsx
- ✅ Used in onboarding, clean bar logic
- ❌ Not fully animated
- 🔧 Animate using `FramerMotion` `layout` prop or progress with `initial/animate`; fallback to `<progress>` with screenreader text.

**Suggested Implementation Example:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  className="h-2 bg-primary rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.4, ease: 'easeInOut' }}
/>
```
This will visually animate the bar as the onboarding progresses.

---

## 🧠 Hooks

### use-auth.ts
- ✅ Listens to Supabase events, returns clean login/logout
- ❌ No toast or global error UI
- 🔧 Wrap in `AuthProvider` and surface state via `useToast()` on error; persist login with `localStorage` fallback

### use-mobile.tsx
- ✅ Simple media detection
- ❌ Not SSR-safe, no initial screen fallback
- 🔧 Guard access with `typeof window !== 'undefined'`; default to `false` or `sm` breakpoint width in SSR mode

### use-outfit.ts
- ✅ Three hooks for fetch/generate/save
- ❌ No toasts or retry handling
- 🔧 Add success/error toasts; retry on network failure with React Query mutation options

### use-toast.ts
- ✅ Full reducer, timeout map, update logic
- ❌ Default timeout is ~17 mins, no hook
- 🔧 Decrease to 5–8 seconds for typical UI toast; add `useToast()` consumer hook for cleaner component integration

### use-wardrobe.ts
- ✅ Full CRUD with Supabase, great caching
- ❌ No feedback, no optimistic updates
- 🔧 Add optimistic UI using `onMutate` + `onError` rollbacks with TanStack Mutation API; paginate list via `limit` and `offset`

---

## 📦 Lib & Services

### lib/supabase.ts
- ✅ Clean singleton setup
- ❌ No missing env check, no admin client
- 🔧 Add `validateEnv()` function to throw error if required `SUPABASE_URL`, `SUPABASE_ANON_KEY` is missing; optionally include admin client for server-only operations

### lib/utils.ts
- ✅ `cn()` combines Tailwind classes safely
- ❌ No issues

### react-query/QueryProvider.tsx
- ✅ Global client with defaults
- ❌ No DevTools
- 🔧 Import `ReactQueryDevtools` and add conditionally in `development` environment

### validations/auth.ts
- ✅ Strong schemas for auth + types
- ❌ No trimming, no max limits
- 🔧 Add `.trim()` to email/name fields; limit string length to 50–64 chars; use password strength pattern check with `.regex()` for security

---

## 🛠 Priority Roadmap

### Phase 1: Fixes
- Replace next-themes → context-based theming system with localStorage persistence
- Add Supabase integration for: Outfits (create/list/delete), Wardrobe (upload/view), Auth (login/logout/session)
- Implement loading + error states using skeletons and toast fallback
- Add search inputs and dropdown filters for Outfits and Wardrobe, validated by zod

### Phase 2: Features
- Add favoriting toggle to Outfits and sync to user profile metadata
- Enable sharing (copy link, open modal) and downloading outfit image grid
- Persist onboarding answers in Supabase profiles
- Add Stripe billing integration and show plan status in Dashboard

### Phase 3: Testing & QA
- Write unit tests for FormFields, Cards, Navbar using Vitest
- Add integration tests for onboarding flow and CreateOutfit chat stream
- Use Mock Service Worker (MSW) to mock Supabase and OpenAI Vision responses

---

## 🔐 Authentication Layer
- ✅ Real-time Supabase auth events handled in use-auth.ts
- 🔧 Needs full session persistence, error toast, and context fallback on reload

## 🧠 State Management
- ✅ Context + hooks for onboarding, auth, wardrobe
- ⚙️ Consider Zustand for multi-page state, undo/redo, or persisting onboarding results

## 🤖 AI Integration
- ✅ OpenAI Vision mock pipeline
- 🔧 Add input validation, loading overlay, retry if failure, and timestamp when generated

## 🔗 Supabase
- ✅ Integrated in services and hooks
- 🔧 Apply row-level security (RLS) policies by user ID; use separate image bucket for wardrobe uploads; sanitize all incoming data

## 🧰 Testing Strategy
- ✅ Hooks and services are testable
- 🔧 Add `tests/__mocks__` for supabase, openai, react-query; validate form edge cases; include CI runner for Vitest

---

