import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — TopKaun" };

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
          Privacy Policy
        </h1>
        <p style={{ color: "var(--color-muted)", margin: "0 0 24px", fontSize: 18 }}>
          This policy explains what information TopKaun collects, why, and the choices
          you have. We aim to collect only what we need to run the promotion platform.
        </p>
        <p style={{ color: "var(--color-muted)", margin: "0 0 24px", fontSize: 14 }}>
          TopKaun is operated by [COMPANY LEGAL NAME], [REGISTERED ADDRESS]. For privacy
          questions, contact us at [founder-email@topkaun.in].
        </p>

        <h2 className="font-display" style={h2}>
          1. What we collect
        </h2>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>
            <strong>Business details</strong> — business name, website or social handle,
            and category you list.
          </li>
          <li style={li}>
            <strong>Contact</strong> — the email address you use to manage your listing
            and receive alerts.
          </li>
          <li style={li}>
            <strong>GST details</strong> — only if you choose to provide a GSTIN, for
            invoicing.
          </li>
          <li style={li}>
            <strong>Payment information</strong> — payments are processed by Razorpay.
            TopKaun does not see or store your card, UPI, or bank details; we keep only
            the Razorpay payment reference and the amount.
          </li>
          <li style={li}>
            <strong>Basic analytics</strong> — visit counts and aggregate usage of the
            boards and listing pages, to understand traffic.
          </li>
        </ul>

        <h2 className="font-display" style={h2}>
          2. Why we use it
        </h2>
        <p>
          We use this information to create and run your listing, process promotion
          payments, send you alerts about your listing (for example when you are
          overtaken), issue invoices, prevent abuse, and improve the platform. We use
          your information only for these stated purposes and not for unrelated ones.
        </p>

        <h2 className="font-display" style={h2}>
          3. What is public and what stays private
        </h2>
        <p>
          The promotion amount paid toward a listing is shown publicly on the board and
          on the listing page — that openness is the whole point of TopKaun. However,
          the personal identity of the payer is kept private. We display the amount and
          the business, never the individual&rsquo;s name, email, or payment identity.
        </p>

        <h2 className="font-display" style={h2}>
          4. Who we share with
        </h2>
        <ul style={{ paddingLeft: 22, margin: "0 0 8px" }}>
          <li style={li}>
            <strong>Razorpay</strong> — to process your promotion payments securely.
          </li>
          <li style={li}>
            <strong>Our email provider</strong> — to send you listing alerts and
            account messages.
          </li>
        </ul>
        <p>
          We do not sell your personal information. We may disclose information if
          required by law or to protect the rights and safety of TopKaun and its users.
        </p>

        <h2 className="font-display" style={h2}>
          5. Data retention
        </h2>
        <p>
          We keep listing and transaction records for as long as your listing is active
          and for as long afterwards as we are required to for tax, accounting, and
          legal purposes. When information is no longer needed, we delete or anonymise
          it.
        </p>

        <h2 className="font-display" style={h2}>
          6. Security
        </h2>
        <p>
          We apply reasonable security safeguards to protect the information we hold
          against loss, misuse, and unauthorised access, in line with India&rsquo;s
          Digital Personal Data Protection Act, 2023. No system is perfectly secure, but
          we limit access to your data to what is needed to run the service.
        </p>

        <h2 className="font-display" style={h2}>
          7. Your rights
        </h2>
        <p>
          You can ask to access, correct, or delete the personal information we hold
          about you by emailing{" "}
          <a
            href="mailto:[founder-email@topkaun.in]"
            style={{ color: "var(--color-forest)", fontWeight: 600 }}
          >
            [founder-email@topkaun.in]
          </a>
          . We will respond within a reasonable time. Some records, such as tax
          invoices, may need to be retained even after a deletion request, as the law
          requires.
        </p>

        <h2 className="font-display" style={h2}>
          8. Cookies and analytics
        </h2>
        <p>
          We use a small number of cookies and privacy-respecting analytics to keep you
          signed in and to count visits in aggregate. We do not use them to build
          advertising profiles about you. You can block cookies in your browser,
          though some features may not work as well.
        </p>

        <h2 className="font-display" style={h2}>
          9. Children
        </h2>
        <p>
          TopKaun is a business tool and is not intended for anyone under 18. We do not
          knowingly collect personal information from children.
        </p>

        <h2 className="font-display" style={h2}>
          10. Contact
        </h2>
        <p>
          For any privacy question or request, email{" "}
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
