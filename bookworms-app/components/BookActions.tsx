"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Book } from "@/lib/types";

const MEDIUMS = ["Paper", "Audio", "eBook", "It's a secret", "Other"];
const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

function Field({ label, name, type = "text", defaultValue, required }: {
  label: string; name: string; type?: string; defaultValue?: string | number | null; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className={inputClass} />
    </div>
  );
}

export default function BookActions({ book }: { book: Book }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/books/${book.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/books");
    } else {
      setError("Failed to delete.");
      setDeleting(false);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const payload = {
      reader: data.reader,
      title: data.title,
      author: data.author,
      finished_on: data.finished_on,
      stars: data.stars === "" ? null : Number(data.stars),
      pages: data.pages === "" ? null : Number(data.pages),
      medium: data.medium,
      genre: data.genre || null,
      suggestor: data.suggestor || null,
      comment: data.comment || null,
    };
    const res = await fetch(`/api/books/${book.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.refresh();
      setEditing(false);
    } else {
      const body = await res.json();
      setError(body.error ?? "Failed to save.");
    }
    setSaving(false);
  }

  if (!editing) {
    return (
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
        {error && <p className="text-sm text-red-600 self-center">{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="mt-6 space-y-4 border-t pt-6">
      <h2 className="text-base font-semibold text-gray-800">Edit Entry</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Field label="Reader *" name="reader" defaultValue={book.reader} required />
      <Field label="Title *" name="title" defaultValue={book.title} required />
      <Field label="Author *" name="author" defaultValue={book.author} required />
      <Field label="Finished On *" name="finished_on" type="date" defaultValue={book.finished_on} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <select name="stars" defaultValue={book.stars ?? ""} className={selectClass}>
          <option value="">No rating</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{"★".repeat(n)}</option>)}
        </select>
      </div>
      <Field label="Page Count" name="pages" type="number" defaultValue={book.pages} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medium *</label>
        <select name="medium" defaultValue={book.medium} required className={selectClass}>
          {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <Field label="Genre" name="genre" defaultValue={book.genre} />
      <Field label="Suggested by" name="suggestor" defaultValue={book.suggestor} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
        <textarea name="comment" rows={3} defaultValue={book.comment ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => { setEditing(false); setError(""); }} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
