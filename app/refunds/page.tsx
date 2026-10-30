import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund & Cancellation Policy — TopKaun" };

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
          Refund &amp; Cancellation Policy
        </h1>
        <p style={{ color: "var(--color-muted)", margin: "0 0 24px", fontSize: 18 }}>
          TopKaun sells promotion, placement, and visibility. This policy explains, in
          plain terms, when a promotion payment can and cannot be refunded.
        </p>

        <h2 className="font-display" style={h2}>
          Promotion payments are generally non-refundable
        </h2>
        <p>
          When your payment is confirmed, the service is delivered immediately and
          continuously: your listing is placed and boosted and your visibility begins
          at once. Because you receive the service straight away, promotion payments
          are generally non-refundable.
        </p>

        <div
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--color-line)",
            borderLeft: "4px solid var(--color-gold)",
            borderRadius: 12,
            padding: "18px 20px",
            margin: "16px 0 0",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Being overtaken is not a service failure.</strong> If another
            business later promotes more and moves ahead of you, that is the normal,
            intended working of the live board. The visibility you paid for was still
            delivered to you. It is not grounds for a refund, and there is no
            cancellation of an active, delivered promotion for a refund.
          </p>
        </div>

        <h2 className="font-display" style={h2}>
          When we do give refunds
        </h2>
        <p>We will refund a payment in these genuine cases:</p>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>
            <strong>Duplicate or double charge</strong> — you were charged more than once
            for the same promotion.
          </li>
          <li style={li}>
            <strong>Technical failure</strong> — the payment was taken but, because of a
            fault on our side, your listing was not placed or boosted at all.
          </li>
          <li style={li}>
            <strong>Unauthorised transaction</strong> — a payment that is proven to have
            been made without authorisation.
          </li>
        </ul>
        <p>
          In these cases we refund to the original payment method, normally within [7]
          business days of approving the request. The exact time to appear in your
          account depends on your bank or payment provider.
        </p>

        <h2 className="font-display" style={h2}>
          How to request a refund
        </h2>
        <p>
          Email{" "}
          <a
            href="mailto:[founder-email@topkaun.in]"
            style={{ color: "var(--color-forest)", fontWeight: 600 }}
          >
            [founder-email@topkaun.in]
          </a>{" "}
          with your Razorpay payment id and a short description of what happened, within
          [X] days of the payment. We will review the request and, where it meets one of
          the cases above, process the refund to your original payment method.
        </p>

        <h2 className="font-display" style={h2}>
          GST on refunds
        </h2>
        <p>
          Where a refund is issued, any GST charged on the refunded amount is handled in
          accordance with applicable law. Your refund and any related tax adjustment
          will be reflected in your records.
        </p>

        <p style={{ color: "var(--color-muted)", marginTop: 28 }}>
          This policy sits alongside our{" "}
          <a href="/terms" style={{ color: "var(--color-forest)", fontWeight: 600 }}>
            Terms of Service
          </a>
          . Promotion rupees buy placement and visibility — a service — and are never a
          deposit, an investment, or convertible back to cash.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
