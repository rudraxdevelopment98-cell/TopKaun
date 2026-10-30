import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Board } from "@/components/Board";
import { getAllListings, getRecentMoves } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [listings, moves] = await Promise.all([getAllListings(), getRecentMoves(8)]);
  const foundingTaken = listings.filter((l) => l.founding).length;

  return (
    <>
      <SiteHeader />
      <Board
        initialListings={listings}
        moves={moves.map((m) => ({ id: m.id, text: m.text }))}
        foundingTaken={foundingTaken}
      />
      <SiteFooter />
    </>
  );
}
