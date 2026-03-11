import fs from "fs";
import path from "path";
import type { Milestone } from "./types";
import { getChallengeConfig, getAllChallengeIds, type ChallengeConfig } from "./config";
import { getAllBooks } from "./db";

export interface LegacyBook {
  id?: number; // present when backed by SQLite; absent for JSON-only history
  reader: string;
  title: string;
  author: string | null;
  stars: number | null;
  pages: number | null;
  medium: string | null;
  genre: string | null;
  suggestor: string | null;
  comment: string | null;
  finished_on: string; // "YYYY-MM-DD"
}

export interface LegacyYearConfig {
  year: number;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
}

export const LEGACY_YEARS: Record<number, LegacyYearConfig> = {
  2022: {
    year: 2022,
    startDate: new Date("2022-05-30"),
    endDate: new Date("2022-09-05"),
    milestones: [
      { label: "Pizza",        emoji: "🍕", target: 100 },
      { label: "Ice Cream",    emoji: "🍦", target: 150 },
      { label: "Double Bonus", emoji: "❓",  target: 200 },
      { label: "Triple Bonus", emoji: "❗",  target: 300 },
    ],
  },
  2023: {
    year: 2023,
    startDate: new Date("2023-05-29"),
    endDate: new Date("2023-09-04"),
    milestones: [
      { label: "Pizza",        emoji: "🍕", target: 100 },
      { label: "Ice Cream",    emoji: "🍦", target: 150 },
      { label: "Double Bonus", emoji: "❓",  target: 200 },
      { label: "Triple Bonus", emoji: "❗",  target: 300 },
    ],
  },
  2024: {
    year: 2024,
    startDate: new Date("2024-05-27"),
    endDate: new Date("2024-09-02"),
    milestones: [
      { label: "Pizza",        emoji: "🍕", target: 100 },
      { label: "Ice Cream",    emoji: "🍦", target: 150 },
      { label: "Double Bonus", emoji: "❓",  target: 200 },
      { label: "Triple Bonus", emoji: "❗",  target: 300 },
    ],
  },
  2025: {
    year: 2025,
    startDate: new Date("2025-05-26"),
    endDate: new Date("2025-09-01"),
    milestones: [
      { label: "Pizza",        emoji: "🍕", target: 100 },
      { label: "Ice Cream",    emoji: "🍦", target: 150 },
      { label: "Double Bonus", emoji: "❓",  target: 200 },
      { label: "Triple Bonus", emoji: "❗",  target: 300 },
    ],
  },
};

interface RawEntry {
  Reader: string;
  Title: string;
  Author?: string;
  Stars?: number;
  Pages?: number;
  Medium?: string;
  Genre?: string;
  Suggestor?: string;
  Comment?: string;
  Timestamp: string;
}

export function getLegacyBooks(year: number): LegacyBook[] {
  const filePath = path.join(process.cwd(), "lib", "past-years", `${year}.json`);
  const raw: RawEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return raw.map((entry) => ({
    reader: entry.Reader,
    title: entry.Title,
    author: entry.Author ?? null,
    stars: entry.Stars ?? null,
    pages: entry.Pages ?? null,
    medium: entry.Medium ?? null,
    genre: entry.Genre ?? null,
    suggestor: entry.Suggestor ?? null,
    comment: entry.Comment ?? null,
    finished_on: entry.Timestamp.slice(0, 10),
  }));
}

interface PlaygroundBookEntry {
  reader: string;
  title: string;
  author: string | null;
  finished_on: string;
  stars: number | null;
  pages: number | null;
  medium: string | null;
  genre: string | null;
  suggestor: string | null;
  comment: string | null;
}

function getPlaygroundBooks(): LegacyBook[] {
  const filePath = path.join(process.cwd(), "config", "playground-books.json");
  const raw: PlaygroundBookEntry[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return raw.map((entry) => ({
    reader: entry.reader,
    title: entry.title,
    author: entry.author,
    stars: entry.stars,
    pages: entry.pages,
    medium: entry.medium,
    genre: entry.genre,
    suggestor: entry.suggestor,
    comment: entry.comment,
    finished_on: entry.finished_on,
  }));
}

export interface ResolvedChallengeConfig {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  milestones: import("./types").Milestone[];
}

/** Returns books and config for any challenge ID (year numbers or "playground"). */
export async function getChallengeData(id: string): Promise<{
  config: ResolvedChallengeConfig;
  books: LegacyBook[];
}> {
  const cfg = getChallengeConfig(id);
  const config: ResolvedChallengeConfig = {
    id: cfg.id,
    label: cfg.label,
    startDate: new Date(cfg.startDate),
    endDate: new Date(cfg.endDate),
    milestones: cfg.milestones,
  };

  let books: LegacyBook[];
  if (id === "playground") {
    // Playground reads from the live DB so submitted books appear immediately.
    books = (await getAllBooks("playground")).map((b) => ({
      id: b.id,
      reader: b.reader,
      title: b.title,
      author: b.author,
      stars: b.stars,
      pages: b.pages,
      medium: b.medium,
      genre: b.genre,
      suggestor: b.suggestor,
      comment: b.comment,
      finished_on: b.finished_on,
    }));
  } else {
    const year = parseInt(id, 10);
    if (isNaN(year)) throw new Error(`Unknown challenge id: ${id}`);
    try {
      books = getLegacyBooks(year);
    } catch {
      // No JSON file for this year — use live DB data
      books = (await getAllBooks(id)).map((b) => ({
        id: b.id,
        reader: b.reader,
        title: b.title,
        author: b.author,
        stars: b.stars,
        pages: b.pages,
        medium: b.medium,
        genre: b.genre,
        suggestor: b.suggestor,
        comment: b.comment,
        finished_on: b.finished_on,
      }));
    }
  }

  return { config, books };
}

const EXCLUDED_READERS = new Set(["car", "cat", "Dursley", "Claire", "Josh Schum", "Stephanie Herbers", "Justinf"]);

/** Returns a sorted list of all unique reader names across all challenges. */
export async function getKnownReaders(): Promise<string[]> {
  const names = new Set<string>();
  for (const id of getAllChallengeIds()) {
    try {
      const { books } = await getChallengeData(id);
      for (const b of books) {
        const name = b.reader.trim();
        if (!EXCLUDED_READERS.has(name)) names.add(name);
      }
    } catch { /* skip */ }
  }
  return Array.from(names).sort();
}

/** Returns all challenge IDs where the given reader appears. */
export async function getReaderChallenges(reader: string): Promise<string[]> {
  const allIds = getAllChallengeIds();
  const results = await Promise.all(
    allIds.map(async (id) => {
      try {
        const { books } = await getChallengeData(id);
        return books.some((b) => b.reader.trim() === reader.trim()) ? id : null;
      } catch {
        return null;
      }
    })
  );
  return results.filter((id): id is string => id !== null);
}
