import { describe, it, expect } from "vitest";
import { isKnownReader } from "@/lib/suggestor";

describe("isKnownReader", () => {
  const readers = ["Alice", "Bob", "Carol"];
  it("returns true for an exact match", () => expect(isKnownReader("Alice", readers)).toBe(true));
  it("returns true ignoring surrounding whitespace", () => expect(isKnownReader(" Bob ", readers)).toBe(true));
  it("returns false for a non-reader name", () => expect(isKnownReader("Dave", readers)).toBe(false));
  it("returns false for null", () => expect(isKnownReader(null, readers)).toBe(false));
  it("returns false for undefined", () => expect(isKnownReader(undefined, readers)).toBe(false));
  it("returns false for empty string", () => expect(isKnownReader("", readers)).toBe(false));
  it("is case-sensitive", () => expect(isKnownReader("alice", readers)).toBe(false));
});
