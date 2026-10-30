import { getListingBySlug, getIndiaRank } from "@/lib/data";

// Live SVG badge a business embeds on its own website:
//   <img src="https://topkaun.in/api/badge/your-slug" alt="Rank on TopKaun">
// It re-renders with the current rank every time it loads.

export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  const label = listing ? `India #${await getIndiaRank(slug)} on TopKaun` : "On TopKaun";
  const width = Math.max(150, 112 + label.length * 8.1);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(width)}" height="40" viewBox="0 0 ${Math.round(width)} 40" role="img" aria-label="${esc(label)}">
  <rect width="100%" height="100%" rx="8" fill="#0E3A2B"/>
  <path transform="translate(14,10) scale(0.8)" d="M3 8.5l4.6 3.6L12 4.5l4.4 7.6L21 8.5l-1.8 10H4.8z" fill="#FFAE1A"/>
  <text x="42" y="25" font-family="Verdana,Segoe UI,sans-serif" font-size="14" font-weight="700" fill="#F4F6F1">${esc(label)}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      // Let it update but don't hammer the server.
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
