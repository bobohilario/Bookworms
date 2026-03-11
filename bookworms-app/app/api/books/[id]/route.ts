import { NextRequest, NextResponse } from "next/server";
import { getBookById, deleteBook, updateBook } from "@/lib/db";
import type { BookInsert } from "@/lib/types";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const ok = await deleteBook(numId);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const existing = await getBookById(numId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const allowed: (keyof BookInsert)[] = [
    "reader", "title", "author", "finished_on", "stars", "pages",
    "medium", "genre", "suggestor", "comment",
  ];
  const fields: Partial<BookInsert> = {};
  for (const key of allowed) {
    if (key in body) {
      (fields as Record<string, unknown>)[key] = body[key] === "" ? null : body[key];
    }
  }

  const updated = await updateBook(numId, fields);
  return NextResponse.json(updated);
}
