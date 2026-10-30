import type { Listing, City, Category } from "./types";

// Shared shapes for the data layer, implemented by both the in-memory store
// (data-memory.ts) and the Supabase store (data-supabase.ts).

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
