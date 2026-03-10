import { notFound } from "next/navigation";
import { getLegacyBooks, LEGACY_YEARS } from "@/lib/legacy";
import { booksPerDay } from "@/lib/config";
import LegacyBookTable from "@/components/LegacyBookTable";
import ReadingTimeline from "@/components/ReadingTimeline";

export function generateStaticParams() {
  return Object.keys(LEGACY_YEARS).map((y) => ({ year: y }));
}

const MILESTONE_IMAGES: Record<string, string> = {
  Pizza: "/pizza.png",
  "Ice Cream": "/icecream.png",
};

export default async function PastYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  const config = LEGACY_YEARS[year];
  if (!config) notFound();

  const books = getLegacyBooks(year);
  const total = books.length;
  const rate = booksPerDay(total, config.startDate, config.endDate);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">
          {year} Shawties Bookworms Reading Challenge
        </h1>
        <p className="text-gray-500 text-sm">
          {config.startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          {" – "}
          {config.endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </header>

      {/* Stats bar */}
      <div className="bg-indigo-50 rounded-xl p-5 mb-6 flex gap-8 justify-center text-center">
        <div>
          <p className="text-4xl font-bold text-indigo-700">{total}</p>
          <p className="text-sm text-indigo-500 mt-1">Books read</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-indigo-700">{rate.toFixed(2)}</p>
          <p className="text-sm text-indigo-500 mt-1">Books per day</p>
        </div>
      </div>

      {/* Timeline */}
      {books.length >= 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Reading Progress</h2>
          <ReadingTimeline
            books={books}
            startDate={config.startDate}
            endDate={config.endDate}
            milestones={config.milestones}
          />
        </div>
      )}

      {/* Milestone badges */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {config.milestones.map((m) => {
          const achieved = total >= m.target;
          const completionBook = achieved ? books[m.target - 1] : null;
          return (
            <div
              key={m.label}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
                achieved
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {MILESTONE_IMAGES[m.label] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={MILESTONE_IMAGES[m.label]} alt={m.label} className="w-6 h-6 object-contain" />
              ) : (
                <span className="text-lg">{m.emoji}</span>
              )}
              <span>{m.label} ({m.target})</span>
              {achieved && <span className="text-green-600">✓</span>}
              {achieved && completionBook && (
                <span className="text-xs text-green-600 font-normal">
                  {new Date(completionBook.finished_on).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Book table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">All {total} Books</h2>
        <a href="/" className="text-indigo-600 hover:underline text-sm">← Current Challenge</a>
      </div>
      <LegacyBookTable books={books} challengeId={String(year)} />
    </main>
  );
}
