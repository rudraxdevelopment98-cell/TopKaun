import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How ranking works — TopKaun" };

const h2 = {
  fontWeight: 700,
  fontSize: 24,
  letterSpacing: "-0.01em",
  color: "var(--color-forest)",
  margin: "36px 0 10px",
} as const;

const li = { margin: "0 0 8px" } as const;

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto px-6 py-14" style={{ maxWidth: 760 }}>
        <h1
          className="font-display"
          style={{ fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em", margin: "0 0 8px" }}
        >
          How ranking works
        </h1>
        <p style={{ color: "var(--color-muted)", margin: "0 0 24px", fontSize: 18 }}>
          TopKaun is a paid promotion and visibility board. Here is exactly how a
          listing moves up, in plain language, with nothing hidden.
        </p>

        <div
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-line)",
            borderLeft: "4px solid var(--color-gold)",
            borderRadius: 12,
            padding: "18px 20px",
            margin: "0 0 12px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Your rank is the total promotion rupees you have paid toward your
            listing — nothing else.</strong> It is not a measure of quality,
            popularity, customer reviews, or how good your business is. A higher rank
            only means more has been spent on promotion. We say this everywhere on
            purpose, so no one is ever misled.
          </p>
        </div>

        <h2 className="font-display" style={h2}>
          Moving up the board
        </h2>
        <p>
          To move up, you add more promotion to your listing. Your position is simply
          the sum of everything you have promoted toward it. To overtake another
          business, you promote more than they have. To take the #1 spot, you pay
          ₹100 more than whoever is currently #1. The minimum promotion for any
          single top-up is ₹199.
        </p>
        <p>
          Paying confirms a real service straight away: your listing is placed and
          boosted, and your visibility begins the moment the payment is confirmed. You
          are buying placement and visibility, not a chance at anything. There is no
          prize, no payout, and no money ever comes back to you from a rank.
        </p>

        <h2 className="font-display" style={h2}>
          The boards
        </h2>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>
            <strong>All-India</strong> — every listing ranked across the whole country.
          </li>
          <li style={li}>
            <strong>Per-city</strong> — your standing within your own city.
          </li>
          <li style={li}>
            <strong>Per-category</strong> — your standing within your business category.
          </li>
          <li style={li}>
            <strong>Today</strong> — counts only the promotion paid since midnight IST,
            and resets every day. It is a fresh race each morning, so a newer listing
            can lead the Today board without having the most promotion overall.
          </li>
        </ul>

        <h2 className="font-display" style={h2}>
          Hype (free upvotes)
        </h2>
        <p>
          Anyone can give your listing Hype — a free upvote. Hype powers the
          &ldquo;people&rsquo;s favourite&rdquo; view only. It is a separate, feel-good
          signal and it never affects your paid rank. You cannot climb the paid board
          with Hype, and you never lose paid rank for lacking it.
        </p>

        <h2 className="font-display" style={h2}>
          City War
        </h2>
        <p>
          Every rupee of promotion also counts toward your listing&rsquo;s city in the
          City War. When your business promotes, your city&rsquo;s total goes up too, so
          promoting your own listing helps your city&rsquo;s standing at the same time.
        </p>

        <h2 className="font-display" style={h2}>
          Founding badge
        </h2>
        <p>
          The first 100 paid listings on TopKaun earn a Founding badge and keep it for
          good, no matter how the board changes later. It is our thank-you to the
          businesses that backed TopKaun early.
        </p>

        <h2 className="font-display" style={h2}>
          What you get
        </h2>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>A public listing page for your business.</li>
          <li style={li}>Visits and visibility from people browsing the boards.</li>
          <li style={li}>A verified tick once you verify ownership of your website.</li>
          <li style={li}>
            A shareable &ldquo;#1 on TopKaun&rdquo; card for your socials.
          </li>
          <li style={li}>An embeddable badge you can place on your own site.</li>
        </ul>

        <h2 className="font-display" style={h2}>
          Honest FAQ
        </h2>
        <p style={{ margin: "0 0 4px" }}>
          <strong>Does being #1 mean you&rsquo;re the best?</strong>
        </p>
        <p style={{ margin: "0 0 16px", color: "var(--color-muted)" }}>
          No. It means you have promoted the most. Rank is paid promotion, not a
          judgement of quality.
        </p>
        <p style={{ margin: "0 0 4px" }}>
          <strong>Is this gambling or a game?</strong>
        </p>
        <p style={{ margin: "0 0 16px", color: "var(--color-muted)" }}>
          No. It is a paid advertising and promotion service. You buy visibility and
          you always receive it. There is no element of chance, no prize, and you never
          win money back.
        </p>
        <p style={{ margin: "0 0 4px" }}>
          <strong>Can I get my rank back as money?</strong>
        </p>
        <p style={{ margin: "0 0 16px", color: "var(--color-muted)" }}>
          No. Promotion rupees buy placement and visibility, which are delivered to
          you. They are not a deposit or an investment and are not convertible back to
          cash.
        </p>
        <p style={{ margin: "0 0 4px" }}>
          <strong>What if someone overtakes me?</strong>
        </p>
        <p style={{ margin: "0 0 16px", color: "var(--color-muted)" }}>
          That is the board working as intended. The visibility you paid for was still
          delivered. You can add more promotion whenever you choose to climb again.
        </p>

        <h2 className="font-display" style={h2}>
          Content not allowed
        </h2>
        <p>Listings may not promote or involve:</p>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>Betting, gambling, or lotteries.</li>
          <li style={li}>Lending or loan services.</li>
          <li style={li}>Crypto tokens or crypto-asset schemes.</li>
          <li style={li}>Adult content or services.</li>
          <li style={li}>Political campaigning or propaganda.</li>
          <li style={li}>Anything illegal under Indian law.</li>
        </ul>
        <p style={{ color: "var(--color-muted)" }}>
          Listings that break these rules may be removed. See our{" "}
          <a href="/terms" style={{ color: "var(--color-forest)", fontWeight: 600 }}>
            Terms of Service
          </a>{" "}
          for the full policy.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
