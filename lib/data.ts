import type {
  Listing,
  BoardFilter,
  CityTotal,
  City,
  Category,
} from "./types";
import { buildSeedListings } from "./seed";
import { rankListings, cityWarTotals } from "./board";
import { slugify, monogram, MIN_INR } from "./money";

// ──────────────────────────────────────────────────────────────────────
// Data layer.
//
// Today this is an in-memory store seeded from the prototype's sample data,
// so the whole app runs and is clickable with NO database and NO keys.
// It is intentionally behind a small async API so the production swap to
// Supabase (Postgres) is a drop-in replacement of this one file.
//
// NOTE: in-memory state resets when the server restarts and is NOT shared
// across serverless instances — fine for local dev and demos, not for real
// money. The Supabase milestone replaces the store below.
// ──────────────────────────────────────────────────────────────────────

export interface Move {
  id: string;
  text: string;
  at: string; // ISO
}

export interface Watcher {
  email: string;
  board: string;
  at: string;
}

interface Store {
  listings: Map<string, Listing>;
  moves: Move[];
  watchers: Watcher[];
}

// Survive hot-reloads in dev by stashing the store on globalThis.
const g = globalThis as unknown as { __tk_store?: Store };

function freshStore(): Store {
  const listings = new Map<string, Listing>();
  for (const l of buildSeedListings()) listings.set(l.slug, l);
  return {
    listings,
    moves: [
      { id: "m1", text: "ChaiStack took Surat #1 with ₹6,100", at: iso(-2 * 60) },
      { id: "m2", text: "Khaata AI added ₹2,000 to its promotion", at: iso(-18 * 60) },
      { id: "m3", text: "MandiLive joined the board at #10", at: iso(-41 * 60) },
      { id: "m4", text: "VidyaBot got verified", at: iso(-60 * 60) },
    ],
    watchers: [],
  };
}

function iso(secondsFromNow: number): string {
  return new Date(Date.now() + secondsFromNow * 1000).toISOString();
}

function store(): Store {
  if (!g.__tk_store) g.__tk_store = freshStore();
  return g.__tk_store;
}

// ── Reads ───────────────────────────────────────────────────────────────

export async function getAllListings(): Promise<Listing[]> {
  return [...store().listings.values()];
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  return store().listings.get(slug) ?? null;
}

/** Rank a board for the given filter (window + city + category). */
export async function getBoard(filter: BoardFilter): Promise<Listing[]> {
  return rankListings([...store().listings.values()], filter);
}

/** Total promotion by city, for the City War. */
export async function getCityWar(window: "all" | "today"): Promise<CityTotal[]> {
  return cityWarTotals([...store().listings.values()], window);
}

export async function getRecentMoves(limit = 6): Promise<Move[]> {
  return store().moves.slice(0, limit);
}

/** 1-based rank of a listing on the All-India all-time board. */
export async function getIndiaRank(slug: string): Promise<number> {
  const board = await getBoard({ window: "all", city: "All India", category: "all" });
  const i = board.findIndex((l) => l.slug === slug);
  return i === -1 ? board.length + 1 : i + 1;
}

// ── Writes ───────────────────────────────────────────────────────────────

export interface PromoteInput {
  slug?: string; // existing listing
  // for a brand new listing:
  name?: string;
  url?: string;
  city?: City;
  category?: Category;
  amountInr: number;
}

export interface PromoteResult {
  listing: Listing;
  indiaRank: number;
  tookTopFrom?: string;
}

/**
 * Apply a confirmed promotion payment: add the amount to the listing's total
 * (creating the listing if it's new), bump the "Today" board, and log a move.
 * Call this only AFTER payment is verified.
 */
export async function applyPromotion(input: PromoteInput): Promise<PromoteResult> {
  const s = store();
  const amount = Math.max(MIN_INR, Math.round(input.amountInr));

  let listing: Listing | undefined = input.slug ? s.listings.get(input.slug) : undefined;

  if (!listing) {
    const name = input.name?.trim() || input.url?.trim() || "New business";
    const slug = ensureUniqueSlug(slugify(name) || "listing", s);
    const foundingNo = nextFoundingNumber(s);
    listing = {
      id: slug,
      slug,
      name,
      mono: monogram(name),
      tagline: "",
      url: input.url,
      city: input.city ?? "Ahmedabad",
      category: input.category ?? "SaaS",
      totalInr: 0,
      todayInr: 0,
      hype: 0,
      verified: false,
      founding: foundingNo,
      visitsSent: 0,
      createdAt: new Date().toISOString(),
    };
    s.listings.set(slug, listing);
  }

  // Who holds India #1 right now (before this payment)?
  const beforeTop = (await getBoard({ window: "all", city: "All India", category: "all" }))[0];

  listing.totalInr += amount;
  listing.todayInr += amount;
  if (input.city) listing.city = input.city;
  if (input.category) listing.category = input.category;

  const indiaRank = await getIndiaRank(listing.slug);
  let tookTopFrom: string | undefined;
  if (indiaRank === 1 && beforeTop && beforeTop.slug !== listing.slug) {
    tookTopFrom = beforeTop.name;
  }

  const moveText =
    indiaRank === 1 && tookTopFrom
      ? `${listing.name} took India #1 from ${tookTopFrom} with ₹${listing.totalInr.toLocaleString("en-IN")}`
      : `${listing.name} boosted its promotion by ₹${amount.toLocaleString("en-IN")}`;
  s.moves.unshift({ id: "m" + Date.now(), text: moveText, at: new Date().toISOString() });
  s.moves = s.moves.slice(0, 12);

  return { listing, indiaRank, tookTopFrom };
}

export async function addHype(slug: string): Promise<Listing | null> {
  const l = store().listings.get(slug);
  if (!l) return null;
  l.hype += 1;
  return l;
}

export async function addWatcher(email: string, board: string): Promise<void> {
  store().watchers.push({ email, board, at: new Date().toISOString() });
}

// ── helpers ─────────────────────────────────────────────────────────────

function ensureUniqueSlug(base: string, s: Store): string {
  if (!s.listings.has(base)) return base;
  let n = 2;
  while (s.listings.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

function nextFoundingNumber(s: Store): number | null {
  const used = new Set<number>();
  for (const l of s.listings.values()) if (l.founding) used.add(l.founding);
  if (used.size >= 100) return null;
  for (let i = 1; i <= 100; i++) if (!used.has(i)) return i;
  return null;
}
