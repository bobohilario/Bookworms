import type { Milestone } from "@/lib/types";
import { goodreadsUrl, projectDate } from "@/lib/config";

// Works with both SQLite Book (id always present) and JSON-backed LegacyBook (id optional)
interface BookLike {
  id?: number;
  reader: string;
  title: string;
  author: string | null;
  stars: number | null;
  finished_on: string;
}

interface Props {
  milestone: Milestone;
  books: BookLike[]; // all books in this tier (e.g. books 1–100 for Pizza)
  currentTotal: number; // total books read across all tiers
  startDate: Date;
  bookOffset: number; // 0-based index of the first book in this tier (e.g. 0, 100, 150, 200)
  rewardImage?: string; // optional public image path
  rewardIcon?: React.ReactNode; // optional React component (takes precedence over rewardImage)
  challengeId?: string;
  challengeEnded?: boolean; // if true, suppress projection for incomplete milestones
}

function StarDisplay({ stars }: { stars: number | null }) {
  if (!stars) return null;
  return <span className="text-amber-400 text-xs">{"★".repeat(stars)}</span>;
}

export default function ProgressSection({ milestone, books, currentTotal, startDate, bookOffset, rewardImage, rewardIcon, challengeId, challengeEnded }: Props) {
  const isComplete = currentTotal >= milestone.target;
  const progress = Math.min(currentTotal, milestone.target);
  const pct = Math.min((progress / milestone.target) * 100, 100);

  const projected = !isComplete
    ? projectDate(milestone.target, currentTotal, startDate)
    : null;

  const completedDate = isComplete
    ? books[books.length - 1]?.finished_on ?? null
    : null;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {rewardIcon ? (
          <span className="w-10 h-10 flex items-center justify-center">{rewardIcon}</span>
        ) : rewardImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={rewardImage} alt={milestone.label} className="w-10 h-10 object-contain" />
        ) : (
          <span className="text-3xl">{milestone.emoji}</span>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {milestone.label} Challenge
            {isComplete && (
              <span className="ml-2 text-green-600 text-sm font-medium">✓ Complete!</span>
            )}
          </h3>
          <p className="text-sm text-gray-500">Goal: {milestone.target} books</p>
        </div>
        <span className="text-2xl font-bold text-gray-800 tabular-nums">
          {Math.min(currentTotal, milestone.target)}/{milestone.target}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full transition-all ${isComplete ? "bg-green-500" : "bg-indigo-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Projection / completion date */}
      <p className="text-xs text-gray-400 mb-5">
        {isComplete && completedDate
          ? `Completed on ${new Date(completedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
          : challengeEnded
          ? "Challenge ended"
          : projected
          ? `Projected: ${projected.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
          : "Add some books to see projection"}
      </p>

      {/* Book grid for this tier */}
      {books.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs divide-y divide-gray-100">
            <thead>
              <tr className="text-gray-400 uppercase tracking-wider">
                <th className="pb-1 pr-2 text-left font-medium">#</th>
                <th className="pb-1 pr-2 text-left font-medium">Reader</th>
                <th className="pb-1 pr-2 text-left font-medium">Title</th>
                <th className="pb-1 pr-2 text-left font-medium">Author</th>
                <th className="pb-1 text-left font-medium">★</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {books.map((book, i) => {
                const bookNum = bookOffset + i + 1;
                return (
                <tr key={book.id ?? i}>
                  <td className="py-1 pr-2">
                    {book.id !== undefined ? (
                      <a href={`/books/${book.id}`} className="inline-block px-1.5 py-0.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded font-mono text-xs transition-colors">
                        #{bookNum}
                      </a>
                    ) : challengeId ? (
                      <a href={`/challenge/${challengeId}/book/${bookNum}`} className="inline-block px-1.5 py-0.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded font-mono text-xs transition-colors">
                        #{bookNum}
                      </a>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 rounded font-mono text-xs">
                        #{bookNum}
                      </span>
                    )}
                  </td>
                  <td className="py-1 pr-2 text-gray-700 font-medium">
                    {challengeId
                      ? <a href={`/challenge/${challengeId}/reader/${encodeURIComponent(book.reader)}`} className="text-indigo-700 hover:underline">{book.reader}</a>
                      : book.reader}
                  </td>
                  <td className="py-1 pr-2">
                    <a href={`/title/${encodeURIComponent(book.title)}`} className="text-indigo-600 hover:underline">
                      {book.title}
                    </a>
                  </td>
                  <td className="py-1 pr-2 italic text-gray-500">
                    {book.author ? (
                      <a href={goodreadsUrl(book.author)} target="_blank" rel="noreferrer" className="hover:underline">
                        {book.author}
                      </a>
                    ) : <span>—</span>}
                  </td>
                  <td className="py-1"><StarDisplay stars={book.stars} /></td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
