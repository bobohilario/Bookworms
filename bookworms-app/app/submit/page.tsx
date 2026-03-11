import { getCurrentChallenge, getChallengeConfig, isSubmissionsOpen } from "@/lib/config";
import { getKnownReaders } from "@/lib/legacy";
import SubmitForm from "@/components/SubmitForm";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ challenge?: string }>;
}) {
  const { challenge } = await searchParams;

  let cfg;
  try {
    cfg = challenge ? getChallengeConfig(challenge) : getCurrentChallenge();
  } catch {
    cfg = getCurrentChallenge();
  }

  const open = isSubmissionsOpen(cfg.id);
  const backHref = challenge ? `/challenge/${challenge}` : "/";
  const knownReaders = await getKnownReaders();
  const start = new Date(cfg.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const end = new Date(cfg.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add a Book</h1>
      <p className="text-sm text-gray-500 mb-6">
        <a href={backHref} className="text-indigo-600 hover:underline">← Back</a>
      </p>

      {open ? (
        <SubmitForm challengeId={cfg.id} backHref={backHref} knownReaders={knownReaders} />
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-6 text-center">
          <p className="text-lg font-semibold mb-1">Submissions are closed</p>
          <p className="text-sm text-amber-700">
            The {cfg.label} runs {start} – {end}.
          </p>
        </div>
      )}
    </main>
  );
}
