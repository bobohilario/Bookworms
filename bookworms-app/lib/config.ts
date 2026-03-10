import type { Milestone } from "./types";

export const CHALLENGE = {
  year: 2026,
  name: "Shawties Bookworms Reading Challenge",
  startDate: new Date("2026-05-25"),
  endDate: new Date("2026-09-07"),
  milestones: [
    { label: "Pizza",        emoji: "🍕", target: 100 },
    { label: "Ice Cream",    emoji: "🍦", target: 150 },
    { label: "Double Bonus", emoji: "❓",  target: 200 },
    { label: "Triple Bonus", emoji: "❗",  target: 300 },
  ] satisfies Milestone[],
  pastYears: [
    { year: 2024, url: "https://www.wolframcloud.com/obj/bobs/Bookworms/2024SummerChallenge/status" },
    { year: 2023, url: "https://www.wolframcloud.com/obj/bobs/Bookworms/2023SummerChallenge/status" },
  ],
};

export function goodreadsUrl(query: string): string {
  return `https://www.goodreads.com/search?q=${encodeURIComponent(query)}&search_type=books`;
}

/** Linear projection: given current count and rate, return the date target will be hit. */
export function projectDate(
  target: number,
  currentCount: number,
  startDate: Date,
  referenceDate: Date = new Date()
): Date | null {
  if (currentCount === 0) return null;
  const daysSinceStart =
    (referenceDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceStart <= 0) return null;
  const rate = currentCount / daysSinceStart; // books per day
  const daysNeeded = (target - currentCount) / rate;
  if (daysNeeded <= 0) return referenceDate; // already done
  return new Date(referenceDate.getTime() + daysNeeded * 24 * 60 * 60 * 1000);
}

export function booksPerDay(count: number, startDate: Date, referenceDate: Date = new Date()): number {
  const days = (referenceDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 0) return 0;
  return count / days;
}
