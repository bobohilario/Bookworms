import { notFound } from "next/navigation";
import { getAllChallengeIds, goodreadsUrl } from "@/lib/config";
import { getChallengeData, type LegacyBook } from "@/lib/legacy";

interface TitleEntry {
  book: LegacyBook;
  challengeId: string;
  challengeLabel: string;
}

function StarDisplay({ stars }: { stars: number | null }) {
  if (!stars) return <span className="text-gray-400">—</span>;
  return <span className="text-amber-500">{"★".repeat(stars)}</span>;
}

export default async function TitlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = decodeURIComponent(slug);

  const entries: TitleEntry[] = [];

  await Promise.all(
    getAllChallengeIds().map(async (id) => {
      try {
        const { config, books } = await getChallengeData(id);
        for (const book of books) {
          if (book.title.toLowerCase() === title.toLowerCase()) {
            entries.push({ book, challengeId: id, challengeLabel: config.label });
          }
        }
      } catch {
        // skip unknown challenge
      }
    })
  );

  if (entries.length === 0) notFound();

  // Sort newest challenge first, then by date within each challenge
  entries.sort((a, b) => {
    const cmp = b.challengeId.localeCompare(a.challengeId, undefined, { numeric: true });
    return cmp !== 0 ? cmp : a.book.finished_on.localeCompare(b.book.finished_on);
  });

  const displayTitle = entries[0].book.title;
  const displayAuthor = entries[0].book.author;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <p className="text-sm text-gray-500 mb-6">
        <a href="/" className="text-indigo-600 hover:underline">← Home</a>
      </p>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayTitle}</h1>
      {displayAuthor && (
        <p className="text-gray-500 italic mb-3">{displayAuthor}</p>
      )}
      <p className="text-gray-500 text-sm mb-5">
        Read by {entries.length} {entries.length === 1 ? "person" : "people"}
      </p>

      <a
        href={goodreadsUrl(displayTitle)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
      >
        Search on Goodreads ↗
      </a>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reader</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Challenge</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">★</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medium</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {entries.map(({ book, challengeId, challengeLabel }, i) => {
              const isDnf = book.dnf === 1;
              return (
                <tr key={i} className={isDnf ? "bg-red-50" : i % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="px-3 py-2 font-medium">
                    {isDnf && (
                      <span className="inline-block mr-1.5 text-xs font-bold text-red-500 bg-red-100 border border-red-200 rounded px-1 py-0.5 align-middle">DNF</span>
                    )}
                    <a
                      href={`/challenge/${challengeId}/reader/${encodeURIComponent(book.reader.trim())}`}
                      className={isDnf ? "text-red-600 hover:underline" : "text-indigo-700 hover:underline"}
                    >
                      {book.reader}
                    </a>
                  </td>
                  <td className="px-3 py-2">
                    <a href={`/challenge/${challengeId}`} className="text-indigo-600 hover:underline">
                      {challengeLabel}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{book.finished_on}</td>
                  <td className="px-3 py-2"><StarDisplay stars={book.stars} /></td>
                  <td className="px-3 py-2 text-gray-500">{book.medium ?? "—"}</td>
                  <td className="px-3 py-2 text-gray-500 max-w-xs truncate" title={book.comment ?? ""}>{book.comment ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
