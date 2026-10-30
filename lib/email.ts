import "server-only";
import { RESEND_API_KEY, EMAIL_FROM, EMAIL_LIVE } from "./env";

// Transactional email, provider-agnostic. In demo mode (no RESEND_API_KEY) it
// logs instead of sending, so the flow is testable with no account. Set
// RESEND_API_KEY to send for real via Resend (https://resend.com) — swapping to
// another provider means changing only this file.

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<void> {
  if (!EMAIL_LIVE) {
    console.log(`[email:demo] to=${to} · ${subject}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text }),
  });
  if (!res.ok) {
    throw new Error(`Email send failed (${res.status})`);
  }
}

/** "Someone just took the board you're watching — come back and reclaim it." */
export async function sendOutrankedAlert(
  to: string,
  p: { board: string; newLeader: string; previousLeader: string; amountInr: number; siteUrl: string },
): Promise<void> {
  const subject = `${p.newLeader} just took ${p.board} #1 on TopKaun`;
  const amount = "₹" + p.amountInr.toLocaleString("en-IN");
  const html = `<!doctype html><html><body style="margin:0;background:#f1f3ee;font-family:Arial,Helvetica,sans-serif;color:#13201a">
  <div style="max-width:520px;margin:0 auto;padding:24px">
    <div style="background:#0e3a2b;color:#f4f6f1;border-radius:16px;border-bottom:6px solid #ffae1a;padding:28px">
      <div style="font-weight:800;font-size:20px">TopKaun</div>
      <h1 style="margin:16px 0 6px;font-size:26px;line-height:1.2">${esc(p.newLeader)} is now ${esc(p.board)} #1</h1>
      <p style="margin:0;color:#c9d6ce">They passed ${esc(p.previousLeader)} with ${amount} of promotion.</p>
      <a href="${esc(p.siteUrl)}/promote" style="display:inline-block;margin-top:20px;background:#ffae1a;color:#13201a;text-decoration:none;font-weight:700;border-radius:999px;padding:12px 22px">Reclaim your #1</a>
    </div>
    <p style="font-size:12px;color:#56645c;margin-top:16px">Rank = promotion paid, not a measure of quality. You're getting this because you asked to watch ${esc(p.board)} #1. Reply to stop.</p>
  </div></body></html>`;
  const text = `${p.newLeader} is now ${p.board} #1 on TopKaun, passing ${p.previousLeader} with ${amount}. Reclaim your spot: ${p.siteUrl}/promote`;
  return sendEmail(to, subject, html, text);
}

function esc(s: string): string {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string));
}
