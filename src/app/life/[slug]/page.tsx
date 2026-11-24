import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAlbum, getAlbums } from "@/content/albums";
import { TLink } from "@/components/tlink";
import { SiteFooter } from "@/components/site-footer";

export function generateStaticParams() {
  return getAlbums().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/life/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getAlbum(slug)?.title ?? "Album" };
}

const Arrow = ({ dir }: { dir: "prev" | "next" }) => (
  <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d={dir === "prev" ? "M10 2 L2 10 L10 18" : "M2 2 L10 10 L2 18"} fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
);

export default async function AlbumPage({ params }: PageProps<"/life/[slug]">) {
  const { slug } = await params;
  const all = getAlbums();
  const idx = all.findIndex((a) => a.slug === slug);
  const album = all[idx];
  if (!album) notFound();
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const img = { width: "100%", objectFit: "cover", display: "block" } as const;

  return (
    <main style={{ background: "#fff", color: "#000" }}>
      <header style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", color: "#fff", padding: "0 24px", backgroundColor: "#2f2f2f", backgroundImage: `url(${album.cover})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
        <TLink href="/life" className="kv-label" style={{ position: "absolute", top: 36, left: 0, right: 0, fontSize: 14, letterSpacing: "0.32em", textDecoration: "none", color: "#fff" }}>Kunal Vaidya</TLink>
        <h1 data-kv-title style={{ position: "relative", margin: 0, fontSize: "clamp(30px, 3.6vw, 52px)", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1.15 }}>{album.title}</h1>
        <p className="kv-label" style={{ position: "relative", margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: "0.3em" }}>{album.date}</p>
      </header>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "96px clamp(20px, 4vw, 40px) 140px", display: "flex", flexDirection: "column", gap: 56 }}>
        {album.blocks.map((b, k) => {
          if (b.type === "text") return <p key={k} style={{ margin: "0 auto", maxWidth: 600, fontFamily: "var(--font-mono)", fontSize: 16, lineHeight: 1.6, color: "rgba(0,0,0,0.8)" }}>{b.text}</p>;
          if (b.type === "pair") return (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 48 }}>
              {b.images.map((src, j) => <img key={j} src={src} alt="" loading="lazy" style={{ ...img, aspectRatio: "2 / 3" }} />)}
            </div>
          );
          return <img key={k} src={b.image} alt="" loading="lazy" style={{ ...img, aspectRatio: "3 / 2" }} />;
        })}
      </div>

      {prev ? <TLink href={`/life/${prev.slug}`} aria-label="Previous album" style={{ position: "fixed", left: 8, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6b6b", zIndex: 5 }}><Arrow dir="prev" /></TLink> : null}
      {next ? <TLink href={`/life/${next.slug}`} aria-label="Next album" style={{ position: "fixed", right: 8, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6b6b", zIndex: 5 }}><Arrow dir="next" /></TLink> : null}

      <SiteFooter />
    </main>
  );
}
