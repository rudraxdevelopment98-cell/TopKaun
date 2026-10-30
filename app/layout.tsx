import type { Metadata } from "next";
import { Bricolage_Grotesque, Hind } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://topkaun.in"),
  title: "TopKaun — India ka #1 kaun?",
  description:
    "The live promotion board for Indian businesses. Buy promoted placement — your rank is the visibility you've paid for. No ads, no algorithm, no favourites.",
  openGraph: {
    title: "TopKaun — India ka #1 kaun?",
    description:
      "The live promotion board for Indian businesses. Rank = promotion you've paid for.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${hind.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
