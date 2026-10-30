import { NextResponse } from "next/server";
import crypto from "crypto";
import { applyPromotion } from "@/lib/data";
import { RAZORPAY_WEBHOOK_SECRET } from "@/lib/env";
import { fromPaise } from "@/lib/money";
import { CITIES, CATEGORIES, type City, type Category } from "@/lib/types";

// Razorpay server-to-server confirmation. This is the source of truth for live
// payments: even if the browser closes after paying, the webhook applies the
// promotion. Configure it in the Razorpay dashboard for the `payment.captured`
// event, pointing at /api/razorpay/webhook, with RAZORPAY_WEBHOOK_SECRET set.

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const expected = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(raw)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { amount?: number; notes?: Record<string, string> } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  if (event.event === "payment.captured") {
    const entity = event.payload?.payment?.entity;
    const notes = entity?.notes ?? {};
    const amountInr = fromPaise(entity?.amount ?? 0);
    if (amountInr > 0) {
      await applyPromotion({
        slug: notes.slug || undefined,
        name: notes.name || undefined,
        url: notes.url || undefined,
        city: CITIES.includes(notes.city as City) ? (notes.city as City) : undefined,
        category: CATEGORIES.includes(notes.category as Category) ? (notes.category as Category) : undefined,
        amountInr,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
