export interface Book {
  id: number;
  reader: string;
  title: string;
  author: string;
  finished_on: string; // ISO date "YYYY-MM-DD"
  stars: number | null;
  pages: number | null;
  medium: string;
  genre: string | null;
  suggestor: string | null;
  comment: string | null;
  challenge_id: string;
  dnf: number; // 0 = finished, 1 = did not finish
  created_at: string;
}

export type BookInsert = Omit<Book, "id" | "created_at">;

export interface Milestone {
  label: string;
  emoji: string;
  target: number;
}
