"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Listing, City, Category } from "@/lib/types";
import { inr, costToBeat, MIN_INR } from "@/lib/money";
import { CrownMark } from "./brand";

type RazorpaySuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string; amount: number; currency: string; name: string; description: string;
  order_id: string; prefill: { name: string; email: string }; theme: { color: string };
  handler: (r: RazorpaySuccess) => void; modal?: { ondismiss: () => void };
};
declare global {
  interface Window { Razorpay?: new (o: RazorpayOptions) => { open: () => void } }
}

const PROMOTE_CITIES: (City | "No city")[] = ["No city", "Ahmedabad", "Surat", "Mumbai", "Pune", "Bengaluru"];
const PROMOTE_CATS: Category[] = ["SaaS", "Fintech", "AI tools", "D2C", "Creators"];

export function PromoteFlow({ listings }: { listings: Listing[] }) {
  const overall = useMemo(
    () => [...listings].sort((a, b) => b.totalInr - a.totalInr),
    [listings],
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(2400);
  const [city, setCity] = useState<City | "No city">("Ahmedabad");
  const [cat, setCat] = useState<Category>("SaaS");
  const [gst, setGst] = useState(false);
  const [agree, setAgree] = useState(true);
  const [method, setMethod] = useState<"upi" | "card" | "nb">("upi");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ rank: number; name: string; tookFrom: string | null } | null>(null);

  const set = (v: number) => setAmount(Math.max(MIN_INR, Math.min(1_000_000, Math.round(v))));

  // Where this amount lands on the All-India all-time board (as a new listing).
  const above = overall.filter((l) => l.totalInr > amount);
  const myRank = above.length + 1;
  const leaderAbove = above[above.length - 1];
  const chaserBelow = overall.filter((l) => l.totalInr <= amount)[0];

  const topInr = overall[0]?.totalInr ?? 0;
  const third = overall[2]?.totalInr ?? 0;
  const snaps: [string, number][] = [
    ["Get seen", MIN_INR],
    ["Top 3", costToBeat(third)],
    ["Take #1", costToBeat(topInr)],
  ];

  async function pay() {
    setErr("");
    setBusy(true);
    const payload = {
      amountInr: amount,
      name: name || undefined,
      url: url || undefined,
      city: city === "No city" ? undefined : city,
      category: cat,
    };
    try {
      const orderRes = await fetch("/api/promote/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!orderRes.ok) throw new Error("Could not start payment");
      const order = await orderRes.json();

      const confirm = async (extra: Partial<RazorpaySuccess> = {}) => {
        const res = await fetch("/api/promote/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            provider: order.provider,
            orderId: order.orderId,
            paymentId: extra.razorpay_payment_id,
            signature: extra.razorpay_signature,
            ...payload,
          }),
        });
        if (!res.ok) throw new Error("Payment could not be confirmed");
        const r = await res.json();
        setDone({ rank: r.indiaRank, name: r.name, tookFrom: r.tookTopFrom });
        setStep(3);
      };

      if (order.provider === "mock") {
        // Demo mode: no real gateway, confirm straight away.
        await confirm();
      } else {
        await openRazorpay(order, payload.name ?? "", email, confirm);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function openRazorpay(
    order: { orderId: string; amountInr: number; keyId?: string },
    bizName: string,
    mail: string,
    confirm: (e: RazorpaySuccess) => Promise<void>,
  ) {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!window.Razorpay || !order.keyId) throw new Error("Payment unavailable");
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amountInr * 100,
      currency: "INR",
      name: "TopKaun",
      description: "Promoted placement",
      order_id: order.orderId,
      prefill: { name: bizName, email: mail },
      theme: { color: "#0E3A2B" },
      handler: (r) => { void confirm(r); },
      modal: { ondismiss: () => setBusy(false) },
    });
    rzp.open();
  }

  // ── Step 3: success ──────────────────────────────────────────────
  if (step === 3 && done) {
    const head = done.rank === 1 ? `${done.name} is India's #1` : `${done.name} is #${done.rank} in India`;
    return (
      <div className="mx-auto" style={{ maxWidth: 480 }}>
        <div className="flex flex-col items-center gap-2.5 px-6 py-9 text-center" style={{ background: "var(--color-forest)", color: "var(--color-panel)" }}>
          <CrownMark size={56} className="anim-crown" />
          <h1 className="font-display" style={{ margin: 0, fontWeight: 800, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            {done.rank === 1 ? "You're India's #1" : `You're #${done.rank} in India`}
          </h1>
          <p style={{ margin: 0, color: "var(--color-sage)" }}>
            {done.tookFrom ? `You took #1 from ${done.tookFrom}.` : "Your promotion is live on the board."}
          </p>
        </div>
        <div className="flex flex-col gap-5 px-6 py-6">
          <ShareCard head={head} />
          <section style={{ borderTop: "1px solid var(--color-line)", paddingTop: 16 }}>
            <h2 className="font-display" style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 20 }}>What happens next</h2>
            <ul className="m-0 flex flex-col gap-1.5 pl-5" style={{ color: "#2E3B34" }}>
              <li>Your GST invoice is on its way to your email.</li>
              <li>We&apos;ll email you the moment someone outranks you.</li>
              <li>Verify your site to get the tick next to your name.</li>
            </ul>
          </section>
          <Link href="/" className="rounded-2xl py-3.5 text-center font-semibold no-underline" style={{ border: "2px solid var(--color-forest)" }}>
            See the board
          </Link>
        </div>
      </div>
    );
  }

  // ── Steps 1 & 2 ──────────────────────────────────────────────────
  return (
    <div className="mx-auto" style={{ maxWidth: 480 }}>
      <div style={{ height: 4, background: "var(--color-forest-2)" }}>
        <div style={{ height: "100%", background: "var(--color-gold)", width: step === 1 ? "50%" : "100%" }} />
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-7 px-6 py-6">
          <section>
            <h1 className="font-display" style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Promote your business
            </h1>
            <label htmlFor="url" className="text-sm font-semibold">Your website or social handle</label>
            <input id="url" type="text" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yoursite.in or @yourhandle"
              className="mt-1.5 w-full rounded-xl bg-white px-3.5 py-3.5" style={{ border: "2px solid var(--color-forest)", fontSize: 17 }} />
            <label htmlFor="bname" className="mt-3 block text-sm font-semibold">Business name (shown on the board)</label>
            <input id="bname" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Khaata AI"
              className="mt-1.5 w-full rounded-xl bg-white px-3.5 py-3" style={{ border: "1.5px solid var(--color-line-2)" }} />
          </section>

          <section>
            <h2 className="font-display mb-2.5" style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 20 }}>Where you&apos;ll land</h2>
            <ol className="m-0 flex list-none flex-col gap-1.5 rounded-2xl p-3" style={{ background: "var(--color-forest)" }}>
              {leaderAbove && <LandRow rank={myRank - 1} name={leaderAbove.name} sub={`${inr(leaderAbove.totalInr - amount + 1)} more to pass them`} amount={inr(leaderAbove.totalInr)} />}
              <LandRow rank={myRank} name={name || "Your business"} sub={myRank === 1 ? "India #1. The crown is yours." : "Your spot if you promote now"} amount={inr(amount)} me />
              {chaserBelow && <LandRow rank={myRank + 1} name={chaserBelow.name} sub={chaserBelow.city} amount={inr(chaserBelow.totalInr)} />}
            </ol>
          </section>

          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display" style={{ margin: 0, fontWeight: 700, fontSize: 20 }}>How much?</h2>
              <span className="text-[13px]" style={{ color: "var(--color-muted)" }}>Minimum ₹199</span>
            </div>
            <div className="mt-3 grid items-center gap-2.5" style={{ gridTemplateColumns: "48px minmax(0,1fr) 48px" }}>
              <button type="button" onClick={() => set(amount - 100)} aria-label="₹100 less" className="rounded-xl bg-white text-2xl" style={{ height: 48, border: "1.5px solid var(--color-line-2)", cursor: "pointer" }}>−</button>
              <span className="font-display text-center" style={{ fontWeight: 800, fontSize: 44, letterSpacing: "-0.03em", lineHeight: 1 }}>{inr(amount)}</span>
              <button type="button" onClick={() => set(amount + 100)} aria-label="₹100 more" className="rounded-xl bg-white text-2xl" style={{ height: 48, border: "1.5px solid var(--color-line-2)", cursor: "pointer" }}>+</button>
            </div>
            <input type="range" min={MIN_INR} max={20000} step={1} value={Math.min(amount, 20000)} onChange={(e) => set(Number(e.target.value))} className="mt-4 mb-1.5 w-full" style={{ accentColor: "var(--color-forest)" }} aria-label="Promotion amount" />
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
              {snaps.map(([label, v]) => {
                const on = amount === v;
                return (
                  <button key={label} type="button" onClick={() => set(v)} className="rounded-xl px-1.5 py-2" style={{ minHeight: 52, cursor: "pointer", border: `1.5px solid ${on ? "var(--color-forest)" : "var(--color-line-2)"}`, background: on ? "var(--color-forest)" : "var(--color-panel)", color: on ? "var(--color-panel)" : "var(--color-ink)" }}>
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-[13px]">{inr(v)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display mb-2.5" style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 20 }}>Which boards?</h2>
            <p className="mb-2 text-sm" style={{ color: "var(--color-muted)" }}>You&apos;re always on the India board. Add a city and category to compete there too.</p>
            <div className="mb-2.5 flex flex-wrap gap-2">
              {PROMOTE_CITIES.map((c) => <Pill key={c} on={city === c} onClick={() => setCity(c)}>{c}</Pill>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {PROMOTE_CATS.map((c) => <Pill key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Pill>)}
            </div>
          </section>

          <button type="button" onClick={() => setStep(2)} className="rounded-2xl py-4 font-semibold" style={{ border: 0, background: "var(--color-forest)", color: "var(--color-panel)", fontSize: 17, cursor: "pointer" }}>
            Continue with {inr(amount)}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5 px-6 py-6">
          <button type="button" onClick={() => setStep(1)} className="self-start text-sm" style={{ color: "var(--color-muted)", background: "none", border: 0, cursor: "pointer" }}>← Back</button>
          <h1 className="font-display" style={{ margin: 0, fontWeight: 800, fontSize: 30, lineHeight: 1.05, letterSpacing: "-0.03em" }}>Almost there</h1>

          <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: "var(--color-forest)", color: "var(--color-panel)" }}>
            <span className="flex-1" style={{ minWidth: 0 }}>
              <span className="block font-semibold">{name || url || "Your business"}</span>
              <span className="block text-sm" style={{ color: "var(--color-sage)" }}>India #{myRank}{city !== "No city" ? `, ${city}` : ""}, {cat}</span>
            </span>
            <span className="font-display" style={{ fontWeight: 800, fontSize: 22 }}>{inr(amount)}</span>
          </div>

          <div>
            <label htmlFor="em" className="text-sm font-semibold">Email for your invoice and alerts</label>
            <input id="em" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.in"
              className="mt-1.5 w-full rounded-xl bg-white px-3.5 py-3" style={{ border: "1.5px solid var(--color-line-2)" }} />
          </div>

          <label className="flex items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-3 font-medium" style={{ border: "1.5px solid var(--color-line-2)" }}>
            <span>I need a GST invoice for my business</span>
            <input type="checkbox" checked={gst} onChange={() => setGst(!gst)} style={{ width: 22, height: 22, accentColor: "var(--color-forest)" }} />
          </label>
          {gst && (
            <div>
              <label htmlFor="gstin" className="text-sm font-semibold">GSTIN</label>
              <input id="gstin" type="text" placeholder="24ABCDE1234F1Z5" className="mt-1.5 w-full rounded-xl bg-white px-3.5 py-3" style={{ border: "1.5px solid var(--color-line-2)", letterSpacing: "0.04em" }} />
            </div>
          )}

          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 text-sm font-semibold">Pay with</legend>
            <div className="flex flex-col gap-2">
              {([["upi", "UPI", "Any UPI app, or scan a QR code"], ["card", "Card", "Debit or credit"], ["nb", "Netbanking", "All major Indian banks"]] as const).map(([id, label, sub]) => {
                const on = method === id;
                return (
                  <button key={id} type="button" role="radio" aria-checked={on} onClick={() => setMethod(id)} className="flex w-full items-center gap-3 rounded-xl bg-white px-3.5 py-3 text-left" style={{ border: on ? "2px solid var(--color-forest)" : "1.5px solid var(--color-line-2)", cursor: "pointer", minHeight: 56 }}>
                    <span style={{ width: 18, height: 18, borderRadius: 999, flexShrink: 0, boxSizing: "border-box", border: on ? "6px solid var(--color-forest)" : "2px solid #9DB0A4" }} />
                    <span className="flex-1">
                      <span className="block font-semibold">{label}</span>
                      <span className="block text-[13px]" style={{ color: "var(--color-muted)" }}>{sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="flex items-start gap-2.5 text-sm" style={{ lineHeight: 1.45 }}>
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} style={{ marginTop: 2, width: 20, height: 20, accentColor: "var(--color-forest)", flexShrink: 0 }} />
            <span>This is a promotion, not betting or gambling. I understand my rank changes as others promote, and payment buys placement that goes live immediately. <Link href="/rules">Read the rules</Link></span>
          </label>

          {err && <p className="m-0 text-sm" style={{ color: "#B42318" }}>{err}</p>}

          <button type="button" disabled={busy || !agree} onClick={pay} className="rounded-2xl py-4 font-bold" style={{ border: 0, background: busy || !agree ? "#E4C98A" : "var(--color-gold)", color: "var(--color-ink)", fontSize: 17, cursor: busy || !agree ? "default" : "pointer" }}>
            {busy ? "Processing…" : `Pay ${inr(amount)}`}
          </button>
          <p className="m-0 text-center text-[13px]" style={{ color: "var(--color-muted)" }}>Secured by Razorpay. GST included. Invoice by email.</p>
        </div>
      )}
    </div>
  );
}

function LandRow({ rank, name, sub, amount, me }: { rank: number; name: string; sub: string; amount: string; me?: boolean }) {
  return (
    <li className="grid items-center gap-2.5 rounded-lg px-2.5 py-2" style={{ gridTemplateColumns: "36px minmax(0,1fr) auto", background: me ? "var(--color-gold)" : undefined, color: me ? "var(--color-ink)" : "var(--color-sage)" }}>
      <span className="font-display text-center" style={{ fontWeight: 700, fontSize: 17 }}>{rank}</span>
      <span style={{ minWidth: 0 }}>
        <span className="block truncate font-semibold">{name}</span>
        <span className="block text-[13px]" style={{ opacity: 0.85 }}>{sub}</span>
      </span>
      <span className="font-display" style={{ fontWeight: 700, fontSize: 17 }}>{amount}</span>
    </li>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className="rounded-full px-3.5 py-2 text-[15px]" style={{ minHeight: 44, cursor: "pointer", border: `1.5px solid ${on ? "var(--color-forest)" : "var(--color-line-2)"}`, background: on ? "var(--color-forest)" : "transparent", color: on ? "var(--color-panel)" : "var(--color-ink)" }}>
      {children}
    </button>
  );
}

function ShareCard({ head }: { head: string }) {
  return (
    <section>
      <h2 className="font-display mb-2.5" style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 20 }}>Tell people you&apos;re on top</h2>
      <figure className="m-0 flex flex-col justify-between rounded-2xl p-4.5" style={{ aspectRatio: "1200 / 630", background: "var(--color-forest)", color: "var(--color-panel)", padding: 18, borderBottom: "5px solid var(--color-gold)" }}>
        <span className="font-display flex items-center gap-1.5" style={{ fontWeight: 800, fontSize: 15 }}><CrownMark size={16} />TopKaun</span>
        <span className="font-display" style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{head}</span>
        <span className="text-[13px]" style={{ color: "var(--color-sage)" }}>Think you can take it? topkaun.in</span>
      </figure>
      <a href="#" className="mt-3 flex items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold no-underline" style={{ background: "var(--color-whatsapp)", color: "#fff" }}>Share on WhatsApp</a>
    </section>
  );
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.body.appendChild(s);
  });
}
