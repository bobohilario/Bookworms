# Bookworms Reading Tracker — Design Document

## 1. Purpose

Replace the Wolfram Language / Wolfram Cloud implementation of the "Shawties Bookworms" summer reading challenge tracker with a self-hosted web app. The new app must be easy to run each year, require no Wolfram subscription, and be accessible to anyone with a browser.

---

## 2. Challenge Rules (2026)

| Field        | Value                    |
|--------------|--------------------------|
| Start date   | May 25, 2026             |
| End date     | September 7, 2026        |
| Group name   | Shawties Bookworms       |

### Milestones

| Milestone     | Reward         | Book target |
|---------------|----------------|-------------|
| Challenge      | 🍕 Pizza        | 100 books   |
| Bonus          | 🍦 Ice Cream    | 150 books   |
| Double Bonus   | ❓              | 200 books   |
| Triple Bonus   | ❗              | 300 books   |

Progress toward each milestone is shown as a progress bar with a projected completion date (based on current reading rate).

---

## 3. Data Model

Each book entry has the following fields:

| Field         | Type    | Required | Notes                                            |
|---------------|---------|----------|--------------------------------------------------|
| `id`          | integer | auto     | Primary key                                      |
| `reader`      | string  | yes      | Name of the person who read the book             |
| `title`       | string  | yes      | Book title; links to Goodreads search            |
| `author`      | string  | yes      | Author name; links to Goodreads search           |
| `finished_on` | date    | yes      | Date the book was finished (ISO string)          |
| `stars`       | integer | no       | Rating 1–5 (null = no rating)                   |
| `pages`       | integer | no       | Page count                                       |
| `medium`      | enum    | yes      | Paper / Audio / eBook / It's a secret / Other   |
| `genre`       | string  | no       | Free text genre                                  |
| `suggestor`   | string  | no       | Who recommended the book                        |
| `comment`     | string  | no       | Short review / comment (textarea)               |
| `created_at`  | datetime| auto     | Server timestamp when record was inserted        |

---

## 4. Pages & Routes

### 4.1 Dashboard (`/`)

The main status page. Visible to everyone.

**Sections (top to bottom):**

1. **Header** — Challenge name, year, and dates.
2. **Stats bar** — Total books read + books-per-day rate (computed from start date to now).
3. **Timeline chart** — Step chart showing cumulative books read over time, with horizontal reference lines at each milestone target. X-axis spans start→end date. Hovering a step shows the book title.
4. **Milestone cards** (one per milestone) — Each card shows:
   - Milestone name + reward emoji
   - Progress bar (current count / target)
   - "Complete ✓" badge when reached
   - Projected completion date (linear extrapolation from current rate), shown only when not yet complete
   - A compact book grid showing the books in that milestone tier (e.g. books 1–100 for Pizza, 101–150 for Ice Cream, etc.)
5. **Footer links** — Links to past challenge years.

### 4.2 Submit a Book (`/submit`)

A public form. No login required.

**Fields (matching original Wolfram form):**

- Reader (text, required)
- Title (text, required)
- Author (text, required)
- Finished On (date picker, required, default = today)
- Rating (select: None / 1★ / 2★ / 3★ / 4★ / 5★)
- Page Count (number, optional)
- Medium (select: Paper / Audio / eBook / It's a secret / Other)
- Genre (text, optional)
- Suggested by (text, optional)
- Comment / Review (textarea, optional)

On submit: POST to `/api/books` → redirect to dashboard on success.

**Validation:**
- Client-side: required fields, date must be within challenge window or at most 7 days before start.
- Server-side: same checks before DB insert.

### 4.3 Full Book List (`/books`)

A sortable, filterable table of all submitted books. Columns:

`#` | Reader | Title | Author | ★ | Date | Pages | Medium | Suggestor | Comment

- Title and Author link to Goodreads search.
- Sortable by any column (client-side).
- Filter by reader name (dropdown of unique readers).

### 4.4 Individual Entry (`/books/[id]`)

A single-book detail view. Shows all fields for one entry. Useful for sharing a specific entry.

### 4.5 API Routes

| Method | Route        | Description               |
|--------|--------------|---------------------------|
| GET    | `/api/books` | Return all books as JSON  |
| POST   | `/api/books` | Insert a new book entry   |

---

## 5. Key UI Behaviors

### Reading Rate & Projected Date

```
rate = total_books / days_since_start
projected_days_to_target = (target - total_books) / rate
projected_date = today + projected_days_to_target
```

Shown per-milestone. If a milestone is already complete, show the date it was reached instead.

### Timeline Chart

- X-axis: `startDate` → `endDate`
- Y-axis: 0 → max(current_count × 1.5, 300)
- Series: cumulative book count as a step function (one step per book, sorted by `finished_on`)
- Reference lines: horizontal dashed lines at 100, 150, 200, 300 labeled with milestone names
- Tooltip on hover: book title

### Goodreads Links

Title and author text throughout the app link to:
```
https://www.goodreads.com/search?q=<url-encoded-query>&search_type=books
```

---

## 6. Tech Stack

| Concern         | Choice                        |
|-----------------|-------------------------------|
| Framework       | Next.js 15 (App Router)       |
| Language        | TypeScript                    |
| Database        | SQLite via `better-sqlite3`   |
| Styling         | Tailwind CSS                  |
| Charts          | Recharts                      |
| Hosting target  | Node.js PaaS or VPS (TBD)     |

---

## 7. Project Structure

```
bookworms/
├── app/
│   ├── page.tsx                  # Dashboard
│   ├── submit/
│   │   └── page.tsx              # Submission form
│   ├── books/
│   │   ├── page.tsx              # Full book list
│   │   └── [id]/page.tsx         # Single entry
│   └── api/
│       └── books/route.ts        # REST API
├── components/
│   ├── ReadingTimeline.tsx       # Recharts step chart
│   ├── ProgressSection.tsx       # Milestone card with progress bar
│   └── BookTable.tsx             # Sortable/filterable table
├── lib/
│   ├── db.ts                     # SQLite singleton + query helpers
│   ├── config.ts                 # Challenge dates & milestones
│   └── types.ts                  # Shared TypeScript types
├── public/
│   └── images/
│       ├── pizza.png
│       └── icecream.png
├── data/                         # SQLite DB (gitignored, needs persistent volume)
│   └── bookworms.db
├── CLAUDE.md
├── DESIGN.md
└── package.json
```

---

## 8. Open Questions / Future Work

- **Past years**: How should historical data from 2023 and 2024 be stored/displayed? Options: migrate into the same DB with a `year` column, or keep separate DB files per year.
- **Admin tools**: Should there be a way to delete or edit an entry (e.g. a password-protected admin page)?
- **Notifications**: Should the app post to a group chat (e.g. iMessage, Discord) when a milestone is hit?
- **Persistent volume**: Pin down the hosting choice to confirm SQLite is viable (needs a non-ephemeral filesystem).
