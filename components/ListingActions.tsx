"use client";

import { useState } from "react";

export function ListingActions({ slug, hype }: { slug: string; hype: number }) {
  const [count, setCount] = useState(hype);
  const [hyped, setHyped] = useState(false);
  const [copied, setCopied] = useState(false);

  async function doHype() {
    if (hyped) return;
    setHyped(true);
    setCount((c) => c + 1);
    try {
      await fetch("/api/hype", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
    } catch {}
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://topkaun.in/l/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <button type="button" onClick={doHype} aria-pressed={hyped}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold"
        style={{ cursor: "pointer", border: hyped ? "1.5px solid var(--color-gold)" : "1.5px solid #2D6A53", background: hyped ? "var(--color-gold)" : "transparent", color: hyped ? "var(--color-ink)" : "var(--color-panel)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden style={{ fill: "none", stroke: "currentColor", strokeWidth: 2.5 }}><path d="M5 15l7-7 7 7" /></svg>
        Hype, {count}
      </button>
      <button type="button" onClick={copyLink}
        className="rounded-full px-5 py-2.5 font-semibold"
        style={{ cursor: "pointer", border: "1.5px solid #2D6A53", background: "transparent", color: "var(--color-panel)" }}>
        {copied ? "Link copied" : "Copy share link"}
      </button>
    </div>
  );
}
