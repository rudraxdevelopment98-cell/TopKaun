import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — TopKaun" };

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
          Terms of Service
        </h1>
        <p style={{ color: "var(--color-muted)", margin: "0 0 24px", fontSize: 18 }}>
          These terms govern your use of TopKaun. Please read them before you promote a
          business on the platform.
        </p>
        <p style={{ color: "var(--color-muted)", margin: "0 0 24px", fontSize: 14 }}>
          TopKaun is operated by [COMPANY LEGAL NAME], [REGISTERED ADDRESS],
          GSTIN [GSTIN]. In these terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and
          &ldquo;TopKaun&rdquo; mean the operator, and &ldquo;you&rdquo; means the
          business or person using the platform.
        </p>

        <h2 className="font-display" style={h2}>
          1. Acceptance
        </h2>
        <p>
          By creating a listing, making a promotion payment, or otherwise using
          TopKaun, you agree to these terms. If you do not agree, do not use the
          platform. We may update these terms from time to time; continued use after an
          update means you accept the revised terms.
        </p>

        <h2 className="font-display" style={h2}>
          2. What TopKaun is
        </h2>
        <p>
          TopKaun is an online advertising and promotion listing platform. A business
          pays to place and boost its listing and to gain visibility on our boards. The
          price of each position is set by a live, open board: your rank is the total
          promotion rupees paid toward your listing, and to move ahead of another
          business you promote more than they have.
        </p>
        <p>
          TopKaun is explicitly not betting, gambling, a lottery, a game of chance or
          skill for money, a deposit, or an investment. You never win money and never
          receive any cash or convertible prize. When a payment is confirmed you
          receive a definite service immediately: your listing is placed and boosted
          and your visibility begins. Rank reflects promotion spend, not quality.
        </p>

        <h2 className="font-display" style={h2}>
          3. Eligibility
        </h2>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>You must be at least 18 years old.</li>
          <li style={li}>
            You must be authorised to represent the business you list and to incur its
            promotion spend.
          </li>
          <li style={li}>
            Listings are for genuine Indian businesses. You confirm the information you
            provide is accurate and kept up to date.
          </li>
        </ul>

        <h2 className="font-display" style={h2}>
          4. Payments and placement
        </h2>
        <p>
          Promotion payments buy placement and visibility, and are for a service that
          is rendered immediately and continuously from the moment the payment is
          confirmed. Payments are processed by our payment partner, Razorpay. Prices
          are in Indian Rupees and inclusive of applicable taxes unless stated
          otherwise.
        </p>
        <p>
          Refunds are governed by our{" "}
          <a href="/refunds" style={{ color: "var(--color-forest)", fontWeight: 600 }}>
            Refund &amp; Cancellation Policy
          </a>
          . Because the service is delivered at once, promotion payments are generally
          non-refundable.
        </p>

        <h2 className="font-display" style={h2}>
          5. No guaranteed rank or duration
        </h2>
        <p>
          Your rank can change at any time as other businesses promote more. We do not
          guarantee any particular rank, position, or duration at a position, and being
          overtaken is the normal functioning of a live board, not a service failure.
          The visibility you paid for is delivered regardless of where you later sit on
          the board.
        </p>

        <h2 className="font-display" style={h2}>
          6. Acceptable use and prohibited content
        </h2>
        <p>You agree not to list, promote, or link to:</p>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>Betting, gambling, or lotteries.</li>
          <li style={li}>Lending or loan services.</li>
          <li style={li}>Crypto tokens or crypto-asset schemes.</li>
          <li style={li}>Adult content or services.</li>
          <li style={li}>Political campaigning or propaganda.</li>
          <li style={li}>
            Content that is misleading, infringes others&rsquo; rights, or is illegal
            under Indian law.
          </li>
        </ul>
        <p>
          You must not misrepresent what a TopKaun rank means. In particular, you must
          not claim or imply that being #1 or highly ranked is a measure of quality,
          endorsement, or anything other than promotion paid.
        </p>

        <h2 className="font-display" style={h2}>
          7. Removal of listings
        </h2>
        <p>
          We may edit, suspend, or remove any listing that breaks these terms, violates
          the law, or is reported and found to be abusive, without prior notice where
          necessary. Removal for a breach does not entitle you to a refund of promotion
          already delivered.
        </p>

        <h2 className="font-display" style={h2}>
          8. Limitation of liability
        </h2>
        <p>
          TopKaun is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
          basis. To the maximum extent permitted by law, we are not liable for indirect,
          incidental, or consequential losses, or for loss of profit, business, or
          goodwill. Our total liability for any claim relating to the platform is
          limited to the amount of promotion you paid to TopKaun in the 30 days before
          the event giving rise to the claim. Nothing in these terms limits liability
          that cannot be limited under applicable law.
        </p>

        <h2 className="font-display" style={h2}>
          9. Governing law and jurisdiction
        </h2>
        <p>
          These terms are governed by the laws of India. The courts at Ahmedabad,
          Gujarat have exclusive jurisdiction over any dispute arising out of or in
          connection with the platform or these terms.
        </p>

        <h2 className="font-display" style={h2}>
          10. Contact
        </h2>
        <p>
          Questions about these terms? Email us at{" "}
          <a
            href="mailto:[founder-email@topkaun.in]"
            style={{ color: "var(--color-forest)", fontWeight: 600 }}
          >
            [founder-email@topkaun.in]
          </a>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
