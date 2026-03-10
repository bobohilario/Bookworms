import { getAllBooks } from "@/lib/db";
import BookTable from "@/components/BookTable";

export const dynamic = "force-dynamic";

export default function BooksPage() {
  const books = getAllBooks();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Books</h1>
          <p className="text-sm text-gray-500">{books.length} books read so far</p>
        </div>
        <div className="flex gap-3 text-sm">
          <a href="/" className="text-indigo-600 hover:underline">← Dashboard</a>
          <a href="/submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            Add a book
          </a>
        </div>
      </div>
      <BookTable books={books} />
    </main>
  );
}
