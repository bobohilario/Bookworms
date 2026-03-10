import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { Book, BookInsert } from "./types";

// On Railway, mount a volume at /data and set DATA_DIR=/data
const DB_PATH = path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "data"), "bookworms.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure data/ directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  migrate(_db);
  return _db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      reader      TEXT    NOT NULL,
      title       TEXT    NOT NULL,
      author      TEXT    NOT NULL,
      finished_on TEXT    NOT NULL,
      stars       INTEGER,
      pages       INTEGER,
      medium      TEXT    NOT NULL,
      genre       TEXT,
      suggestor   TEXT,
      comment     TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  const cols = (db.pragma("table_info(books)") as { name: string }[]);
  if (!cols.some((c) => c.name === "challenge_id")) {
    db.exec(`ALTER TABLE books ADD COLUMN challenge_id TEXT NOT NULL DEFAULT '2026'`);
  }
}

export function getAllBooks(challengeId?: string): Book[] {
  if (challengeId) {
    return getDb()
      .prepare("SELECT * FROM books WHERE challenge_id = ? ORDER BY finished_on ASC, id ASC")
      .all(challengeId) as Book[];
  }
  return getDb()
    .prepare("SELECT * FROM books ORDER BY finished_on ASC, id ASC")
    .all() as Book[];
}

export function getBookById(id: number): Book | undefined {
  return getDb()
    .prepare("SELECT * FROM books WHERE id = ?")
    .get(id) as Book | undefined;
}

export function insertBook(book: BookInsert): Book {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO books (reader, title, author, finished_on, stars, pages, medium, genre, suggestor, comment, challenge_id)
    VALUES (@reader, @title, @author, @finished_on, @stars, @pages, @medium, @genre, @suggestor, @comment, @challenge_id)
  `);
  const result = stmt.run(book);
  return getBookById(result.lastInsertRowid as number)!;
}

export function deleteBook(id: number): boolean {
  const result = getDb().prepare("DELETE FROM books WHERE id = ?").run(id);
  return result.changes > 0;
}

export function updateBook(id: number, fields: Partial<BookInsert>): Book | undefined {
  const keys = Object.keys(fields) as (keyof BookInsert)[];
  if (keys.length === 0) return getBookById(id);
  const sets = keys.map((k) => `${k} = @${k}`).join(", ");
  getDb().prepare(`UPDATE books SET ${sets} WHERE id = @id`).run({ ...fields, id });
  return getBookById(id);
}

export function getBookCount(): number {
  const row = getDb().prepare("SELECT COUNT(*) as count FROM books").get() as { count: number };
  return row.count;
}
