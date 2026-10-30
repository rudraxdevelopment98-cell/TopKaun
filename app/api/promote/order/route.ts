import { NextResponse } from "next/server";
import { z } from "zod";
import { createPromotionOrder } from "@/lib/payments";
import { MIN_INR } from "@/lib/money";
import { CITIES, CATEGORIES } from "@/lib/types";

const schema = z.object({
  amountInr: z.number().int().min(MIN_INR).max(1_000_000),
  slug: z.string().max(80).optional(),
  name: z.string().max(120).optional(),
  url: z.string().max(200).optional(),
  city: z.enum(CITIES).optional(),
  category: z.enum(CATEGORIES).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const d = parsed.data;

  const order = await createPromotionOrder(
    d.amountInr,
    "promo_" + Date.now(),
    {
      slug: d.slug ?? "",
      name: d.name ?? "",
      url: d.url ?? "",
      city: d.city ?? "",
      category: d.category ?? "",
    },
  );

  return NextResponse.json(order);
}
