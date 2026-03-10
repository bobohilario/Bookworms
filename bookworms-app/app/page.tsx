import { getAllBooks } from "@/lib/db";
import { getCurrentChallenge, isSubmissionsOpen, getPastChallenges, booksPerDay } from "@/lib/config";
import ReadingTimeline from "@/components/ReadingTimeline";
import ProgressSection from "@/components/ProgressSection";

export const dynamic = "force-dynamic";

const MILESTONE_IMAGES: Record<string, string> = {
  Pizza: "/pizza.png",
  "Ice Cream": "/icecream.png",
};

export default function DashboardPage() {
  const cfg = getCurrentChallenge();
  const startDate = new Date(cfg.startDate);
  const endDate = new Date(cfg.endDate);
  const { milestones } = cfg;

  const books = getAllBooks(cfg.id);
  const total = books.length;
  const rate = booksPerDay(total, startDate);
  const submissionsOpen = isSubmissionsOpen(cfg.id);
  const pastYears = getPastChallenges(cfg.id);

  // Split books into tiers: [0,100), [100,150), [150,200), [200,300)
  const tierRanges = milestones.map((m, i) => {
    const prev = i === 0 ? 0 : milestones[i - 1].target;
    return { milestone: m, books: books.slice(prev, m.target) };
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">{cfg.label}</h1>
        <p className="text-gray-500 text-sm">
          {startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          {" – "}
          {endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        {submissionsOpen ? (
          <a
            href={`/submit?challenge=${cfg.id}`}
            className="inline-block mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Add a book »
          </a>
        ) : (
          <p className="mt-4 text-sm text-gray-400 italic">Submissions are closed.</p>
        )}
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
            startDate={startDate}
            endDate={endDate}
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
            startDate={startDate}
            rewardImage={MILESTONE_IMAGES[milestone.label]}
            challengeId={cfg.id}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-sm space-y-2 mt-2">
        <div>
          <a href="/books" className="inline-block px-4 py-1.5 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors">
            All books
          </a>
        </div>
        <div className="text-gray-400 space-x-3">
          {pastYears.map((py) => (
            <a key={py.year} href={py.url} className="hover:text-indigo-600">
              {py.year} »
            </a>
          ))}
          <a
            href="/challenge/playground"
            className="text-purple-400 hover:text-purple-600 italic"
          >
            playground
          </a>
        </div>
      </div>
    </main>
  );
}
