"use client";

import { useState, useMemo } from "react";
import type { Book } from "@/lib/types";
import { goodreadsUrl } from "@/lib/config";

type SortKey = keyof Book;
type SortDir = "asc" | "desc";

function StarDisplay({ stars }: { stars: number | null }) {
  if (!stars) return <span className="text-gray-400">—</span>;
  return <span className="text-amber-500">{"★".repeat(stars)}</span>;
}

export default function BookTable({ books }: { books: Book[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("finished_on");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterReader, setFilterReader] = useState("");

  const readers = useMemo(
    () => Array.from(new Set(books.map((b) => b.reader))).sort(),
    [books]
  );

  const sorted = useMemo(() => {
    const filtered = filterReader ? books.filter((b) => b.reader === filterReader) : books;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [books, sortKey, sortDir, filterReader]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortHeader({ label, col }: { label: string; col: SortKey }) {
    const active = sortKey === col;
    return (
      <th
        className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 select-none whitespace-nowrap"
        onClick={() => handleSort(col)}
      >
        {label} {active ? (sortDir === "asc" ? "↑" : "↓") : ""}
      </th>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Filter by reader:</label>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={filterReader}
          onChange={(e) => setFilterReader(e.target.value)}
        >
          <option value="">All readers</option>
          {readers.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400">{sorted.length} book{sorted.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <SortHeader label="#" col="id" />
              <SortHeader label="Reader" col="reader" />
              <SortHeader label="Title" col="title" />
              <SortHeader label="Author" col="author" />
              <SortHeader label="★" col="stars" />
              <SortHeader label="Date" col="finished_on" />
              <SortHeader label="Pages" col="pages" />
              <SortHeader label="Medium" col="medium" />
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested by</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sorted.map((book, i) => (
              <tr key={book.id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                <td className="px-3 py-2 text-gray-400 font-mono">
                  <a href={`/books/${book.id}`} className="hover:text-indigo-600">{book.id}</a>
                </td>
                <td className="px-3 py-2 font-medium text-gray-900">{book.reader}</td>
                <td className="px-3 py-2">
                  <a href={goodreadsUrl(book.title)} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                    {book.title}
                  </a>
                </td>
                <td className="px-3 py-2 text-gray-600 italic">
                  <a href={goodreadsUrl(book.author)} target="_blank" rel="noreferrer" className="hover:underline">
                    {book.author}
                  </a>
                </td>
                <td className="px-3 py-2"><StarDisplay stars={book.stars} /></td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{book.finished_on}</td>
                <td className="px-3 py-2 text-gray-500">{book.pages ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500">{book.medium}</td>
                <td className="px-3 py-2 text-gray-500">{book.suggestor ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500 max-w-xs truncate" title={book.comment ?? ""}>{book.comment ?? "—"}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-gray-400">No books yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
