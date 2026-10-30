"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Listing, City } from "@/lib/types";
import { cityWarTotals } from "@/lib/board";
import { inr } from "@/lib/money";

export function CityWar({ listings }: { listings: Listing[] }) {
  const [win, setWin] = useState<"all" | "today">("all");
  const [sel, setSel] = useState<City>("Ahmedabad");

  const totals = useMemo(() => cityWarTotals(listings, win).filter((t) => t.count > 0), [listings, win]);
  const max = totals[0]?.[win === "today" ? "todayInr" : "totalInr"] || 1;
  const val = (c: { totalInr: number; todayInr: number }) => (win === "today" ? c.todayInr : c.totalInr);

  const rankOf = (city: City) => totals.findIndex((t) => t.city === city) + 1;
  const selData = totals.find((t) => t.city === sel) ?? totals[0];
  const selRank = selData ? rankOf(selData.city) : 0;
  const above = totals[selRank - 2];

  const leaders = useMemo(() => {
    const key = win === "today" ? "todayInr" : "totalInr";
    const cityName = selData?.city ?? sel;
    return listings
      .filter((l) => l.city === cityName)
      .sort((a, b) => b[key] - a[key])
      .slice(0, 3);
  }, [listings, selData, sel, win]);

  const amd = totals.find((t) => t.city === "Ahmedabad");
  const srt = totals.find((t) => t.city === "Surat");
  const a = amd ? val(amd) : 0;
  const s = srt ? val(srt) : 0;
  const share = Math.round((a / ((a + s) || 1)) * 100);

  const shade = (v: number, first: boolean): [string, string] => {
    if (first) return ["var(--color-gold)", "var(--color-ink)"];
    const t = v / max;
    if (t > 0.6) return ["#8FC4AA", "#13201A"];
    if (t > 0.3) return ["#4E9A7B", "#0B2219"];
    if (t > 0.1) return ["#2C7258", "#F4F6F1"];
    return ["#1A4D3B", "#F4F6F1"];
  };

  return (
    <div style={{ background: "var(--color-forest)", color: "var(--color-panel)", minHeight: "70vh" }}>
      <div className="mx-auto px-6 pb-18 pt-11" style={{ maxWidth: 1180, paddingBottom: 72 }}>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="font-display" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(40px,6vw,64px)", lineHeight: 0.98, letterSpacing: "-0.035em" }}>
              Kaunsa shehar aage?
            </h1>
            <p style={{ margin: "12px 0 0", color: "var(--color-sage)", fontSize: 18, maxWidth: 560 }}>
              Every rupee of promotion counts for the listing&apos;s city. Tap a city to see who&apos;s carrying it.
            </p>
          </div>
          <div role="radiogroup" aria-label="Time window" className="flex gap-1 rounded-full p-1" style={{ background: "var(--color-forest-2)" }}>
            {(["all", "today"] as const).map((w) => (
              <button key={w} type="button" role="radio" aria-checked={win === w} onClick={() => setWin(w)}
                className="rounded-full px-4.5 py-2 font-semibold" style={{ padding: "8px 18px", minHeight: 40, cursor: "pointer", border: 0, background: win === w ? "var(--color-cream)" : "transparent", color: win === w ? "var(--color-forest)" : "var(--color-panel)" }}>
                {w === "all" ? "All-time" : "Today"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-10">
          <section aria-label="Cities by promotion" style={{ flex: "1 1 520px", minWidth: 0 }}>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(150px,100%),1fr))" }}>
              {totals.map((t) => {
                const rk = rankOf(t.city);
                const [bg, fg] = shade(val(t), rk === 1);
                const on = sel === t.city;
                return (
                  <button key={t.city} type="button" onClick={() => setSel(t.city)} aria-pressed={on}
                    className="flex flex-col justify-between gap-2 rounded-xl px-3 py-2.5 text-left"
                    style={{ minHeight: 78, cursor: "pointer", border: 0, background: bg, color: fg, boxShadow: on ? "0 0 0 3px var(--color-cream), 0 0 0 6px var(--color-gold)" : "none" }}>
                    <span className="flex items-baseline justify-between gap-1">
                      <span className="font-semibold" style={{ fontSize: 15, lineHeight: 1.2 }}>{t.city}</span>
                      <span className="font-display" style={{ fontWeight: 700, fontSize: 14, opacity: 0.85 }}>#{rk}</span>
                    </span>
                    <span className="font-display" style={{ fontWeight: 700, fontSize: 18 }}>{inr(val(t))}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="flex flex-col gap-6" style={{ flex: "1 1 360px", minWidth: 0 }}>
            {selData && (
              <section aria-live="polite" className="rounded-2xl p-6" style={{ background: "var(--color-cream)", color: "var(--color-ink)" }}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display" style={{ margin: 0, fontWeight: 800, fontSize: 34, letterSpacing: "-0.03em", lineHeight: 1 }}>{selData.city}</h2>
                  <span className="font-display" style={{ fontWeight: 700, fontSize: 20, color: "var(--color-gold-ink)" }}>City #{selRank}</span>
                </div>
                <p style={{ margin: "6px 0 18px", color: "var(--color-muted)" }}>
                  {inr(val(selData))} from {selData.count} listing{selData.count === 1 ? "" : "s"}.{" "}
                  {selRank === 1 ? "Leading every other city." : above ? `${inr(val(above) - val(selData) + 1)} more passes ${above.city}.` : ""}
                </p>
                <h3 className="mb-2 text-[15px] font-semibold">Carrying the city</h3>
                <ol className="m-0 list-none p-0" style={{ borderTop: "1px solid var(--color-line)" }}>
                  {leaders.map((l, i) => (
                    <li key={l.slug} className="grid items-center gap-2.5 py-2.5" style={{ gridTemplateColumns: "28px minmax(0,1fr) auto", borderBottom: "1px solid var(--color-line)" }}>
                      <span className="font-display" style={{ fontWeight: 700 }}>{i + 1}</span>
                      <Link href={`/l/${l.slug}`} className="truncate font-medium no-underline" style={{ color: "var(--color-ink)" }}>{l.name}</Link>
                      <span className="font-display" style={{ fontWeight: 700 }}>{inr(val(l))}</span>
                    </li>
                  ))}
                </ol>
                <Link href="/promote" className="mt-4.5 block rounded-xl py-3 text-center font-semibold no-underline" style={{ marginTop: 18, background: "var(--color-forest)", color: "var(--color-panel)" }}>
                  Push {selData.city} up
                </Link>
              </section>
            )}

            <section className="rounded-2xl p-5.5" style={{ padding: 22, border: "1.5px solid #2D6A53" }}>
              <h2 className="font-display" style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 22 }}>Ahmedabad vs Surat</h2>
              <p style={{ margin: "0 0 16px", color: "var(--color-sage)", fontSize: 15 }}>
                {a >= s ? `Ahmedabad leads by ${inr(a - s)}. Surat needs ${inr(a - s + 1)} to take over.` : `Surat leads by ${inr(s - a)}. Ahmedabad needs ${inr(s - a + 1)} to take over.`}
              </p>
              <div role="img" aria-label={`Ahmedabad ${inr(a)} versus Surat ${inr(s)}`} className="flex overflow-hidden rounded-lg text-sm font-semibold" style={{ height: 36 }}>
                <div className="flex items-center px-2.5" style={{ width: `${share}%`, background: "var(--color-gold)", color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden" }}>Ahmedabad {inr(a)}</div>
                <div className="flex flex-1 items-center justify-end px-2.5" style={{ background: "var(--color-cream)", color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden" }}>{inr(s)} Surat</div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
