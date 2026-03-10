/** Returns true if the suggestor name matches a known reader (trims whitespace). */
export function isKnownReader(suggestor: string | null | undefined, readers: Iterable<string>): boolean {
  if (!suggestor) return false;
  const trimmed = suggestor.trim();
  for (const r of readers) {
    if (r.trim() === trimmed) return true;
  }
  return false;
}
