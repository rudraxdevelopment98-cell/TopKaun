import { NextResponse } from "next/server";
import { z } from "zod";
import { applyPromotion, getWatchersForBoard } from "@/lib/data";
import { verifyCheckoutSignature } from "@/lib/payments";
import { sendOutrankedAlert } from "@/lib/email";
import { SITE_URL } from "@/lib/env";
import { MIN_INR } from "@/lib/money";
import { CITIES, CATEGORIES } from "@/lib/types";

const schema = z.object({
  provider: z.enum(["mock", "razorpay"]),
  orderId: z.string().max(120),
  paymentId: z.string().max(120).optional(),
  signature: z.string().max(256).optional(),
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

  // Real payments must carry a verified Razorpay signature.
  if (d.provider === "razorpay") {
    if (!d.paymentId || !d.signature || !verifyCheckoutSignature(d.orderId, d.paymentId, d.signature)) {
      return NextResponse.json({ error: "Payment could not be verified" }, { status: 402 });
    }
  }

  const result = await applyPromotion({
    slug: d.slug,
    name: d.name,
    url: d.url,
    city: d.city,
    category: d.category,
    amountInr: d.amountInr,
  });

  // If this payment changed who holds India #1, email everyone watching it.
  // Best-effort: never let an email problem fail a confirmed payment.
  if (result.indiaRank === 1 && result.tookTopFrom) {
    try {
      const watchers = await getWatchersForBoard("India #1");
      await Promise.allSettled(
        watchers.map((w) =>
          sendOutrankedAlert(w.email, {
            board: "India",
            newLeader: result.listing.name,
            previousLeader: result.tookTopFrom as string,
            amountInr: result.listing.totalInr,
            siteUrl: SITE_URL,
          }),
        ),
      );
    } catch {
      // swallow — the payment already succeeded
    }
  }

  return NextResponse.json({
    ok: true,
    slug: result.listing.slug,
    name: result.listing.name,
    indiaRank: result.indiaRank,
    totalInr: result.listing.totalInr,
    tookTopFrom: result.tookTopFrom ?? null,
  });
}
