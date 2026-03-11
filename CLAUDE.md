# Bookworms Reading Tracker — CLAUDE.md

## Project Overview

A web-based summer reading challenge tracker for a friend group ("Shawties Bookworms"). Replaces a Wolfram Language / Wolfram Cloud implementation with a self-contained Next.js app.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Turso (hosted libSQL / SQLite-compatible) via `@libsql/client`
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Language**: TypeScript
- **Hosting**: Vercel (serverless) + Turso (database)

## Key Architectural Decisions

- **No authentication**: The book submission form is public (anyone with the link can submit). No user accounts.
- **Turso (libSQL)**: Replaces local `better-sqlite3`. Schema is identical SQLite; queries use `@libsql/client` which is async. All db helper functions are `async`/`await`. Credentials via `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` env vars.
- **Server Components + API Routes**: Use Next.js Server Components for read-heavy pages (dashboard, book list). Use API Routes (`/api/books`) for form submission and data mutations.
- **No ORM**: Use `@libsql/client` directly with typed query helpers. Keep it simple.

## Project Structure

```
bookworms/
├── bookworms-app/             # Next.js app (Vercel root directory)
│   ├── app/
│   │   ├── page.tsx               # Home → current challenge dashboard
│   │   ├── submit/page.tsx        # Book submission form
│   │   ├── challenge/[id]/        # Per-challenge dashboard
│   │   ├── past/[year]/           # Past-year read-only view
│   │   └── api/books/route.ts     # POST: submit a book
│   ├── lib/
│   │   ├── db.ts                  # Turso client + async query helpers
│   │   ├── config.ts              # Challenge config (dates, milestones)
│   │   ├── legacy.ts              # Data access layer (wraps db + past-year JSON)
│   │   ├── types.ts               # Shared TypeScript types
│   │   └── past-years/            # JSON files for 2023, 2024, 2025
│   ├── components/
│   │   ├── ChallengeDashboard.tsx # Main dashboard (used by home + /challenge/[id])
│   │   ├── ProgressSection.tsx    # Milestone progress bar + book grid
│   │   ├── ReadingTimeline.tsx    # Recharts step chart
│   │   ├── BookTable.tsx          # Sortable/filterable book list
│   │   ├── WormMascot.tsx         # Base worm SVG
│   │   ├── WormMuscle.tsx         # Flexing worm (Double Bonus)
│   │   └── WormHunked.tsx         # Jacked worm with legs (Triple Bonus)
│   ├── public/
│   │   ├── pizza.png              # Pizza milestone reward image
│   │   └── icecream.png           # Ice cream milestone reward image
│   └── .env.local                 # TURSO_DATABASE_URL, TURSO_AUTH_TOKEN (gitignored)
├── CLAUDE.md
├── DESIGN.md
├── NOTES.md
└── Images/                        # Original WL project images (reference)
```

## Challenge Configuration (`lib/config.ts`)

All challenge-specific values live here so they are easy to update each year:

```ts
export const CHALLENGE = {
  year: 2026,
  name: "Shawties Bookworms Reading Challenge",
  startDate: new Date("2026-05-25"),
  endDate:   new Date("2026-09-07"),
  milestones: [
    { label: "Pizza",        emoji: "🍕", target: 100 },
    { label: "Ice Cream",    emoji: "🍦", target: 150 },
    { label: "Double Bonus", emoji: "❓",  target: 200 },
    { label: "Triple Bonus", emoji: "❗",  target: 300 },
  ],
};
```

## Database Schema

```sql
CREATE TABLE books (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  reader     TEXT NOT NULL,
  title      TEXT NOT NULL,
  author     TEXT NOT NULL,
  finished_on TEXT NOT NULL,   -- ISO date string "YYYY-MM-DD"
  stars      INTEGER,          -- 1–5, nullable
  pages      INTEGER,          -- nullable
  medium     TEXT NOT NULL,    -- "Paper"|"Audio"|"eBook"|"It's a secret"|"Other"
  genre      TEXT,
  suggestor  TEXT,
  comment    TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Conventions

- Use `lib/db.ts` for all database access — never query Turso directly in components.
- All db functions are `async` — always `await` them.
- All dates stored as ISO strings; parse to `Date` objects only at the UI layer.
- Goodreads search links: `https://www.goodreads.com/search?q=<encoded>&search_type=books`
- Keep pages lean. The dashboard is the primary view — optimize it first.
- Do not add authentication, user sessions, or role-based access. The app is intentionally open.
- Do not use an ORM. Raw `@libsql/client` queries with TypeScript types are sufficient.

## Running Locally

```bash
npm install
# Create bookworms-app/.env.local with:
# TURSO_DATABASE_URL=libsql://your-db.turso.io
# TURSO_AUTH_TOKEN=your-token
npm run dev        # starts dev server at localhost:3000
```

## Deployment Notes

- **Vercel**: Deploy from the `bookworms-app/` subdirectory. Set Root Directory to `bookworms-app` in Vercel project settings. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as environment variables.
- **Turso**: Free tier supports the app's usage. Create a database, run the schema, and optionally import existing data from Railway's SQLite file using `turso db shell`.
- No persistent volume needed — data lives in Turso.
