"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Listing, TimeWindow, City, Category } from "@/lib/types";
import { CITIES, CATEGORIES } from "@/lib/types";
import { rankListings, cityWarTotals, rowAmount } from "@/lib/board";
import { inr, costToBeat } from "@/lib/money";
import { CrownMark, VerifiedTick } from "./brand";

type Move = { id: string; text: string };

export function Board({
  initialListings,
  moves,
  foundingTaken,
}: {
  initialListings: Listing[];
  moves: Move[];
  foundingTaken: number;
}) {
  const [listings, setListings] = useState(initialListings);
  const [win, setWin] = useState<TimeWindow>("all");
  const [city, setCity] = useState<City | "All India">("All India");
  const [cat, setCat] = useState<Category | "all">("all");
  const [tick, setTick] = useState(0);
  const [watched, setWatched] = useState(false);
  const [email, setEmail] = useState("");
  const [hyped, setHyped] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 4500);
    return () => clearInterval(t);
  }, []);

  const rows = useMemo(
    () => rankListings(listings, { window: win, city, category: cat }),
    [listings, win, city, cat],
  );
  const overall = useMemo(
    () => rankListings(listings, { window: "all", city: "All India", category: "all" }),
    [listings],
  );
  const top = overall[0];
  const chasers = overall.slice(1, 5);
  const war = useMemo(() => cityWarTotals(listings, "all").slice(0, 5), [listings]);
  const warMax = war[0]?.totalInr || 1;
  const latest = moves.length ? moves[tick % moves.length].text : "";

  const place = city === "All India" ? "India" : city;
  const catLabel = cat === "all" ? "" : " " + cat;
  const watchName = `${place}${catLabel} #1`;

  async function hype(slug: string) {
    if (hyped[slug]) return;
    setHyped((h) => ({ ...h, [slug]: true }));
    setListings((ls) => ls.map((l) => (l.slug === slug ? { ...l, hype: l.hype + 1 } : l)));
    try {
      await fetch("/api/hype", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
    } catch {}
  }

  async function watch() {
    if (!email) return;
    setWatched(true);
    try {
      await fetch("/api/watch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, board: watchName }),
      });
    } catch {}
  }

  return (
    <>
      {/* ── Hero: the live scoreboard ───────────────────────────────── */}
      <section
        id="top"
        style={{
          background: "var(--color-forest)",
          color: "var(--color-panel)",
          borderBottom: "6px solid var(--color-gold)",
        }}
      >
        <div className="mx-auto flex flex-wrap gap-12 px-6 pt-10" style={{ maxWidth: 1240 }}>
          <div style={{ flex: "999 1 560px", minWidth: 0 }}>
            <h1
              className="font-display"
              style={{ margin: 0, fontWeight: 800, fontSize: "clamp(40px,6vw,68px)", lineHeight: 0.98, letterSpacing: "-0.035em" }}
            >
              India ka #1 kaun?
            </h1>
            <p style={{ margin: "14px 0 8px", color: "var(--color-sage)", fontSize: 18, maxWidth: 540 }}>
              The live promotion board for Indian businesses. Your rank is the
              visibility you&apos;ve paid for — no ads, no algorithm, no favourites.
            </p>

            {top && (
              <>
                <div className="mb-4 flex items-center gap-3.5">
                  <div
                    className="font-display flex items-center justify-center"
                    style={{ width: 52, height: 52, borderRadius: 12, background: "var(--color-gold)", color: "var(--color-forest)", fontWeight: 800, fontSize: 20 }}
                  >
                    {top.mono}
                  </div>
                  <div className="anim-rise" key={tick}>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 26, lineHeight: 1.1 }}>
                      {top.name}
                    </div>
                    <div style={{ color: "var(--color-sage)", fontSize: 15 }}>
                      {top.city}, {top.category} · Holding India #1
                    </div>
                  </div>
                </div>

                <DigitBoard text={inr(top.totalInr)} tick={tick} />

                <div
                  className="mt-7 flex flex-wrap gap-2 rounded-2xl p-1.5"
                  style={{ background: "var(--color-cream)", maxWidth: 620 }}
                >
                  <div className="flex flex-1 items-center px-3" style={{ minWidth: 200, color: "var(--color-muted)", fontSize: 17 }}>
                    Paste your website or @handle
                  </div>
                  <Link
                    href="/promote"
                    className="rounded-xl px-5 py-3.5 font-semibold no-underline"
                    style={{ background: "var(--color-ink)", color: "var(--color-cream)", whiteSpace: "nowrap" }}
                  >
                    Take #1 for {inr(costToBeat(top.totalInr))}
                  </Link>
                </div>
                <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--color-sage)" }}>
                  Or start from ₹199 on any board. Pay by UPI, GST invoice by email.
                </p>
              </>
            )}
          </div>

          <div style={{ flex: "1 1 340px", minWidth: 0, alignSelf: "flex-end" }}>
            <h2 className="font-display" style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600, color: "var(--color-sage)" }}>
              Chasing them
            </h2>
            <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
              {chasers.map((c, i) => (
                <li
                  key={c.slug}
                  className="grid items-center gap-3 rounded-lg p-2.5"
                  style={{ gridTemplateColumns: "40px minmax(0,1fr) auto", background: "var(--color-forest-2)" }}
                >
                  <span
                    className="font-display flex items-center justify-center"
                    style={{ height: 40, borderRadius: 5, background: "var(--color-forest)", fontWeight: 700, fontSize: 20 }}
                  >
                    {i + 2}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="block truncate font-semibold">{c.name}</span>
                    <span className="block text-[13px]" style={{ color: "var(--color-sage-2)" }}>{c.city}</span>
                  </span>
                  <span className="text-right">
                    <span className="font-display block" style={{ fontWeight: 700, fontSize: 19 }}>{inr(c.totalInr)}</span>
                    <span className="block text-[13px]" style={{ color: "var(--color-gold-2)" }}>
                      {inr(top.totalInr - c.totalInr)} behind
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div
          className="mx-auto mt-7 flex items-center gap-3 px-6 py-3.5 text-[15px]"
          style={{ maxWidth: 1240, borderTop: "1px solid var(--color-forest-line)" }}
        >
          <span className="anim-live" aria-hidden style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-gold)", flexShrink: 0 }} />
          <span aria-live="polite" className="anim-rise" key={tick} style={{ color: "#E3EAE5" }}>
            <strong style={{ fontWeight: 600, color: "var(--color-panel)" }}>Just now:</strong> {latest}
          </span>
        </div>
      </section>

      {/* ── The board ───────────────────────────────────────────────── */}
      <main className="mx-auto flex flex-wrap items-start gap-12 px-6 pb-18 pt-12" style={{ maxWidth: 1240, paddingBottom: 72 }}>
        <section style={{ flex: "999 1 620px", minWidth: 0 }}>
          <h2 className="font-display" style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 32, letterSpacing: "-0.02em" }}>
            The board
          </h2>

          <p className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1.5" style={{ fontSize: 19, lineHeight: 2.1 }}>
            <span>Showing the</span>
            <Select value={win} onChange={(v) => setWin(v as TimeWindow)} options={[["all", "all-time"], ["today", "today's"], ["fav", "people's favourite"]]} label="Time window" />
            <span>board for</span>
            <Select value={city} onChange={(v) => setCity(v as City | "All India")} options={[["All India", "All India"], ...CITIES.map((c) => [c, c] as [string, string])]} label="City" />
            <span>in</span>
            <Select value={cat} onChange={(v) => setCat(v as Category | "all")} options={[["all", "every category"], ...CATEGORIES.map((c) => [c, c] as [string, string])]} label="Category" />
          </p>

          {rows.length > 0 ? (
            <ol className="m-0 list-none p-0" style={{ borderTop: "2px solid var(--color-ink)" }}>
              {rows.map((r, i) => {
                const first = i === 0 && win !== "fav";
                return (
                  <li
                    key={r.slug}
                    className="grid items-center gap-3.5 px-2 py-3.5"
                    style={{
                      gridTemplateColumns: "44px 44px minmax(0,1fr) auto auto auto",
                      borderBottom: "1px solid var(--color-line)",
                      background: first ? "#FFF4DC" : undefined,
                    }}
                  >
                    <span className="font-display text-center" style={{ fontWeight: 700, fontSize: 22, color: first ? "var(--color-gold-ink)" : "var(--color-ink)" }}>
                      {win === "fav" ? "" : i + 1}
                    </span>
                    <span className="font-display flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 10, background: "#DDE4DC", fontWeight: 700, fontSize: 15, color: "var(--color-forest)" }}>
                      {r.mono}
                    </span>
                    <Link href={`/l/${r.slug}`} className="min-w-0 no-underline">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold" style={{ fontSize: 17 }}>{r.name}</span>
                        {r.verified && <VerifiedTick />}
                      </span>
                      <span className="block truncate text-sm" style={{ color: "var(--color-muted)" }}>{r.city}, {r.category}</span>
                    </Link>
                    <span className="hidden text-sm md:block" style={{ color: "var(--color-muted)", whiteSpace: "nowrap" }}>{r.city}</span>
                    <button
                      type="button"
                      onClick={() => hype(r.slug)}
                      aria-pressed={!!hyped[r.slug]}
                      aria-label={`Hype ${r.name}`}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium"
                      style={{
                        border: `1.5px solid ${hyped[r.slug] ? "var(--color-forest)" : "var(--color-line-2)"}`,
                        background: hyped[r.slug] ? "var(--color-forest)" : "transparent",
                        color: hyped[r.slug] ? "var(--color-panel)" : "var(--color-ink)",
                        cursor: "pointer",
                        minHeight: 36,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden style={{ fill: "none", stroke: "currentColor", strokeWidth: 2.5 }}>
                        <path d="M5 15l7-7 7 7" />
                      </svg>
                      {r.hype}
                    </button>
                    <span className="font-display text-right" style={{ fontWeight: 700, fontSize: 20, minWidth: 96 }}>
                      {inr(rowAmount(r, win))}
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="rounded-2xl bg-white px-7 py-10 text-center" style={{ border: "2px dashed #9DB0A4" }}>
              <CrownMark size={44} />
              <h3 className="font-display" style={{ margin: "8px 0 6px", fontSize: 26, letterSpacing: "-0.02em" }}>
                #1 in {place}{catLabel} is empty
              </h3>
              <p style={{ margin: "0 0 20px", color: "var(--color-muted)" }}>
                Be the first business here. Whoever promotes first holds #1 until someone pays more.
              </p>
              <Link href="/promote" className="inline-block rounded-full px-5 py-3 font-semibold no-underline" style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}>
                Take #1 for ₹199
              </Link>
            </div>
          )}
        </section>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className="flex flex-col gap-10" style={{ flex: "1 1 320px", minWidth: 0 }}>
          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display" style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>City war</h2>
              <Link href="/cities" className="text-sm font-medium">See all cities</Link>
            </div>
            <p style={{ margin: "4px 0 16px", fontSize: 14, color: "var(--color-muted)" }}>
              Every rupee of promotion counts for its city.
            </p>
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {war.map((w, i) => (
                <li key={w.city}>
                  <div className="flex justify-between text-[15px]">
                    <span className="font-semibold">{w.city}</span>
                    <span className="font-display" style={{ fontWeight: 600 }}>{inr(w.totalInr)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full" style={{ background: "#DDE4DC" }}>
                    <div style={{ height: "100%", borderRadius: 999, width: `${Math.round((w.totalInr / warMax) * 100)}%`, background: i === 0 ? "var(--color-gold)" : "var(--color-forest)" }} />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display mb-3" style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 22 }}>Recent moves</h2>
            <ol className="m-0 list-none p-0">
              {moves.slice(0, 5).map((m) => (
                <li key={m.id} className="py-2.5 text-[15px]" style={{ borderTop: "1px solid var(--color-line)", lineHeight: 1.4 }}>
                  {m.text}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl bg-white p-5.5" style={{ padding: 22 }}>
            <h2 className="font-display" style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 20 }}>Watch {watchName}</h2>
            <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--color-muted)" }}>
              We&apos;ll email you when #1 changes. One email a day at most.
            </p>
            {!watched ? (
              <>
                <label htmlFor="watch" className="text-sm font-medium">Email</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="watch"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 rounded-xl px-3 py-2.5"
                    style={{ border: "1.5px solid var(--color-line-2)" }}
                  />
                  <button type="button" onClick={watch} className="rounded-xl px-4 py-2.5 font-semibold" style={{ border: 0, background: "var(--color-forest)", color: "var(--color-panel)", cursor: "pointer" }}>
                    Watch
                  </button>
                </div>
              </>
            ) : (
              <p className="m-0 rounded-xl p-3 font-medium" style={{ background: "#E5F0EA", color: "var(--color-forest)" }}>
                Check your inbox and confirm to start alerts.
              </p>
            )}
          </section>

          <p style={{ margin: 0, fontSize: 15, color: "var(--color-muted)" }}>
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>{foundingTaken} of 100</strong> founding spots taken.
            The first 100 paid listings keep a founding badge for good.
          </p>
        </aside>
      </main>
    </>
  );
}

// ── The flip-digit scoreboard number ──────────────────────────────────
function DigitBoard({ text, tick }: { text: string; tick: number }) {
  return (
    <div role="img" aria-label={`India number one with ${text} of promotion`} className="flex items-stretch gap-1.5">
      {text.split("").map((ch, i) => {
        const digit = /[0-9]/.test(ch);
        const comma = ch === ",";
        const w = comma ? "clamp(10px,2vw,18px)" : digit ? "clamp(34px,8vw,58px)" : "clamp(28px,6vw,44px)";
        return (
          <span
            key={i}
            className={digit && tick > 0 ? "anim-flip font-display" : "font-display"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: w,
              height: "clamp(54px,13vw,88px)",
              borderRadius: 6,
              fontWeight: 700,
              fontSize: "clamp(40px,10vw,68px)",
              lineHeight: 1,
              animationDelay: `${i * 45}ms`,
              ...(digit
                ? { background: "var(--color-forest-3)", color: "var(--color-cream)", boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.28)" }
                : { background: "transparent", color: "var(--color-gold)" }),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

// ── Inline select that reads like a sentence ───────────────────────────
function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  label: string;
}) {
  return (
    <>
      <label htmlFor={`sel-${label}`} className="sr-only">{label}</label>
      <select
        id={`sel-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-semibold"
        style={{
          font: "inherit",
          fontWeight: 600,
          color: "var(--color-forest)",
          background: "var(--color-panel)",
          border: "1.5px solid var(--color-forest)",
          borderRadius: 8,
          padding: "2px 8px",
          cursor: "pointer",
        }}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </>
  );
}
