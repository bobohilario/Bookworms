import { getAllBooks } from "@/lib/db";
import { getCurrentChallenge } from "@/lib/config";
import BookTable from "@/components/BookTable";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const books = await getAllBooks(getCurrentChallenge().id);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Books</h1>
          <p className="text-sm text-gray-500">{books.length} books read so far</p>
        </div>
        <div className="flex gap-3 text-sm flex-wrap justify-end">
          <a
            href={`/api/books/export?challenge=${getCurrentChallenge().id}&format=csv`}
            className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            download
          >
            ↓ CSV
          </a>
          <a
            href={`/api/books/export?challenge=${getCurrentChallenge().id}&format=json`}
            className="px-3 py-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            download
          >
            ↓ JSON
          </a>
          <a href="/" className="text-indigo-600 hover:underline self-center">← Dashboard</a>
          <a href={"/submit?challenge=" + getCurrentChallenge().id} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            Add a book
          </a>
        </div>
      </div>
      <BookTable books={books} challengeId={getCurrentChallenge().id} />
    </main>
  );
}
