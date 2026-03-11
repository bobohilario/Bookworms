import { notFound } from "next/navigation";
import { getChallengeData } from "@/lib/legacy";
import { getChallengeConfig, goodreadsUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      <dt className="w-28 text-sm font-medium text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export default async function ChallengeBookPage({
  params,
}: {
  params: Promise<{ id: string; num: string }>;
}) {
  const { id, num } = await params;
  const bookNum = parseInt(num, 10);
  if (isNaN(bookNum) || bookNum < 1) notFound();

  let config;
  try {
    config = getChallengeConfig(id);
  } catch {
    notFound();
  }

  const { books } = await getChallengeData(id);
  const book = books[bookNum - 1];
  if (!book) notFound();

  const stars = book.stars ? "★".repeat(book.stars) : null;

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <p className="text-sm text-gray-400 mb-4">
        <a href={`/challenge/${id}`} className="text-indigo-600 hover:underline">
          ← {config.label}
        </a>
      </p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <p className="text-xs text-gray-400 font-mono mb-1">#{bookNum}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
          <a href={goodreadsUrl(book.title)} target="_blank" rel="noreferrer" className="hover:underline">
            {book.title}
          </a>
        </h1>
        {book.author && (
          <p className="text-base text-gray-500 italic mb-6">
            by{" "}
            <a href={goodreadsUrl(book.author)} target="_blank" rel="noreferrer" className="hover:underline">
              {book.author}
            </a>
          </p>
        )}

        <dl>
          <Row label="Read by" value={book.reader} />
          <Row
            label="Finished"
            value={new Date(book.finished_on).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <Row label="Rating" value={stars ? <span className="text-amber-500 text-lg">{stars}</span> : null} />
          <Row label="Pages" value={book.pages} />
          <Row label="Medium" value={book.medium} />
          <Row label="Genre" value={book.genre} />
          <Row label="Suggested by" value={book.suggestor} />
          <Row label="Comment" value={book.comment} />
        </dl>
      </div>
    </main>
  );
}
