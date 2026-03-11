# Bookworms — Notes & TODOs

A place to leave notes, ideas, and tasks for future sessions.

## TODO

- [ ] make a worm favicon

### Vercel + Turso migration (branch: `vercel-turso`)

Goal: move off Railway (paid after 30 days) to Vercel (free) + Turso (free SQLite-compatible hosted DB).

Steps:
- [x] Install `@libsql/client`, remove `better-sqlite3`
- [x] Rewrite `lib/db.ts` — replace synchronous `better-sqlite3` calls with async `@libsql/client`
- [x] Update all callers of db functions to `await` (Server Components, API routes, `lib/legacy.ts`)
- [x] Remove Dockerfile, railway.json (not needed for Vercel)
- [x] Add `vercel.json` (just `{"framework":"nextjs"}` — Root Directory set to `bookworms-app` in Vercel dashboard)

**Manual steps (you do these):**
- [ ] `turso db create bookworms` then `turso db show bookworms` to get the URL
- [ ] `turso db tokens create bookworms` to get the auth token
- [ ] Add to `bookworms-app/.env.local`: `TURSO_DATABASE_URL=...` and `TURSO_AUTH_TOKEN=...`
- [ ] Run schema: `turso db shell bookworms` then paste the CREATE TABLE from CLAUDE.md
- [ ] Export data from Railway: SSH in or use Railway CLI to `sqlite3 /data/bookworms.db .dump`
- [ ] Import into Turso: `turso db shell bookworms < dump.sql`
- [ ] Connect repo to Vercel, set Root Directory = `bookworms-app`, add env vars, deploy

## Notes

- Style themes to consider including:
    - book worms
    - book shelves
    - classic Pizza Hut (building roof, red cups, etc)
    - "Book It" reading challenge

