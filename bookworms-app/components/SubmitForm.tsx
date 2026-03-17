"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import WormCelebration from "@/components/WormCelebration";
import { WORM_PHRASES } from "@/config/worm-phrases";

const DNF_PHRASES = [
  "Yikes.",
  "…Did it at least have a nice cover?",
  "Not every book deserves to be finished.",
  "Life is short. No regrets.",
  "A bold choice.",
  "The book is judging you back.",
  "This will not go on your permanent record. Probably.",
];

const MEDIUMS = ["Paper", "Audio", "eBook", "It's a secret", "Other"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function SubmitForm({ challengeId, backHref, knownReaders }: { challengeId: string; backHref: string; knownReaders?: string[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState<string | null>(null);
  const [isDnf, setIsDnf] = useState(false);
  const [dnfPhrase] = useState(() => DNF_PHRASES[Math.floor(Math.random() * DNF_PHRASES.length)]);

  const handleCelebrationDone = useCallback(() => {
    router.push(backHref);
  }, [router, backHref]);

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
      dnf: isDnf,
    };

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (isDnf) {
          router.push(backHref);
        } else {
          const phrase = WORM_PHRASES[Math.floor(Math.random() * WORM_PHRASES.length)];
          setCelebrationPhrase(phrase);
        }
      } else {
        let message = "Something went wrong";
        try { message = (await res.json()).error ?? message; } catch { /* non-JSON error body */ }
        setError(message);
        setSubmitting(false);
      }
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      {celebrationPhrase && (
        <WormCelebration phrase={celebrationPhrase} onDone={handleCelebrationDone} />
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="challenge_id" value={challengeId} />

        {/* DNF checkbox */}
        <div
          className={`rounded-xl border-2 px-4 py-3 transition-colors ${
            isDnf ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
          }`}
        >
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDnf}
              onChange={(e) => setIsDnf(e.target.checked)}
              className="w-5 h-5 accent-red-500 cursor-pointer"
            />
            <span className={`font-semibold text-sm ${isDnf ? "text-red-700" : "text-gray-700"}`}>
              Did Not Finish (DNF)
            </span>
          </label>
          {isDnf && (
            <div className="mt-3 flex items-start gap-3">
              <span className="text-3xl leading-none" role="img" aria-label="disappointed">😤</span>
              <div>
                <p className="text-red-700 font-semibold text-sm">This book will NOT count toward the prize.</p>
                <p className="text-red-500 text-xs mt-0.5 italic">{dnfPhrase}</p>
              </div>
            </div>
          )}
        </div>

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
          label={isDnf ? "Abandoned On *" : "Finished On *"}
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
          className={`w-full py-2.5 disabled:opacity-50 text-white rounded-lg font-medium transition-colors ${
            isDnf
              ? "bg-red-500 hover:bg-red-600"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? "Submitting…" : isDnf ? "Log DNF" : "Submit Book"}
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
