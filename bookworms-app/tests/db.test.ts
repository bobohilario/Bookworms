import { describe, it, expect } from "vitest";
import Database from "better-sqlite3";

function makeDb() {
  const db = new Database(":memory:");
  db.exec(`CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reader TEXT NOT NULL, title TEXT NOT NULL, author TEXT NOT NULL,
    finished_on TEXT NOT NULL, stars INTEGER, pages INTEGER,
    medium TEXT NOT NULL, genre TEXT, suggestor TEXT, comment TEXT,
    challenge_id TEXT NOT NULL DEFAULT '2026',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  const ins = db.prepare(`INSERT INTO books (reader,title,author,finished_on,medium,challenge_id) VALUES (@reader,@title,@author,@finished_on,@medium,@challenge_id)`);
  return {
    insert(b: {reader:string,title:string,author:string,finished_on:string,medium:string,challenge_id:string}) {
      const r = ins.run(b); return db.prepare("SELECT * FROM books WHERE id=?").get(r.lastInsertRowid) as Record<string,unknown>;
    },
    getAll(challengeId?:string) {
      return challengeId
        ? db.prepare("SELECT * FROM books WHERE challenge_id=? ORDER BY finished_on ASC,id ASC").all(challengeId)
        : db.prepare("SELECT * FROM books ORDER BY finished_on ASC,id ASC").all();
    },
    delete(id:number) { return db.prepare("DELETE FROM books WHERE id=?").run(id).changes > 0; },
    update(id:number, fields:Record<string,unknown>) {
      const keys = Object.keys(fields);
      const sets = keys.map(k=>`${k}=@${k}`).join(",");
      db.prepare(`UPDATE books SET ${sets} WHERE id=@id`).run({...fields,id});
      return db.prepare("SELECT * FROM books WHERE id=?").get(id) as Record<string,unknown>;
    },
  };
}

describe("challenge_id isolation", () => {
  it("no filter returns all books", () => {
    const db = makeDb();
    db.insert({ reader: "Alice", title: "Book A", author: "Author A", finished_on: "2026-06-01", medium: "Paper", challenge_id: "2026" });
    db.insert({ reader: "Bob", title: "Book B", author: "Author B", finished_on: "2026-06-02", medium: "Audio", challenge_id: "playground" });
    const all = db.getAll();
    expect(all).toHaveLength(2);
  });

  it("filter by 'playground' returns only playground books", () => {
    const db = makeDb();
    db.insert({ reader: "Alice", title: "Book A", author: "Author A", finished_on: "2026-06-01", medium: "Paper", challenge_id: "2026" });
    db.insert({ reader: "Bob", title: "Book B", author: "Author B", finished_on: "2026-06-02", medium: "Audio", challenge_id: "playground" });
    db.insert({ reader: "Carol", title: "Book C", author: "Author C", finished_on: "2026-06-03", medium: "eBook", challenge_id: "playground" });
    const playgroundBooks = db.getAll("playground");
    expect(playgroundBooks).toHaveLength(2);
    expect((playgroundBooks as Record<string,unknown>[]).every(b => b.challenge_id === "playground")).toBe(true);
  });

  it("filter by '2026' returns only 2026 books", () => {
    const db = makeDb();
    db.insert({ reader: "Alice", title: "Book A", author: "Author A", finished_on: "2026-06-01", medium: "Paper", challenge_id: "2026" });
    db.insert({ reader: "Bob", title: "Book B", author: "Author B", finished_on: "2026-06-02", medium: "Audio", challenge_id: "playground" });
    db.insert({ reader: "Carol", title: "Book C", author: "Author C", finished_on: "2026-06-03", medium: "eBook", challenge_id: "2026" });
    const books2026 = db.getAll("2026");
    expect(books2026).toHaveLength(2);
    expect((books2026 as Record<string,unknown>[]).every(b => b.challenge_id === "2026")).toBe(true);
  });
});

describe("deleteBook", () => {
  it("deletes the book and returns true", () => {
    const db = makeDb();
    const book = db.insert({ reader: "Alice", title: "Book A", author: "Author A", finished_on: "2026-06-01", medium: "Paper", challenge_id: "2026" });
    const result = db.delete(book.id as number);
    expect(result).toBe(true);
    const all = db.getAll();
    expect(all).toHaveLength(0);
  });

  it("returns false for non-existent id", () => {
    const db = makeDb();
    const result = db.delete(9999);
    expect(result).toBe(false);
  });
});

describe("updateBook", () => {
  it("updates specified fields and leaves others unchanged", () => {
    const db = makeDb();
    const book = db.insert({ reader: "Alice", title: "Original Title", author: "Author A", finished_on: "2026-06-01", medium: "Paper", challenge_id: "2026" });
    const updated = db.update(book.id as number, { title: "Updated Title", stars: 5 });
    expect(updated.title).toBe("Updated Title");
    expect(updated.stars).toBe(5);
    // Unchanged fields stay the same
    expect(updated.reader).toBe("Alice");
    expect(updated.author).toBe("Author A");
    expect(updated.finished_on).toBe("2026-06-01");
    expect(updated.medium).toBe("Paper");
    expect(updated.challenge_id).toBe("2026");
  });
});
