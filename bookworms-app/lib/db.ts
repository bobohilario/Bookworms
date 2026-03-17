import { createClient, type Client } from "@libsql/client";
import type { Book, BookInsert } from "./types";

let _client: Client | null = null;

function getClient(): Client {
  if (!_client) {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) throw new Error("TURSO_DATABASE_URL is not set");
    _client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  return _client;
}

function row(r: unknown): Book {
  return r as Book;
}

export async function getAllBooks(challengeId?: string): Promise<Book[]> {
  const db = getClient();
  if (challengeId) {
    const rs = await db.execute({
      sql: "SELECT * FROM books WHERE challenge_id = ? ORDER BY finished_on ASC, id ASC",
      args: [challengeId],
    });
    return rs.rows.map(row);
  }
  const rs = await db.execute("SELECT * FROM books ORDER BY finished_on ASC, id ASC");
  return rs.rows.map(row);
}

export async function getBookById(id: number): Promise<Book | undefined> {
  const db = getClient();
  const rs = await db.execute({ sql: "SELECT * FROM books WHERE id = ?", args: [id] });
  return rs.rows[0] ? row(rs.rows[0]) : undefined;
}

export async function insertBook(book: BookInsert): Promise<Book> {
  const db = getClient();
  const rs = await db.execute({
    sql: `INSERT INTO books (reader, title, author, finished_on, stars, pages, medium, genre, suggestor, comment, challenge_id, dnf)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      book.reader, book.title, book.author, book.finished_on,
      book.stars ?? null, book.pages ?? null, book.medium,
      book.genre ?? null, book.suggestor ?? null, book.comment ?? null,
      book.challenge_id, book.dnf ?? 0,
    ],
  });
  return (await getBookById(Number(rs.lastInsertRowid)))!;
}

export async function deleteBook(id: number): Promise<boolean> {
  const db = getClient();
  const rs = await db.execute({ sql: "DELETE FROM books WHERE id = ?", args: [id] });
  return rs.rowsAffected > 0;
}

export async function updateBook(id: number, fields: Partial<BookInsert>): Promise<Book | undefined> {
  const keys = Object.keys(fields) as (keyof BookInsert)[];
  if (keys.length === 0) return getBookById(id);
  const db = getClient();
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const args = [...keys.map((k) => (fields[k] ?? null) as string | number | null), id];
  await db.execute({ sql: `UPDATE books SET ${sets} WHERE id = ?`, args });
  return getBookById(id);
}

export async function getBookCount(): Promise<number> {
  const db = getClient();
  const rs = await db.execute("SELECT COUNT(*) as count FROM books");
  return Number((rs.rows[0] as unknown as { count: number }).count);
}

/** Run once to create the schema in a fresh Turso database. */
export async function initDb(): Promise<void> {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS books (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      reader       TEXT    NOT NULL,
      title        TEXT    NOT NULL,
      author       TEXT    NOT NULL,
      finished_on  TEXT    NOT NULL,
      stars        INTEGER,
      pages        INTEGER,
      medium       TEXT    NOT NULL,
      genre        TEXT,
      suggestor    TEXT,
      comment      TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      challenge_id TEXT    NOT NULL DEFAULT '2026',
      dnf          INTEGER NOT NULL DEFAULT 0
    )
  `);
}
