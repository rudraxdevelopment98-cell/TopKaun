// ── Core domain types for TopKaun ──────────────────────────────────

export const CITIES = [
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Mumbai",
  "Pune",
  "Bengaluru",
  "Delhi NCR",
  "Jaipur",
  "Indore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
] as const;
export type City = (typeof CITIES)[number];

export const CATEGORIES = [
  "SaaS",
  "Fintech",
  "AI tools",
  "D2C",
  "Edtech",
  "Creators",
  "Logistics",
  "Agritech",
  "Real estate",
  "Agencies",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type TimeWindow = "all" | "today" | "fav";

export interface Listing {
  id: string;
  slug: string;
  name: string;
  mono: string; // 2-letter avatar, e.g. "Kh"
  tagline: string;
  url?: string;
  city: City;
  category: Category;
  /** Total rupees paid toward promotion. This IS the rank. */
  totalInr: number;
  /** Rupees paid since midnight IST (drives the "Today" board). */
  todayInr: number;
  /** Free upvotes from visitors. */
  hype: number;
  verified: boolean;
  /** Founding listing number (1..100) or null. */
  founding: number | null;
  /** Visits sent to this business from TopKaun (display metric). */
  visitsSent: number;
  createdAt: string; // ISO
}

export interface BoardFilter {
  window: TimeWindow;
  city: City | "All India";
  category: Category | "all";
}

export interface PaymentEntry {
  date: string; // ISO
  did: string; // human description, e.g. "Took India #1 from NaukriFlow"
  amountInr: number;
}

export interface CityTotal {
  city: City;
  totalInr: number;
  todayInr: number;
  count: number;
}
