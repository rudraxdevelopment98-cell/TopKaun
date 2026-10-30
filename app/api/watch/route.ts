import { NextResponse } from "next/server";
import { z } from "zod";
import { addWatcher } from "@/lib/data";

const schema = z.object({
  email: z.string().email().max(160),
  board: z.string().max(120),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }
  await addWatcher(parsed.data.email, parsed.data.board);
  return NextResponse.json({ ok: true });
}
