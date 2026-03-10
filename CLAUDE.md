# Bookworms Reading Tracker — CLAUDE.md

## Project Overview

A web-based summer reading challenge tracker for a friend group ("Shawties Bookworms"). Replaces a Wolfram Language / Wolfram Cloud implementation with a self-contained Next.js app.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: SQLite via `better-sqlite3`
- **Styling**: Tailwind CSS
- **Charts**: Recharts (or similar React-compatible charting library)
- **Language**: TypeScript

## Key Architectural Decisions

- **No authentication**: The book submission form is public (anyone with the link can submit). No user accounts.
- **SQLite**: Single-file database stored at `data/bookworms.db`. Good for self-hosted or PaaS deploys. If moving to serverless, swap for a hosted DB (e.g. Turso, PlanetScale).
- **Server Components + API Routes**: Use Next.js Server Components for read-heavy pages (dashboard, book list). Use API Routes (`/api/books`) for form submission and data mutations.
- **No ORM**: Use `better-sqlite3` directly with typed query helpers. Keep it simple.

## Project Structure

```
bookworms/
├── app/
│   ├── page.tsx               # Dashboard / status page
│   ├── submit/page.tsx        # Book submission form
│   ├── books/page.tsx         # Full book list
│   ├── books/[id]/page.tsx    # Individual book entry
│   └── api/books/route.ts     # POST: submit a book
├── lib/
│   ├── db.ts                  # SQLite connection + query helpers
│   ├── config.ts              # Challenge config (dates, milestones)
│   └── types.ts               # Shared TypeScript types
├── components/
│   ├── ProgressSection.tsx    # Milestone progress bar + projected date
│   ├── ReadingTimeline.tsx    # Step chart of cumulative books over time
│   └── BookTable.tsx          # Sortable/filterable book list table
├── public/
│   └── images/                # pizza.png, icecream.png
├── data/                      # SQLite DB lives here (gitignored)
└── DESIGN.md
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

- Use `lib/db.ts` for all database access — never query SQLite directly in components.
- All dates stored as ISO strings; parse to `Date` objects only at the UI layer.
- Goodreads search links: `https://www.goodreads.com/search?q=<encoded>&search_type=books`
- Keep pages lean. The dashboard is the primary view — optimize it first.
- Do not add authentication, user sessions, or role-based access. The app is intentionally open.
- Do not use an ORM. Raw `better-sqlite3` queries with TypeScript types are sufficient.

## Running Locally

```bash
npm install
npm run dev        # starts dev server at localhost:3000
```

The SQLite database is auto-created on first run if `data/bookworms.db` does not exist.

## Deployment Notes

- Works on any Node.js host (Railway, Fly.io, Render, VPS).
- The `data/` directory must be on a persistent volume.
- For Vercel/Netlify (serverless), replace SQLite with Turso or a Postgres provider.
