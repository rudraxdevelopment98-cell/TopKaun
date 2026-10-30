# TopKaun — project brief for Claude

If you are a Claude session picking this up, read this first. It is the memory
of the project so we continue exactly where we left off.

## What this is

**TopKaun** (tagline "India ka #1 kaun?") is a **promotion & marketing platform**
for Indian businesses, startups and creators. It is a public live leaderboard
where a business buys **promoted placement / visibility**, and the price of each
rank is set by a live auction:

> **A listing's rank = the total rupees it has paid toward its promotion.**
> To pass someone, you promote more than them. To take #1, you pay ₹100 more
> than the current #1. Minimum promotion ₹199.

Boards are sliced by **All-India**, **city**, **category**, and a **"Today"**
board that only counts promotion paid since midnight IST and resets daily.
Extra engagement: **City War** (every rupee counts for the listing's city),
free **Hype** upvotes (never affect paid rank), **watch alerts** (email when #1
changes), **founding badges** (first 100 listings), shareable **"#1 on TopKaun"**
cards and an embeddable badge.

The founder (owner of this repo) is based in **Ahmedabad**, is a first-time,
**non-technical** entrepreneur, and has asked Claude to lead the build and make
the calls. Explain things plainly; don't assume coding knowledge.

## ⚠️ The legal framing — never break this

India's **Promotion and Regulation of Online Gaming Act, 2025** bans "online
money games" (pay a stake hoping for monetary *or other* enrichment). TopKaun
stays clearly OUTSIDE that because it is **advertising/promotion**: the buyer
pays for a **definite service** (placement + visibility + badge) delivered
immediately, and **never wins money or a convertible prize back**.

To keep it that way, in all copy, UI, invoices and docs:
- **Use:** promotion, advertising, placement, visibility, boost, spend, listing.
- **Never use:** bet, stake, gamble, wager, prize, jackpot, winnings, deposit,
  "win money" — except as explicit negations (e.g. "this is not gambling").
- Always keep the disclosure that **rank = promotion paid, NOT a measure of
  quality** (protects against ASCI misleading-"#1"-claim rules).
- Before taking real money: the founder should get a one-time legal opinion from
  an Indian gaming/tech lawyer. This is noted in docs/ and is non-negotiable.

Full market research, economics, and legal reasoning: see the chat where this
was built, and `docs/GO-TO-MARKET.md`.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** + **Tailwind v4**.
- **Razorpay** for payments (UPI/card/netbanking) — `lib/payments.ts`.
- **Supabase** (Postgres) planned for the live database — not wired yet.
- Deploy target: **Vercel**. Package manager: **pnpm**.

## How it's built (architecture)

- `lib/types.ts` — domain types, `CITIES`, `CATEGORIES`.
- `lib/money.ts` — INR formatting, `MIN_INR` (199), `BID_STEP` (100), `costToBeat`,
  `slugify`, `monogram`, paise conversion.
- `lib/board.ts` — **pure** ranking helpers (`rankListings`, `cityWarTotals`,
  `rowAmount`), shared by server and the client board so they rank identically.
- `lib/seed.ts` — sample listings carried from the original prototype.
- `lib/data.ts` — **the data layer router**. Routes every call to the Supabase
  store when `DB_LIVE`, else the in-memory demo store. Async API: `getAllListings`,
  `getBoard`, `getListingBySlug`, `getCityWar`, `getRecentMoves`, `getIndiaRank`,
  `applyPromotion` (call ONLY after payment verified), `addHype`, `addWatcher`.
  - `lib/data-memory.ts` — in-memory demo store (seeded, on `globalThis`).
  - `lib/data-supabase.ts` — Postgres store (same API). Reads reuse the pure
    ranking helpers; writes are atomic via SQL functions.
  - `lib/data-types.ts` — shared shapes for both stores.
  - `lib/supabase.ts` — server-only client (service-role key).
  - `supabase/schema.sql` — tables + atomic functions + RLS. Run once in Supabase.
- `app/api/badge/[slug]` — live SVG rank badge a business embeds on its own site.
- `app/opengraph-image.tsx` + `app/l/[slug]/opengraph-image.tsx` — dynamic social
  share cards (use "Rs", not ₹, because the image font lacks the ₹ glyph).
- `lib/env.ts` — detects keys: `PAYMENTS_LIVE`, `DB_LIVE` (needs URL +
  `SUPABASE_SERVICE_ROLE_KEY`).
- `lib/payments.ts` — `createPromotionOrder` (mock when no keys, else Razorpay
  order), `verifyCheckoutSignature`.
- API routes in `app/api/`: `promote/order`, `promote/confirm`, `hype`, `watch`,
  `razorpay/webhook` (server-to-server source of truth for live payments).
- Pages: `app/page.tsx` (board), `app/promote` (claim/pay flow),
  `app/l/[slug]` (listing), `app/cities` (City War), plus `rules`, `terms`,
  `privacy`, `refunds`.
- Components: `Board.tsx`, `PromoteFlow.tsx`, `CityWar.tsx`, `ListingActions.tsx`,
  `SiteHeader.tsx`, `SiteFooter.tsx`, `brand.tsx`.
- Design system is in `app/globals.css` (`@theme` tokens) — colours and fonts
  from the original prototype (deep forest green, gold, cream; Bricolage
  Grotesque display + Hind body).

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000 — demo mode, no keys needed
pnpm build      # production build + typecheck + lint (keep this clean)
```

## Status

**Done:** full working MVP on sample data — board + filters + live scoreboard,
promote→pay→ranked loop (mock payments), listing pages, City War, hype, watch,
all legal pages, dynamic social **share cards** + an embeddable live **rank
badge**. The **Supabase data layer is written and wired** (activates on keys +
schema), and **Razorpay** activates on keys. Production build is clean.

**Next milestones (in order):** see `DEPLOY.md` and `docs/GO-TO-MARKET.md`.
1. Deploy to Vercel (needs the founder's Vercel account — then free & instant).
2. Supabase: create project, run `supabase/schema.sql`, add URL +
   `SUPABASE_SERVICE_ROLE_KEY`. The code switches to Postgres automatically.
   NOTE: the Supabase store is written but UNTESTED against a real DB — test the
   promote/hype/watch loop once keys exist.
3. Razorpay live keys + webhook; transactional email for invoices + "outranked"
   alerts (provider not chosen yet).
4. Domain `topkaun.in`. Legal opinion + entity/GST + the Ahmedabad seeding playbook.

## Working rules for this repo

- Develop on the branch the founder's task specifies; commit with clear messages.
- Keep the build warning-free. Match the existing code style.
- Never add bet/gamble/prize framing (see legal section above).
- Don't invent stats or testimonials; use bracketed placeholders for unknowns.
