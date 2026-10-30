import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ListingActions } from "@/components/ListingActions";
import { CrownMark } from "@/components/brand";
import { getAllListings, getListingBySlug } from "@/lib/data";
import { rankListings } from "@/lib/board";
import { inr, costToBeat } from "@/lib/money";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) return { title: "Listing — TopKaun" };
  return {
    title: `${l.name} — TopKaun`,
    description: `${l.name}: ${l.tagline || l.category + " in " + l.city}. ${inr(l.totalInr)} of promotion on TopKaun.`,
  };
}

function rankOf(list: { slug: string }[], slug: string): number {
  const i = list.findIndex((l) => l.slug === slug);
  return i === -1 ? list.length + 1 : i + 1;
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [listing, all] = await Promise.all([getListingBySlug(slug), getAllListings()]);
  if (!listing) notFound();

  const indiaBoard = rankListings(all, { window: "all", city: "All India", category: "all" });
  const cityBoard = rankListings(all, { window: "all", city: listing.city, category: "all" });
  const catBoard = rankListings(all, { window: "all", city: "All India", category: listing.category });

  const indiaRank = rankOf(indiaBoard, slug);
  const cityRank = rankOf(cityBoard, slug);
  const catRank = rankOf(catBoard, slug);
  const topInr = indiaBoard[0]?.totalInr ?? listing.totalInr;
  const aheadOf = indiaBoard[indiaRank]?.totalInr; // the one just below

  const plates: { board: string; rank: string; note: string; gold: boolean }[] = [
    { board: "India", rank: `#${indiaRank}`, note: indiaRank === 1 ? `${inr(topInr - (indiaBoard[1]?.totalInr ?? 0))} ahead of #2` : `${inr(topInr - listing.totalInr + 1)} to reach #1`, gold: indiaRank === 1 },
    { board: listing.city, rank: `#${cityRank}`, note: cityRank === 1 ? "Leads its city" : "City board", gold: cityRank === 1 },
    { board: listing.category, rank: `#${catRank}`, note: catRank === 1 ? "Leads its category" : "Category board", gold: catRank === 1 },
  ];

  return (
    <>
      <SiteHeader />

      <section style={{ background: "var(--color-forest)", color: "var(--color-panel)", borderBottom: "6px solid var(--color-gold)" }}>
        <div className="mx-auto flex flex-wrap items-end gap-9 px-6 pb-10 pt-9" style={{ maxWidth: 1160 }}>
          <div className="flex flex-wrap items-start gap-5" style={{ flex: "999 1 520px", minWidth: 0 }}>
            <div className="font-display flex items-center justify-center" style={{ width: 96, height: 96, borderRadius: 22, background: "var(--color-gold)", color: "var(--color-forest)", fontWeight: 800, fontSize: 38, flexShrink: 0 }}>
              {listing.mono}
            </div>
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5" style={{ background: "var(--color-forest-2)" }}>
                  <CrownMark size={14} /> India #{indiaRank}
                </span>
                {listing.verified && <span className="rounded-full px-3 py-0.5" style={{ background: "var(--color-forest-2)" }}>Verified owner</span>}
                {listing.founding && <span className="rounded-full px-3 py-0.5" style={{ background: "var(--color-forest-2)" }}>Founding listing {listing.founding}</span>}
              </div>
              <h1 className="font-display" style={{ margin: "14px 0 6px", fontWeight: 800, fontSize: "clamp(38px,5vw,56px)", lineHeight: 1, letterSpacing: "-0.035em" }}>{listing.name}</h1>
              <p style={{ margin: 0, color: "var(--color-sage)", fontSize: 18, maxWidth: 520 }}>{listing.tagline || `${listing.category} · ${listing.city}`}</p>
              <div className="mt-5.5 flex flex-wrap gap-2.5" style={{ marginTop: 22 }}>
                {listing.url && (
                  <a href={`https://${listing.url.replace(/^https?:\/\//, "")}`} rel="sponsored noopener" target="_blank" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold no-underline" style={{ background: "var(--color-cream)", color: "var(--color-forest)" }}>
                    Visit {listing.url.replace(/^https?:\/\//, "")}
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden style={{ fill: "none", stroke: "currentColor", strokeWidth: 2.4 }}><path d="M7 17L17 7M9 7h8v8" /></svg>
                  </a>
                )}
                <ListingActions slug={listing.slug} hype={listing.hype} />
              </div>
            </div>
          </div>
          <div style={{ flex: "1 1 240px", textAlign: "right" }}>
            <div className="text-sm" style={{ color: "var(--color-sage)" }}>Promotion paid in total</div>
            <div className="font-display" style={{ fontWeight: 800, fontSize: "clamp(40px,6vw,56px)", lineHeight: 1, marginTop: 6 }}>{inr(listing.totalInr)}</div>
            <div className="mt-2.5 text-sm" style={{ color: "var(--color-sage)" }}>{listing.visitsSent.toLocaleString("en-IN")} visits sent from TopKaun</div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex flex-col gap-14 px-6 pb-18 pt-11" style={{ maxWidth: 1160, paddingBottom: 72 }}>
        <section>
          <h2 className="font-display" style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em" }}>Where it stands</h2>
          <p style={{ margin: "0 0 20px", color: "var(--color-muted)" }}>Rank is the promotion paid toward this listing — not a measure of quality.</p>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px,100%),1fr))" }}>
            {plates.map((p) => (
              <div key={p.board} className="rounded-2xl px-4.5 py-4" style={{ padding: 18, background: p.gold ? "var(--color-forest)" : "var(--color-panel)", color: p.gold ? "var(--color-panel)" : "var(--color-ink)", border: p.gold ? "2px solid var(--color-gold)" : "1px solid var(--color-line)" }}>
                <span className="block text-[15px]" style={{ opacity: 0.85 }}>{p.board}</span>
                <span className="font-display block" style={{ fontWeight: 800, fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.03em" }}>{p.rank}</span>
                <span className="block text-sm" style={{ opacity: 0.85 }}>{p.note}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4" style={{ border: "1px solid var(--color-line)" }}>
            <p className="m-0" style={{ fontSize: 17, maxWidth: 640 }}>
              {indiaRank === 1
                ? `${listing.name} holds India #1 with ${inr(listing.totalInr)}. Taking it costs ${inr(costToBeat(listing.totalInr))}.`
                : `Reaching India #1 from here costs ${inr(costToBeat(topInr))}.`}
            </p>
            <Link href="/promote" className="rounded-full px-5 py-2.5 font-semibold no-underline" style={{ background: "var(--color-forest)", color: "var(--color-panel)", whiteSpace: "nowrap" }}>
              {indiaRank === 1 ? "Top up your lead" : "Take India #1"}
            </Link>
          </div>
          {typeof aheadOf === "number" && indiaRank !== 1 && (
            <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
              Just below: {inr(aheadOf)}. The board is live — positions change as businesses promote.
            </p>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6" style={{ border: "1px solid var(--color-line)" }}>
          <h2 className="font-display" style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 24 }}>Is this your listing?</h2>
          <p style={{ margin: "0 0 18px", color: "var(--color-muted)" }}>Promote to raise your rank, verify your site for the tick, and show your rank on your own website.</p>
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="font-display inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[15px]" style={{ background: "var(--color-forest)", color: "var(--color-panel)", fontWeight: 700 }}>
              <CrownMark size={16} /> India #{indiaRank} on TopKaun
            </span>
            <span className="text-sm" style={{ color: "var(--color-muted)" }}>← an embeddable badge that updates itself</span>
            <Link href="/promote" className="ml-auto rounded-full px-5 py-2.5 font-semibold no-underline" style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}>Raise my rank</Link>
          </div>
        </section>

        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          <Link href="/">← Back to the board</Link> · Payment amounts are public; who paid stays private.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
