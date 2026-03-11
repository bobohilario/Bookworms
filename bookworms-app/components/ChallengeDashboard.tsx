import { getChallengeData } from "@/lib/legacy";
import { getCurrentChallenge, isSubmissionsOpen, getPastChallenges, booksPerDay } from "@/lib/config";
import ReadingTimeline from "@/components/ReadingTimeline";
import ProgressSection from "@/components/ProgressSection";
import WormMuscle from "@/components/WormMuscle";
import WormHunked from "@/components/WormHunked";

const MILESTONE_IMAGES: Record<string, string> = {
  Pizza: "/pizza.png",
  "Ice Cream": "/icecream.png",
};

const MILESTONE_ICONS: Record<string, React.ReactNode> = {
  "Double Bonus": <WormMuscle className="w-10 h-10" />,
  "Triple Bonus": <WormHunked className="w-10 h-10" />,
};

// Book-spine accent colors per milestone tier (cycles if more than 4)
const SPINE_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6"];

interface Props {
  challengeId: string;
  /** True when this component is rendering the home page (/) */
  isHome?: boolean;
}

export default function ChallengeDashboard({ challengeId, isHome = false }: Props) {
  const { config, books } = getChallengeData(challengeId);
  const total = books.length;

  const now = new Date();
  const hasEnded = config.endDate < now;
  const referenceDate = hasEnded ? config.endDate : now;
  const rate = booksPerDay(total, config.startDate, referenceDate);

  const submissionsOpen = isSubmissionsOpen(challengeId);
  const currentChallenge = getCurrentChallenge();
  const pastChallenges = getPastChallenges(challengeId);

  const tierRanges = config.milestones.map((m, i) => {
    const prev = i === 0 ? 0 : config.milestones[i - 1].target;
    return { milestone: m, books: books.slice(prev, m.target), bookOffset: prev, index: i };
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header — dark frame with light interior */}
      <header className="text-center mb-8 rounded-xl shadow-lg border-4 border-amber-900 bg-amber-950 p-1.5">
        <div className="bg-amber-50 rounded-lg px-6 py-5 border border-amber-200">
          <p className="text-xs uppercase tracking-widest text-amber-600 mb-2">📚 Summer Reading Challenge</p>
          <h1 className="text-4xl font-bold text-amber-900 mb-1">{config.label}</h1>
          <p className="text-amber-700 text-sm">
            {config.startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            {" – "}
            {config.endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          {submissionsOpen ? (
            <a
              href={`/submit?challenge=${challengeId}`}
              className="inline-block mt-4 px-5 py-2 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded-lg font-bold transition-colors shadow"
            >
              Add a book »
            </a>
          ) : (
            <p className="mt-4 text-sm text-amber-500 italic">Submissions are closed.</p>
          )}
        </div>
      </header>

      {/* Stats bar */}
      <div className="bg-amber-100 border border-amber-200 rounded-xl p-5 mb-6 flex gap-8 justify-center text-center shadow-sm">
        <div>
          <p className="text-4xl font-bold text-amber-900">{total}</p>
          <p className="text-sm text-amber-600 mt-1">Books read</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-amber-900">{rate.toFixed(2)}</p>
          <p className="text-sm text-amber-600 mt-1">Books per day</p>
        </div>
      </div>

      {/* Timeline chart */}
      {books.length >= 2 && (
        <div className="bg-white border border-amber-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-amber-900 mb-3">Reading Progress</h2>
          <ReadingTimeline
            books={books}
            startDate={config.startDate}
            endDate={config.endDate}
            milestones={config.milestones}
          />
        </div>
      )}

      {/* Bookshelf — each milestone section sits on a wooden shelf */}
      <div className="rounded-xl overflow-hidden border border-amber-300 shadow-md bg-amber-950 mb-8">
        {/* Top shelf rail */}
        <div className="h-2 bg-gradient-to-b from-amber-700 to-amber-800" />

        {tierRanges.map(({ milestone, books: tierBooks, bookOffset, index }) => (
          <div key={milestone.label}>
            {/* Section with colored book-spine accent */}
            <div className="flex bg-amber-50">
              <div className="w-2 shrink-0" style={{ backgroundColor: SPINE_COLORS[index % SPINE_COLORS.length] }} />
              <div className="flex-1">
                <ProgressSection
                  milestone={milestone}
                  books={tierBooks}
                  currentTotal={total}
                  startDate={config.startDate}
                  bookOffset={bookOffset}
                  rewardImage={MILESTONE_IMAGES[milestone.label]}
                  rewardIcon={MILESTONE_ICONS[milestone.label]}
                  challengeId={challengeId}
                  challengeEnded={hasEnded}
                />
              </div>
            </div>

            {/* Wooden shelf plank between sections */}
            <div className="h-4 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 relative">
              <div className="absolute inset-x-0 top-0 h-px bg-amber-600 opacity-60" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-amber-950" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div className="text-center text-sm space-y-2">
        <div className="flex items-center justify-center gap-3">
          <a href={`/challenge/${challengeId}/books`} className="inline-block px-4 py-1.5 border border-amber-400 text-amber-700 hover:bg-amber-50 rounded-lg font-medium transition-colors">
            All books
          </a>
          {!isHome && (
            <a href="/" className="inline-block px-4 py-1.5 border border-amber-400 text-amber-700 hover:bg-amber-50 rounded-lg font-medium transition-colors">
              ← {currentChallenge.label}
            </a>
          )}
        </div>
        <div className="text-amber-500 space-x-3">
          {pastChallenges.map((py) => (
            <a key={py.year} href={py.url} className="hover:text-amber-700">
              {py.year} »
            </a>
          ))}
          {challengeId !== "playground" && (
            <a href="/challenge/playground" className="text-purple-400 hover:text-purple-600 italic">
              playground
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
