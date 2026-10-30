import Link from "next/link";
import { Logo } from "./brand";

export function SiteHeader({ showNav = true }: { showNav?: boolean }) {
  return (
    <header style={{ background: "var(--color-forest)", color: "var(--color-panel)" }}>
      <div className="mx-auto flex flex-wrap items-center gap-5 px-6 py-4" style={{ maxWidth: 1240 }}>
        <Logo />
        {showNav && (
          <nav
            aria-label="Main"
            className="hidden flex-grow gap-6 font-medium md:flex"
          >
            <Link href="/" className="no-underline" style={{ color: "var(--color-sage)" }}>
              Today
            </Link>
            <Link href="/cities" className="no-underline" style={{ color: "var(--color-sage)" }}>
              City war
            </Link>
            <Link href="/rules" className="no-underline" style={{ color: "var(--color-sage)" }}>
              How ranking works
            </Link>
          </nav>
        )}
        <div className="ml-auto flex gap-2.5">
          <Link
            href="/promote"
            className="rounded-full px-4 py-2 font-semibold no-underline"
            style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}
          >
            Promote your business
          </Link>
        </div>
      </div>
    </header>
  );
}
