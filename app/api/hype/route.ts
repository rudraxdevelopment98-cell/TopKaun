import { NextResponse } from "next/server";
import { z } from "zod";
import { addHype } from "@/lib/data";

const schema = z.object({ slug: z.string().max(80) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const listing = await addHype(parsed.data.slug);
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, hype: listing.hype });
}
