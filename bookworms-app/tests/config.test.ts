import { describe, it, expect } from "vitest";
import {
  getOpenChallenges,
  getCurrentChallenge,
  isSubmissionsOpen,
  getPastChallenges,
} from "@/lib/config";

// Reference dates derived from challenges.json:
//   playground  2026-01-01 – 2026-11-07
//   2022        2022-05-30 – 2022-09-05
//   2023        2023-05-29 – 2023-09-04
//   2024        2024-05-27 – 2024-09-02
//   2025        2025-05-26 – 2025-09-01
//   2026        2026-05-25 – 2026-09-07

const d = (s: string) => new Date(s);

// ── getOpenChallenges ────────────────────────────────────────────────────────

describe("getOpenChallenges", () => {
  it("returns empty when no real challenge is active", () => {
    expect(getOpenChallenges(d("2024-01-15"))).toHaveLength(0);
  });

  it("returns 2022 when inside its window", () => {
    const open = getOpenChallenges(d("2022-07-15"));
    expect(open).toHaveLength(1);
    expect(open[0].id).toBe("2022");
  });

  it("returns 2026 and playground when both windows overlap", () => {
    // 2026-06-01 falls inside both the 2026 challenge and the playground range
    const open = getOpenChallenges(d("2026-06-01"));
    expect(open.some((c) => c.id === "2026")).toBe(true);
    expect(open.some((c) => c.id === "playground")).toBe(true);
  });

  it("is inclusive on startDate", () => {
    expect(getOpenChallenges(d("2022-05-30"))[0].id).toBe("2022");
  });

  it("is inclusive on endDate", () => {
    expect(getOpenChallenges(d("2022-09-05"))[0].id).toBe("2022");
  });

  it("returns empty the day after a challenge ends", () => {
    expect(getOpenChallenges(d("2022-09-06"))).toHaveLength(0);
  });

  it("includes playground when today is in its range", () => {
    // 2026-03-10 is inside playground range (2026-01-01 – 2026-11-07)
    const open = getOpenChallenges(d("2026-03-10"));
    expect(open.some((c) => c.id === "playground")).toBe(true);
  });

  it("playground does not appear when outside its range", () => {
    const open = getOpenChallenges(d("2025-06-01")); // inside 2025, before playground
    expect(open.every((c) => c.id !== "playground")).toBe(true);
  });
});

// ── isSubmissionsOpen ────────────────────────────────────────────────────────

describe("isSubmissionsOpen", () => {
  it("returns true during the 2022 challenge", () => {
    expect(isSubmissionsOpen("2022", d("2022-07-15"))).toBe(true);
  });

  it("returns false before the 2022 challenge starts", () => {
    expect(isSubmissionsOpen("2022", d("2022-05-29"))).toBe(false);
  });

  it("returns false after the 2022 challenge ends", () => {
    expect(isSubmissionsOpen("2022", d("2022-09-06"))).toBe(false);
  });

  it("returns true for playground during its range", () => {
    expect(isSubmissionsOpen("playground", d("2026-03-10"))).toBe(true);
  });

  it("returns false for playground before its range", () => {
    expect(isSubmissionsOpen("playground", d("2025-12-31"))).toBe(false);
  });

  it("returns false for an unknown id", () => {
    expect(isSubmissionsOpen("9999", d("2022-07-15"))).toBe(false);
  });
});

// ── getCurrentChallenge ──────────────────────────────────────────────────────

describe("getCurrentChallenge", () => {
  it("returns the open challenge when one is active", () => {
    expect(getCurrentChallenge(d("2022-07-15")).id).toBe("2022");
  });

  it("returns the soonest upcoming challenge when between challenges", () => {
    // 2023-10-01 is after 2023 ends, before 2024 starts → next up is 2024
    expect(getCurrentChallenge(d("2023-10-01")).id).toBe("2024");
  });

  it("returns the soonest upcoming challenge when before all challenges", () => {
    expect(getCurrentChallenge(d("2020-01-01")).id).toBe("2022");
  });

  it("returns the most recently ended challenge when all are past", () => {
    expect(getCurrentChallenge(d("2030-01-01")).id).toBe("2026");
  });

  it("never returns playground", () => {
    // 2026-03-10 is in playground range but before 2026 challenge
    expect(getCurrentChallenge(d("2026-03-10")).id).not.toBe("playground");
  });
});

// ── getPastChallenges ────────────────────────────────────────────────────────

describe("getPastChallenges", () => {
  it("returns empty when before all challenges", () => {
    expect(getPastChallenges(undefined, d("2020-01-01"))).toHaveLength(0);
  });

  it("returns ended challenges sorted newest-first", () => {
    const past = getPastChallenges(undefined, d("2023-10-01"));
    expect(past.map((p) => p.year)).toEqual([2023, 2022]);
  });

  it("excludes the given id", () => {
    const past = getPastChallenges("2023", d("2023-10-01"));
    expect(past.every((p) => p.year !== 2023)).toBe(true);
  });

  it("never includes playground", () => {
    const past = getPastChallenges(undefined, d("2030-01-01"));
    expect(past.every((p) => !isNaN(p.year))).toBe(true);
  });

  it("returns correct url format", () => {
    const past = getPastChallenges(undefined, d("2023-10-01"));
    expect(past[0].url).toBe("/past/2023");
  });
});
