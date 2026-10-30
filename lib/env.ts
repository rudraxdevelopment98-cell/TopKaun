// Central place for environment detection. The app runs fully in "demo" mode
// when no keys are set; adding keys flips subsystems to live with no code change.

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? "";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

/** True when real Razorpay keys are present → take real payments. */
export const PAYMENTS_LIVE = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
// Server-only. Used for all data reads/writes through the data layer. Never
// exposed to the client (only imported by server-side modules).
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when Supabase is configured on the server → use the real database. */
export const DB_LIVE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

// ── Email: Resend (https://resend.com) ─────────────────────────────────
export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "TopKaun <alerts@topkaun.in>";
/** Public base URL for links in emails. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://topkaun.in";

/** True when an email provider is configured → send real emails. */
export const EMAIL_LIVE = Boolean(RESEND_API_KEY);
