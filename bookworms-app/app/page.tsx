import { getAllBooks } from "@/lib/db";
import { CHALLENGE, booksPerDay } from "@/lib/config";
import ReadingTimeline from "@/components/ReadingTimeline";
import ProgressSection from "@/components/ProgressSection";

export const dynamic = "force-dynamic";

const MILESTONE_IMAGES: Record<string, string> = {
  Pizza: "/pizza.png",
  "Ice Cream": "/icecream.png",
};

export default function DashboardPage() {
  const books = getAllBooks();
  const total = books.length;
  const rate = booksPerDay(total, CHALLENGE.startDate);
  const { milestones } = CHALLENGE;

  // Split books into tiers: [0,100), [100,150), [150,200), [200,300)
  const tierRanges = milestones.map((m, i) => {
    const prev = i === 0 ? 0 : milestones[i - 1].target;
    return { milestone: m, books: books.slice(prev, m.target) };
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">
          {CHALLENGE.year} {CHALLENGE.name}
        </h1>
        <p className="text-gray-500 text-sm">
          {CHALLENGE.startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          {" – "}
          {CHALLENGE.endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <a
          href="/submit"
          className="inline-block mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Add a book »
        </a>
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

      {/* Timeline chart */}
      {books.length >= 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Reading Progress</h2>
          <ReadingTimeline
            books={books}
            startDate={CHALLENGE.startDate}
            endDate={CHALLENGE.endDate}
            milestones={milestones}
          />
        </div>
      )}

      {/* Milestone sections */}
      <div className="flex flex-col gap-6 mb-8">
        {tierRanges.map(({ milestone, books: tierBooks }) => (
          <ProgressSection
            key={milestone.label}
            milestone={milestone}
            books={tierBooks}
            currentTotal={total}
            rewardImage={MILESTONE_IMAGES[milestone.label]}
          />
        ))}
      </div>

      {/* Links */}
      <div className="text-center text-sm text-gray-400 space-x-3">
        <a href="/books" className="hover:text-indigo-600">Full list »</a>
        {CHALLENGE.pastYears.map((py) => (
          <a key={py.year} href={py.url} target="_blank" rel="noreferrer" className="hover:text-indigo-600">
            {py.year} »
          </a>
        ))}
      </div>
    </main>
  );
}
