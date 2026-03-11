import { NextRequest, NextResponse } from "next/server";
import { getChallengeData } from "@/lib/legacy";
import { getChallengeConfig } from "@/lib/config";

function csvEscape(val: unknown): string {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const challengeId = searchParams.get("challenge");
  const format = searchParams.get("format") ?? "json";

  if (!challengeId) {
    return NextResponse.json({ error: "Missing challenge parameter" }, { status: 400 });
  }

  try {
    getChallengeConfig(challengeId); // validate challenge exists
  } catch {
    return NextResponse.json({ error: "Unknown challenge" }, { status: 404 });
  }

  const { books } = getChallengeData(challengeId);

  if (format === "csv") {
    const headers = ["#", "reader", "title", "author", "stars", "finished_on", "pages", "medium", "genre", "suggestor", "comment"];
    const rows = books.map((b, i) =>
      [i + 1, b.reader, b.title, b.author, b.stars, b.finished_on, b.pages, b.medium, b.genre, b.suggestor, b.comment]
        .map(csvEscape)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="books-${challengeId}.csv"`,
      },
    });
  }

  // JSON
  return new NextResponse(JSON.stringify(books, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="books-${challengeId}.json"`,
    },
  });
}
