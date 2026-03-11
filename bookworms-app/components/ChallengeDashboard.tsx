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
  const notStarted = config.startDate > now;
  const referenceDate = hasEnded ? config.endDate : now;
  const rate = booksPerDay(total, config.startDate, referenceDate);

  // Days stat
  let daysValue: string;
  let daysLabel: string;
  if (notStarted) {
    const d = Math.ceil((config.startDate.getTime() - now.getTime()) / 864e5);
    daysValue = String(d);
    daysLabel = "Days until start";
  } else if (!hasEnded) {
    const d = Math.ceil((config.endDate.getTime() - now.getTime()) / 864e5);
    daysValue = String(d);
    daysLabel = "Days remaining";
  } else {
    const d = Math.round((config.endDate.getTime() - config.startDate.getTime()) / 864e5);
    daysValue = String(d);
    daysLabel = "Days of challenge";
  }

  // Next milestone stat
  const nextMilestone = config.milestones.find((m) => total < m.target);
  const nextGoalValue = nextMilestone ? String(nextMilestone.target - total) : "✓";
  const nextGoalLabel = nextMilestone ? `To ${nextMilestone.label}` : "All goals met!";

  const submissionsOpen = isSubmissionsOpen(challengeId);
  const currentChallenge = getCurrentChallenge();
  const pastChallenges = getPastChallenges(challengeId);

  const tierRanges = config.milestones.map((m, i) => {
    const prev = i === 0 ? 0 : config.milestones[i - 1].target;
    return { milestone: m, books: books.slice(prev, m.target), bookOffset: prev, index: i };
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header — dark frame with grayish-blue interior */}
      <header className="text-center mb-8 rounded-xl shadow-lg border-4 border-amber-900 bg-amber-950 p-1.5">
        <div className="bg-slate-200 rounded-lg px-6 py-5 border border-slate-300">
          <h1 className="text-4xl font-bold text-slate-800 mb-1">{config.label}</h1>
          <p className="text-slate-500 text-sm">
            {config.startDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            {" – "}
            {config.endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          {submissionsOpen ? (
            <a
              href={`/submit?challenge=${challengeId}`}
              className="inline-block mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-bold transition-colors shadow-md text-base"
            >
              Add a book »
            </a>
          ) : (
            <p className="mt-4 text-sm text-slate-400 italic">Submissions are closed.</p>
          )}
        </div>
      </header>

      {/* Stats — modern dashboard cards */}
      <div className="grid grid-cols-2 mb-6 rounded-xl overflow-hidden shadow-md border border-gray-200">
        {/* Primary card: books + rate (full width, dark) */}
        <div className="col-span-2 bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div>
            <p className="text-4xl font-bold tabular-nums">{total}</p>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-0.5">Books read</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums text-slate-200">{rate.toFixed(2)}</p>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-0.5">Books / day</p>
          </div>
        </div>

        {/* Secondary: days */}
        <div className="bg-white border-t border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{daysValue}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{daysLabel}</p>
        </div>

        {/* Secondary: next goal */}
        <div className="bg-white border-t border-l border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{nextGoalValue}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{nextGoalLabel}</p>
        </div>
      </div>

      {/* Timeline chart */}
      {books.length >= 2 && (
        <div className="bg-white border border-gray-200 rounded-xl px-5 pt-4 pb-2 mb-6 shadow-sm">
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
        <div className="h-4 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-amber-600 opacity-60" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-amber-950" />
        </div>

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
