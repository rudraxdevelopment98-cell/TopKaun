import "server-only";
import type { Listing, BoardFilter, CityTotal } from "./types";
import type { Move, PromoteInput, PromoteResult } from "./data-types";
import { supabase } from "./supabase";
import { rankListings, cityWarTotals } from "./board";
import { slugify, monogram, MIN_INR } from "./money";

// Supabase (Postgres) implementation of the data layer. Mirrors data-memory.ts
// exactly, so lib/data.ts can swap between them. Activated when DB_LIVE is true.
// Reads fetch the (small) listings set and reuse the pure ranking helpers so the
// board ranks identically to the in-memory store. Writes are atomic via the SQL
// functions in supabase/schema.sql.

interface Row {
  slug: string;
  name: string;
  mono: string;
  tagline: string | null;
  url: string | null;
  city: Listing["city"];
  category: Listing["category"];
  total_inr: number;
  today_inr: number;
  hype: number;
  verified: boolean;
  founding: number | null;
  visits_sent: number;
  created_at: string;
}

function toListing(r: Row): Listing {
  return {
    id: r.slug,
    slug: r.slug,
    name: r.name,
    mono: r.mono,
    tagline: r.tagline ?? "",
    url: r.url ?? undefined,
    city: r.city,
    category: r.category,
    totalInr: r.total_inr,
    todayInr: r.today_inr,
    hype: r.hype,
    verified: r.verified,
    founding: r.founding ?? null,
    visitsSent: r.visits_sent,
    createdAt: r.created_at,
  };
}

async function fetchAll(): Promise<Listing[]> {
  const { data, error } = await supabase().from("listings").select("*");
  if (error) throw error;
  return (data as Row[]).map(toListing);
}

export async function getAllListings(): Promise<Listing[]> {
  return fetchAll();
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const { data, error } = await supabase().from("listings").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toListing(data as Row) : null;
}

export async function getBoard(filter: BoardFilter): Promise<Listing[]> {
  return rankListings(await fetchAll(), filter);
}

export async function getCityWar(window: "all" | "today"): Promise<CityTotal[]> {
  return cityWarTotals(await fetchAll(), window);
}

export async function getRecentMoves(limit = 6): Promise<Move[]> {
  const { data, error } = await supabase().from("moves").select("*").order("at", { ascending: false }).limit(limit);
  if (error) throw error;
  return (data as { id: number; text: string; at: string }[]).map((m) => ({ id: String(m.id), text: m.text, at: m.at }));
}

export async function getIndiaRank(slug: string): Promise<number> {
  const board = rankListings(await fetchAll(), { window: "all", city: "All India", category: "all" });
  const i = board.findIndex((l) => l.slug === slug);
  return i === -1 ? board.length + 1 : i + 1;
}

export async function applyPromotion(input: PromoteInput): Promise<PromoteResult> {
  const sb = supabase();
  const amount = Math.max(MIN_INR, Math.round(input.amountInr));
  const all = await fetchAll();
  const beforeTop = rankListings(all, { window: "all", city: "All India", category: "all" })[0];

  let slug = input.slug;
  const existing = slug ? all.find((l) => l.slug === slug) : undefined;

  if (!existing) {
    const name = input.name?.trim() || input.url?.trim() || "New business";
    slug = ensureUniqueSlug(slugify(name) || "listing", all);
    const founding = nextFoundingNumber(all);
    const { error } = await sb.from("listings").insert({
      slug,
      name,
      mono: monogram(name),
      tagline: "",
      url: input.url ?? null,
      city: input.city ?? "Ahmedabad",
      category: input.category ?? "SaaS",
      total_inr: 0,
      today_inr: 0,
      hype: 0,
      verified: false,
      founding,
      visits_sent: 0,
    });
    if (error) throw error;
  } else if (input.city || input.category) {
    await sb.from("listings").update({
      ...(input.city ? { city: input.city } : {}),
      ...(input.category ? { category: input.category } : {}),
    }).eq("slug", slug!);
  }

  // Atomic add (handles the Today reset at midnight IST inside the function).
  const { data: updated, error: rpcErr } = await sb.rpc("increment_promotion", {
    p_slug: slug!,
    p_amount: amount,
  });
  if (rpcErr) throw rpcErr;
  const listing = toListing((Array.isArray(updated) ? updated[0] : updated) as Row);

  const after = await fetchAll();
  const indiaRank =
    rankListings(after, { window: "all", city: "All India", category: "all" }).findIndex((l) => l.slug === slug) + 1;

  let tookTopFrom: string | undefined;
  if (indiaRank === 1 && beforeTop && beforeTop.slug !== slug) tookTopFrom = beforeTop.name;

  const moveText =
    indiaRank === 1 && tookTopFrom
      ? `${listing.name} took India #1 from ${tookTopFrom} with ₹${listing.totalInr.toLocaleString("en-IN")}`
      : `${listing.name} boosted its promotion by ₹${amount.toLocaleString("en-IN")}`;
  await sb.from("moves").insert({ text: moveText });

  return { listing, indiaRank, tookTopFrom };
}

export async function addHype(slug: string): Promise<Listing | null> {
  const { data, error } = await supabase().rpc("increment_hype", { p_slug: slug });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? toListing(row as Row) : null;
}

export async function addWatcher(email: string, board: string): Promise<void> {
  const { error } = await supabase().from("watchers").insert({ email, board });
  if (error) throw error;
}

// ── helpers ─────────────────────────────────────────────────────────────

function ensureUniqueSlug(base: string, all: Listing[]): string {
  const taken = new Set(all.map((l) => l.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

function nextFoundingNumber(all: Listing[]): number | null {
  const used = new Set<number>();
  for (const l of all) if (l.founding) used.add(l.founding);
  if (used.size >= 100) return null;
  for (let i = 1; i <= 100; i++) if (!used.has(i)) return i;
  return null;
}
