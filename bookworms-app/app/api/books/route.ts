import { NextRequest, NextResponse } from "next/server";
import { getAllBooks, insertBook } from "@/lib/db";
import type { BookInsert } from "@/lib/types";

export async function GET() {
  const books = getAllBooks();
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const required = ["reader", "title", "author", "finished_on", "medium"];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const validMediums = ["Paper", "Audio", "eBook", "It's a secret", "Other"];
  if (!validMediums.includes(body.medium)) {
    return NextResponse.json({ error: "Invalid medium" }, { status: 400 });
  }

  const stars = body.stars != null && body.stars !== "" ? Number(body.stars) : null;
  if (stars !== null && (stars < 1 || stars > 5 || !Number.isInteger(stars))) {
    return NextResponse.json({ error: "Stars must be 1–5" }, { status: 400 });
  }

  const pages = body.pages != null && body.pages !== "" ? Number(body.pages) : null;
  if (pages !== null && (pages < 1 || !Number.isInteger(pages))) {
    return NextResponse.json({ error: "Pages must be a positive integer" }, { status: 400 });
  }

  const insert: BookInsert = {
    reader: String(body.reader).trim(),
    title: String(body.title).trim(),
    author: String(body.author).trim(),
    finished_on: String(body.finished_on),
    stars,
    pages,
    medium: String(body.medium),
    genre: body.genre ? String(body.genre).trim() : null,
    suggestor: body.suggestor ? String(body.suggestor).trim() : null,
    comment: body.comment ? String(body.comment).trim() : null,
  };

  const book = insertBook(insert);
  return NextResponse.json(book, { status: 201 });
}
