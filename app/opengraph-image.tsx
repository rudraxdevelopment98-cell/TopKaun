import { ImageResponse } from "next/og";
import { getBoard } from "@/lib/data";

// Generated images use a system font that lacks the ₹ glyph, so render "Rs".
const rs = (v: number) => "Rs " + v.toLocaleString("en-IN");

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TopKaun — India ka #1 kaun?";
export const dynamic = "force-dynamic";

export default async function Image() {
  const board = await getBoard({ window: "all", city: "All India", category: "all" });
  const top = board[0];
  const sub = top ? `${top.name} leads India with ${rs(top.totalInr)}` : "The live promotion board for Indian businesses";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0E3A2B", color: "#F4F6F1", padding: 64, borderBottom: "12px solid #FFAE1A", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 800 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#FFAE1A" }} />
          TopKaun
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em" }}>
          India ka #1 kaun?
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#C9D6CE" }}>
          <div style={{ display: "flex" }}>{sub}</div>
          <div style={{ display: "flex", color: "#FFC65C" }}>topkaun.in</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
