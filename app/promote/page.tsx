import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PromoteFlow } from "@/components/PromoteFlow";
import { getAllListings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Promote your business — TopKaun" };

export default async function PromotePage() {
  const listings = await getAllListings();
  return (
    <>
      <SiteHeader showNav={false} />
      <main className="py-8">
        <PromoteFlow listings={listings} />
      </main>
      <SiteFooter />
    </>
  );
}
