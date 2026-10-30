import Link from "next/link";

export function CrownMark({
  size = 26,
  color = "var(--color-gold)",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ fill: color, flexShrink: 0 }}
    >
      <path d="M3 8.5l4.6 3.6L12 4.5l4.4 7.6L21 8.5l-1.8 10H4.8z" />
    </svg>
  );
}

export function Logo({
  dark = true,
  size = 24,
}: {
  dark?: boolean;
  size?: number;
}) {
  return (
    <Link
      href="/"
      className="font-display inline-flex items-center gap-2 no-underline"
      style={{
        color: dark ? "var(--color-panel)" : "var(--color-ink)",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.02em",
      }}
    >
      <CrownMark size={size + 2} />
      TopKaun
    </Link>
  );
}

export function VerifiedTick({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label="Verified"
      style={{ flexShrink: 0, fill: "var(--color-forest)" }}
    >
      <path d="M12 2l2.4 2.2 3.2-.4.9 3.1 2.9 1.5-1 3.1 1 3.1-2.9 1.5-.9 3.1-3.2-.4L12 22l-2.4-2.2-3.2.4-.9-3.1-2.9-1.5 1-3.1-1-3.1 2.9-1.5.9-3.1 3.2.4z" />
      <path
        d="M8 12.2l2.6 2.6L16 9.4"
        style={{ fill: "none", stroke: "var(--color-cream)", strokeWidth: 2 }}
      />
    </svg>
  );
}
