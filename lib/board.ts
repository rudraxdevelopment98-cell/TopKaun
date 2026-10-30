import type { Listing, BoardFilter, CityTotal, City } from "./types";
import { CITIES } from "./types";

// Pure ranking helpers — no store access — so the server (data layer) and the
// live client board rank identically from the same code.

export function rankListings(listings: Listing[], filter: BoardFilter): Listing[] {
  let list = listings.filter(
    (l) =>
      (filter.city === "All India" || l.city === filter.city) &&
      (filter.category === "all" || l.category === filter.category),
  );

  if (filter.window === "today") {
    list = list.filter((l) => l.todayInr > 0).sort((a, b) => b.todayInr - a.todayInr);
  } else if (filter.window === "fav") {
    list = [...list].sort((a, b) => b.hype - a.hype);
  } else {
    list = [...list].sort((a, b) => b.totalInr - a.totalInr);
  }
  return list;
}

export function cityWarTotals(
  listings: Listing[],
  window: "all" | "today",
): CityTotal[] {
  const totals = new Map<City, CityTotal>();
  for (const c of CITIES) totals.set(c, { city: c, totalInr: 0, todayInr: 0, count: 0 });
  for (const l of listings) {
    const t = totals.get(l.city);
    if (!t) continue;
    t.totalInr += l.totalInr;
    t.todayInr += l.todayInr;
    t.count += 1;
  }
  return [...totals.values()].sort((a, b) =>
    window === "today" ? b.todayInr - a.todayInr : b.totalInr - a.totalInr,
  );
}

/** Amount shown on a board row for the active window. */
export function rowAmount(l: Listing, window: BoardFilter["window"]): number {
  return window === "today" ? l.todayInr : l.totalInr;
}
