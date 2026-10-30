import Link from "next/link";

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-line)" }}>
      <div
        className="mx-auto flex flex-wrap gap-5 px-6 py-6 text-sm"
        style={{ maxWidth: 1240, color: "var(--color-muted)" }}
      >
        <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>
          TopKaun, made in Ahmedabad
        </span>
        <Link href="/rules" className="no-underline">Rules</Link>
        <Link href="/terms" className="no-underline">Terms</Link>
        <Link href="/privacy" className="no-underline">Privacy</Link>
        <Link href="/refunds" className="no-underline">Refunds</Link>
        <span className="ml-auto">
          Rank = promotion paid, not a measure of quality.
        </span>
      </div>
    </footer>
  );
}
