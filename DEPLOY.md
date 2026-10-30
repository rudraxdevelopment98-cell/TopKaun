# Going live — plain-language guide

Right now TopKaun runs in **demo mode**: real website, real design, real
promote→pay flow, but with sample businesses and pretend payments, so you can
see and show it with zero setup. This guide is the path to taking real money.
You don't need to understand the code — do the steps and tell Claude when each
account exists; Claude wires it up.

Do the steps in this order. Each one is independent enough that you can pause.

## Step 0 — See it yourself (now, free)

Anyone with the code can run:

```bash
pnpm install
pnpm dev
```

and open http://localhost:3000. Nothing to pay or sign up for.

## Step 1 — Put it online (Vercel) — ~30 min, free to start

1. Push this repo to GitHub (Claude can do this).
2. Go to **vercel.com**, sign up with GitHub, click **Add New → Project**, pick
   this repo, click **Deploy**. That's it — you get a live link like
   `topkaun.vercel.app`.
3. It will already work in demo mode online.

## Step 2 — Your own domain — ~₹1,000/year

1. Buy `topkaun.in` (e.g. GoDaddy, Namecheap, or Vercel itself).
2. In Vercel → Project → **Domains**, add `topkaun.in` and follow the DNS steps.

## Step 3 — The database (Supabase) — makes data permanent

Demo mode forgets everything when the server restarts. Real money needs a real
database so listings and payments are saved forever.

1. Go to **supabase.com**, create a free project (choose a region near India,
   e.g. Singapore/Mumbai).
2. Give Claude the project URL and keys — Claude will add the database tables and
   switch the app from the in-memory store to Supabase (this is a planned,
   well-scoped change to one file, `lib/data.ts`).

## Step 4 — Payments (Razorpay) — the money

1. Create a **Razorpay** account at razorpay.com. You'll need: PAN, a bank
   account in your business name, and a website with **Terms, Privacy and
   Refund** pages — which TopKaun already has (`/terms`, `/privacy`, `/refunds`).
2. Complete Razorpay KYC. For business proof, an **Udyam (MSME) registration** as
   a sole proprietorship is the easiest start; upgrade to Pvt Ltd/LLP later.
3. Give Claude the **Key ID** and **Key Secret** (Claude adds them as Vercel
   environment variables, not in the code). Real UPI/card payments then turn on
   automatically — no code change.
4. In the Razorpay dashboard, add a **webhook** → URL
   `https://topkaun.in/api/razorpay/webhook`, event `payment.captured`, and give
   Claude the webhook secret.

## Step 5 — Before the first real rupee (do NOT skip)

- **Legal opinion.** Pay an Indian gaming/tech lawyer (~₹15k–40k) to confirm the
  "advertising, not a money game" positioning in writing. This protects you from
  the Online Gaming Act 2025. Non-negotiable.
- **Business + GST.** Register the proprietorship + Udyam, open a current
  account. Register for GST when required (turnover over ₹20L, or earlier if you
  want to issue GST invoices from day one).
- Fill the bracketed placeholders in `/terms`, `/privacy`, `/refunds` (company
  name, address, email, GSTIN, refund window).

## Step 6 — Email (invoices + "you've been outranked" alerts)

Add a transactional email provider (e.g. Resend, Brevo, or Razorpay's invoice
emails). Claude wires the "outranked" alert and GST invoice emails when you pick
one. This alert is what brings businesses back to top up — it matters.

---

### Rough costs to go fully live
- Domain: ~₹1,000/year
- Vercel + Supabase: free tier is enough at the start
- Razorpay: ~2% per transaction (taken from each payment)
- Lawyer (one-time): ~₹15k–40k
- Udyam registration: free; current account: free–₹5k

Everything else is time. The growth plan is in `docs/GO-TO-MARKET.md`.
