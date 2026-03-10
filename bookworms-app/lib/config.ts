import type { Milestone } from "./types";
import challengesData from "../config/challenges.json";

// Edit config/challenges.json to add/modify challenges.
// No env var or code change needed to activate a challenge — open status is driven purely by dates.

export interface ChallengeConfig {
  id: string;
  label: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  milestones: Milestone[];
}

const allChallenges: ChallengeConfig[] = challengesData.challenges;

function toDateStr(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function loadChallenge(id: string): ChallengeConfig {
  const cfg = allChallenges.find((c) => c.id === id);
  if (!cfg) throw new Error(`No challenge config found for id "${id}"`);
  return cfg;
}

/** All challenges (including playground) whose date range includes today. */
export function getOpenChallenges(now: Date = new Date()): ChallengeConfig[] {
  const today = toDateStr(now);
  return allChallenges.filter(
    (c) => today >= c.startDate && today <= c.endDate
  );
}

/**
 * The challenge best suited for the main dashboard:
 * open (most recently started) > upcoming (soonest) > most recently ended.
 * Excludes "playground".
 */
export function getCurrentChallenge(now: Date = new Date()): ChallengeConfig {
  const today = toDateStr(now);
  const real = allChallenges.filter((c) => c.id !== "playground" && !isNaN(Number(c.id)));

  const open = real.filter((c) => today >= c.startDate && today <= c.endDate);
  if (open.length > 0) {
    return open.sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
  }

  const upcoming = real.filter((c) => c.startDate > today);
  if (upcoming.length > 0) {
    return upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  }

  return real.sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
}

/** True if today falls within the given challenge's date range. */
export function isSubmissionsOpen(id: string, now: Date = new Date()): boolean {
  const cfg = allChallenges.find((c) => c.id === id);
  if (!cfg) return false;
  const today = toDateStr(now);
  return today >= cfg.startDate && today <= cfg.endDate;
}

/** Year-based challenges that have ended, sorted newest first. Optionally excludes one id. */
export function getPastChallenges(
  excludeId?: string,
  now: Date = new Date()
): Array<{ year: number; url: string }> {
  const today = toDateStr(now);
  return allChallenges
    .filter(
      (c) =>
        c.id !== "playground" &&
        c.id !== excludeId &&
        !isNaN(Number(c.id)) &&
        c.endDate < today
    )
    .sort((a, b) => b.endDate.localeCompare(a.endDate))
    .map((c) => ({ year: Number(c.id), url: `/past/${c.id}` }));
}

export function getChallengeConfig(id: string): ChallengeConfig {
  return loadChallenge(id);
}

export function getAllChallengeIds(): string[] {
  return allChallenges.map((c) => c.id);
}

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
  const rate = currentCount / daysSinceStart;
  const daysNeeded = (target - currentCount) / rate;
  if (daysNeeded <= 0) return referenceDate;
  return new Date(referenceDate.getTime() + daysNeeded * 24 * 60 * 60 * 1000);
}

export function booksPerDay(count: number, startDate: Date, referenceDate: Date = new Date()): number {
  const days = (referenceDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 0) return 0;
  return count / days;
}
