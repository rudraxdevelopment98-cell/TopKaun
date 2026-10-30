import crypto from "crypto";
import Razorpay from "razorpay";
import { toPaise } from "./money";
import {
  PAYMENTS_LIVE,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "./env";

// ──────────────────────────────────────────────────────────────────────
// Payments.
//
// In demo mode (no Razorpay keys) createPromotionOrder returns a "mock"
// order and the client confirms it instantly, so the whole promote → pay →
// you're-ranked loop is fully clickable with no account.
//
// With real keys it creates a genuine Razorpay order; the client opens
// Razorpay Checkout; the signature is verified server-side before the
// promotion is applied.
// ──────────────────────────────────────────────────────────────────────

export interface PromotionOrder {
  provider: "mock" | "razorpay";
  orderId: string;
  amountInr: number;
  /** Publishable key id, only for the razorpay provider. */
  keyId?: string;
}

export async function createPromotionOrder(
  amountInr: number,
  receipt: string,
  notes: Record<string, string>,
): Promise<PromotionOrder> {
  if (!PAYMENTS_LIVE) {
    return {
      provider: "mock",
      orderId: "order_mock_" + Date.now(),
      amountInr,
    };
  }

  const rzp = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  const order = await rzp.orders.create({
    amount: toPaise(amountInr),
    currency: "INR",
    receipt,
    notes,
  });

  return {
    provider: "razorpay",
    orderId: order.id,
    amountInr,
    keyId: RAZORPAY_KEY_ID,
  };
}

/** Verify the signature returned by Razorpay Checkout after a payment. */
export function verifyCheckoutSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  if (!RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest("hex");
  // timing-safe compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
