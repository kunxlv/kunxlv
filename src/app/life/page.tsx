import type { Metadata } from "next";
import { readAlbums, type Album } from "@/lib/albums";
import { TLink } from "@/components/tlink";

export const metadata: Metadata = { title: "Life", description: "Photo albums from Kunal Vaidya, with the stories behind them." };

function rows(albums: Album[]) {
  const out: Album[][] = [];
  let thirds: Album[] = [];
  for (const a of albums) {
    if (a.size === "third") {
      thirds.push(a);
      if (thirds.length === 3) { out.push(thirds); thirds = []; }
    } else {
      if (thirds.length) { out.push(thirds); thirds = []; }
      out.push([a]);
    }
  }
  if (thirds.length) out.push(thirds);
  return out;
}

export default async function LifePage() {
  const grouped = rows(await readAlbums());
  return (
    <main style={{ background: "#000", color: "#fff", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, display: "flex", justifyContent: "center", padding: "36px 20px", pointerEvents: "none" }}>
        <span className="kv-caps" style={{ fontSize: 14, letterSpacing: "0.32em" }}>Kunal Vaidya</span>
      </div>
      <h1 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Life</h1>
      {grouped.length === 0 ? (
        <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <p className="kv-caps" style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Albums coming soon</p>
        </div>
      ) : null}
      {grouped.map((row, r) => {
        const full = row.length === 1 && row[0].size === "full";
        return (
          <div key={r} style={{ display: "flex", flexWrap: "wrap" }}>
            {row.map((a) => (
              <TLink key={a.slug} href={`/life/${a.slug}`} morph={{ background: "#2f2f2f", image: a.cover }}
                style={{ position: "relative", flex: full ? "1 1 100%" : "1 1 320px", minHeight: full ? "100svh" : "80svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", textDecoration: "none", color: "#fff", padding: "0 24px", boxSizing: "border-box", backgroundColor: "#2f2f2f", backgroundImage: `url(${a.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />
                <span data-kv-title={r === 0 ? "" : undefined} style={{ position: "relative", fontSize: full ? "clamp(22px, 2.6vw, 34px)" : "clamp(16px, 1.5vw, 20px)", fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase" }}>{a.title}</span>
                <span className="kv-caps" style={{ position: "relative", fontSize: 12, letterSpacing: "0.3em", color: "rgba(255,255,255,0.85)" }}>{a.date}</span>
              </TLink>
            ))}
          </div>
        );
      })}
    </main>
  );
}
