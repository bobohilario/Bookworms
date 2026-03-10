"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MEDIUMS = ["Paper", "Audio", "eBook", "It's a secret", "Other"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function SubmitForm({ challengeId, backHref, knownReaders }: { challengeId: string; backHref: string; knownReaders?: string[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

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
      challenge_id: data.challenge_id,
    };

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push(backHref);
    } else {
      const body = await res.json();
      setError(body.error ?? "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="challenge_id" value={challengeId} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reader *</label>
          <input
            name="reader"
            type="text"
            required
            placeholder="Your name"
            list="readers-list"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {knownReaders && knownReaders.length > 0 && (
            <datalist id="readers-list">
              {knownReaders.map((r) => <option key={r} value={r} />)}
            </datalist>
          )}
        </div>
        <Field label="Title *" name="title" required placeholder="Book title" />
        <Field label="Author *" name="author" required placeholder="Author name" />
        <Field
          label="Finished On *"
          name="finished_on"
          type="date"
          required
          defaultValue={today()}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <select name="stars" className={selectClass}>
            <option value="">No rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)}</option>
            ))}
          </select>
        </div>

        <Field label="Page Count" name="pages" type="number" placeholder="e.g. 320" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medium *</label>
          <select name="medium" required className={selectClass}>
            <option value="">Select…</option>
            {MEDIUMS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <Field label="Genre" name="genre" placeholder="e.g. Fiction, Mystery…" />
        <Field label="Suggested by" name="suggestor" placeholder="Who recommended it?" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment / Review
          </label>
          <textarea
            name="comment"
            rows={3}
            placeholder="Optional review or thoughts…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Book"}
        </button>
      </form>
    </>
  );
}

const selectClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
}
