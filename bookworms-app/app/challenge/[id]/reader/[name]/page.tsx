import { notFound } from "next/navigation";
import { getChallengeData, getReaderChallenges } from "@/lib/legacy";
import { goodreadsUrl } from "@/lib/config";

function StarDisplay({ stars }: { stars: number | null }) {
  if (!stars) return <span className="text-gray-400">—</span>;
  return <span className="text-amber-500">{"★".repeat(stars)}</span>;
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ id: string; name: string }>;
}) {
  const { id, name } = await params;
  const reader = decodeURIComponent(name);

  let data;
  try {
    data = await getChallengeData(id);
  } catch {
    notFound();
  }

  const { config, books } = data;
  const readerBooks = books.filter((b) => b.reader.trim() === reader.trim());

  if (readerBooks.length === 0) notFound();

  const otherChallengeIds = (await getReaderChallenges(reader)).filter((cid) => cid !== id);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <p className="text-sm text-gray-500 mb-6">
        <a href={`/challenge/${id}`} className="text-indigo-600 hover:underline">
          ← {config.label}
        </a>
      </p>

      <h1 className="text-3xl font-bold text-gray-900 mb-1">{reader}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {readerBooks.length} book{readerBooks.length !== 1 ? "s" : ""} in {config.label}
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200 mb-8">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">★</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medium</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {readerBooks.map((book, i) => (
              <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                <td className="px-3 py-2 text-gray-400 font-mono">{i + 1}</td>
                <td className="px-3 py-2">
                  <a href={`/title/${encodeURIComponent(book.title)}`} className="text-indigo-600 hover:underline">
                    {book.title}
                  </a>
                </td>
                <td className="px-3 py-2 text-gray-600 italic">
                  {book.author ? (
                    <a href={goodreadsUrl(book.author)} target="_blank" rel="noreferrer" className="hover:underline">
                      {book.author}
                    </a>
                  ) : "—"}
                </td>
                <td className="px-3 py-2"><StarDisplay stars={book.stars} /></td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{book.finished_on}</td>
                <td className="px-3 py-2 text-gray-500">{book.pages ?? "—"}</td>
                <td className="px-3 py-2 text-gray-500">{book.medium ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {otherChallengeIds.length > 0 && (
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{reader} in other challenges: </span>
          {otherChallengeIds.map((cid, i) => (
            <span key={cid}>
              {i > 0 && <span className="mx-1 text-gray-300">·</span>}
              <a
                href={`/challenge/${cid}/reader/${encodeURIComponent(reader)}`}
                className="text-indigo-600 hover:underline"
              >
                {isNaN(Number(cid)) ? cid : cid}
              </a>
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
