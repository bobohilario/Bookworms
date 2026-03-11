# Bookworms — Notes & TODOs

A place to leave notes, ideas, and tasks for future sessions.

## TODO

- [ ] make a worm favicon

### Vercel + Turso migration (branch: `vercel-turso`)

Goal: move off Railway (paid after 30 days) to Vercel (free) + Turso (free SQLite-compatible hosted DB).

Steps:
- [ ] Install `@libsql/client`, remove `better-sqlite3`
- [ ] Rewrite `lib/db.ts` — replace synchronous `better-sqlite3` calls with async `@libsql/client`
- [ ] Update all callers of db functions to `await` (Server Components, API routes, `lib/legacy.ts`)
- [ ] Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to `.env.local` (get from Turso dashboard)
- [ ] Create the Turso database and run the schema migration
- [ ] Import existing data from Railway SQLite into Turso
- [ ] Remove Dockerfile, railway.json (not needed for Vercel)
- [ ] Add `vercel.json` if needed (root directory override for `bookworms-app/`)
- [ ] Deploy to Vercel and verify

## Notes

- Style themes to consider including:
    - book worms
    - book shelves
    - classic Pizza Hut (building roof, red cups, etc)
    - "Book It" reading challenge

