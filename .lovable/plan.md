
The user wants a full HN-groupe site. Note: this project uses TanStack Start (not Next.js), but I'll deliver the same functionality using the project's stack. Lovable AI Gateway will power the real chat (better than mock). Tailwind v4 is already set up.

## Plan

### Design
- Dark navy background with gold/orange accent (per request)
- Update `src/styles.css` design tokens (dark default, gold accent), keep oklch
- Modern, professional, responsive

### Routes (TanStack Start file-based routing)
- `src/routes/__root.tsx` — add Header + Footer + floating ChatWidget on every page
- `src/routes/index.tsx` — Home (Hero, About, Services preview, Highlighted projects, How it works)
- `src/routes/services.tsx` — Detailed services
- `src/routes/portfolio.tsx` — Grid + client-side filters
- `src/routes/start-project.tsx` — Project request form (reads optional query params for prefill)

Each route gets its own `head()` metadata.

### Components (`src/components/`)
- `layout/Header.tsx` — logo, nav links, "Start your project" CTA
- `layout/Footer.tsx`
- `home/HeroSection.tsx`, `home/AboutSection.tsx`, `home/HowItWorks.tsx`
- `services/ServicesSection.tsx` (reused on home + services)
- `portfolio/PortfolioGrid.tsx` with filter buttons
- `forms/StartProjectForm.tsx`
- `chat/ChatWidget.tsx` — floating bubble, expands to panel, quick suggestions, renders structured AI replies + "Use this to start a project" button (navigates to `/start-project` with query params)

### Data
- `src/data/projects.ts` — static portfolio (6–8 projects with categories: website / ecommerce / platform)
- `src/data/services.ts` — services list

### Server functions (TanStack Start `createServerFn`, replaces Next.js API routes)
- `src/server/chat.ts` — `sendChatMessage` server fn calling Lovable AI Gateway (`google/gemini-2.5-flash`, free) with system prompt instructing it to return JSON `{ projectType, suggestedPages, suggestedTechStack, shortSummary }`. Parses & returns structured object.
- `src/server/projectRequests.ts` — `submitProjectRequest` server fn; stores in memory (module-level array) and logs. Returns success.

### AI integration
- Use Lovable AI Gateway (no key needed — uses `LOVABLE_API_KEY` env). Endpoint: `https://ai.gateway.lovable.dev/v1/chat/completions`. System prompt enforces JSON response schema. Fallback to keyword-based mock if API fails.

### Tech / language
- Site copy in English; brand stays "HN-groupe"
- Stack: TanStack Start + React 19 + Tailwind v4 + TypeScript (project's existing stack — equivalent capability to the requested Next.js)
- No new heavy deps needed; lucide-react already available for icons

### File structure
```text
src/
  routes/  __root.tsx, index.tsx, services.tsx, portfolio.tsx, start-project.tsx
  components/
    layout/   Header.tsx, Footer.tsx
    home/     HeroSection.tsx, AboutSection.tsx, HowItWorks.tsx
    services/ ServicesSection.tsx
    portfolio/PortfolioGrid.tsx
    forms/    StartProjectForm.tsx
    chat/     ChatWidget.tsx
  data/      projects.ts, services.ts
  server/    chat.ts, projectRequests.ts
  styles.css (updated tokens)
```

### Notes for user
- Project framework is TanStack Start, not Next.js — same capabilities (SSR, file routing, server functions). Delivering the requested feature set on it.
- The AI chat will be REAL (Lovable AI Gateway, free tier) instead of mocked, with a keyword fallback.
- Project requests stored in-memory for now — ready to upgrade to Lovable Cloud DB later.
