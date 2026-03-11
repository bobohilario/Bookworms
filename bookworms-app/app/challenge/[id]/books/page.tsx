import { notFound } from "next/navigation";
import { getChallengeData } from "@/lib/legacy";
import { getChallengeConfig, isSubmissionsOpen } from "@/lib/config";
import LegacyBookTable from "@/components/LegacyBookTable";

export const dynamic = "force-dynamic";

export default async function ChallengeBooksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let config;
  try {
    config = getChallengeConfig(id);
  } catch {
    notFound();
  }

  const { books } = await getChallengeData(id);
  const submissionsOpen = isSubmissionsOpen(id);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Books — {config.label}</h1>
          <p className="text-sm text-gray-500">{books.length} books read</p>
        </div>
        <div className="flex items-center gap-3 text-sm flex-wrap justify-end">
          <a
            href={`/api/books/export?challenge=${id}&format=csv`}
            className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            download
          >
            ↓ CSV
          </a>
          <a
            href={`/api/books/export?challenge=${id}&format=json`}
            className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            download
          >
            ↓ JSON
          </a>
          {submissionsOpen && (
            <a
              href={`/submit?challenge=${id}`}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Add a book
            </a>
          )}
          <a href={`/challenge/${id}`} className="text-indigo-600 hover:underline">
            ← Dashboard
          </a>
        </div>
      </div>
      <LegacyBookTable books={books} challengeId={id} />
    </main>
  );
}
