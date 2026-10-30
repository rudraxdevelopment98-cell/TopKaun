import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CityWar } from "@/components/CityWar";
import { getAllListings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "City war — TopKaun" };

export default async function CitiesPage() {
  const listings = await getAllListings();
  return (
    <>
      <SiteHeader />
      <CityWar listings={listings} />
      <SiteFooter />
    </>
  );
}
