// ── Money + ranking helpers ─────────────────────────────────────────

/** Format rupees the Indian way: ₹18,500 */
export function inr(rupees: number): string {
  return "₹" + Math.round(rupees).toLocaleString("en-IN");
}

/** Razorpay works in paise. */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function fromPaise(paise: number): number {
  return Math.round(paise) / 100;
}

/** The minimum spend to appear on any board. */
export const MIN_INR = 199;

/** How many founding badges exist. */
export const FOUNDING_LIMIT = 100;

/**
 * What it costs to take the top spot above a given leader: ₹100 more.
 * This is the auction step that drives the live board.
 */
export const BID_STEP = 100;

export function costToBeat(topInr: number): number {
  return topInr + BID_STEP;
}

/** Short "₹4.5k" style for compact labels. */
export function inrShort(rupees: number): string {
  if (rupees >= 100000) return "₹" + (rupees / 100000).toFixed(1).replace(/\.0$/, "") + "L";
  if (rupees >= 1000) return "₹" + (rupees / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return "₹" + Math.round(rupees);
}

/** Build a URL-safe slug from a business name. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/@/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Two-letter monogram from a name, e.g. "Khaata AI" -> "Kh". */
export function monogram(name: string): string {
  const clean = name.replace(/^@/, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).replace(/[^A-Za-z0-9]/g, "").slice(0, 2);
  }
  return clean.slice(0, 2).replace(/^./, (c) => c.toUpperCase());
}
