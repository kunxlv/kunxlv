import type { Metadata } from "next";
import { getPosts, type Post } from "@/lib/medium";
import { site } from "@/content/site";
import { TLink } from "@/components/tlink";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "Writing", description: "Posts by Kunal Vaidya about the things he builds." };

function Cover({ post, ratio }: { post: Post; ratio: string }) {
  return (
    <div className="kv-img" style={{ aspectRatio: ratio, borderRadius: 6, overflow: "hidden", background: "#ededed" }}>
      {post.cover ? <img src={post.cover} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : null}
    </div>
  );
}

export default async function WritingPage() {
  const posts = await getPosts(site.mediumUsername);
  const [latest, ...earlier] = posts;
  const medium = site.socials.find((s) => s.name === "Medium")?.url || (site.mediumUsername ? `https://medium.com/@${site.mediumUsername}` : "");

  return (
    <main style={{ background: "#fff", color: "#000" }}>
      <style>{`
        .kv-post .kv-img img { transition: transform 700ms var(--ease); }
        .kv-post:hover .kv-img img { transform: scale(1.03); }
        .kv-post:hover .kv-post-title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 6px; }
      `}</style>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px clamp(20px, 5vw, 48px) 120px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <TLink href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", textDecoration: "none" }}>Kunal Vaidya</TLink>
          {medium ? <a href={medium} target="_blank" rel="noreferrer" style={{ fontSize: 15, fontWeight: 500, textUnderlineOffset: 5 }}>Medium ↗</a> : null}
        </div>
        <div style={{ padding: "clamp(80px, 12vw, 150px) 0 clamp(48px, 6vw, 72px)", display: "flex", flexDirection: "column", gap: 20 }}>
          <h1 data-kv-title style={{ margin: 0, fontSize: "clamp(44px, 6.4vw, 88px)", fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1 }}>Writing.</h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 19, lineHeight: 1.55, color: "#6b6b6b" }}>Occasional posts about the things I build. Published on Medium, readable here.</p>
        </div>

        {latest ? (
          <TLink href={`/writing/${latest.slug}`} className="kv-post" morph={{ background: "#2f2f2f", image: latest.cover ?? undefined }} style={{ display: "flex", flexDirection: "column", gap: 32, textDecoration: "none", paddingTop: 24, borderTop: "1px solid #000" }}>
            <span className="kv-label" style={{ color: "#6b6b6b" }}>Latest</span>
            <Cover post={latest} ratio="16 / 8" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px 64px" }}>
              <span className="kv-post-title" style={{ flex: "999 1 460px", minWidth: 0, fontSize: "clamp(36px, 4.4vw, 60px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.02 }}>{latest.title}</span>
              <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 14 }}>
                <span style={{ fontSize: 18, lineHeight: 1.5, color: "#2f2f2f" }}>{latest.subtitle}</span>
                <span style={{ fontSize: 14, color: "#6b6b6b" }}>{latest.date}, {latest.readingTime} min read</span>
              </div>
            </div>
          </TLink>
        ) : (
          <p style={{ margin: 0, paddingTop: 24, borderTop: "1px solid #000", fontSize: 19, color: "#6b6b6b" }}>Nothing published yet. The first post is on its way.</p>
        )}

        {earlier.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 32, marginTop: "clamp(72px, 9vw, 120px)", paddingTop: 24, borderTop: "1px solid #000" }}>
            <span className="kv-label" style={{ color: "#6b6b6b" }}>Earlier</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "56px 32px" }}>
              {earlier.map((p) => (
                <TLink key={p.slug} href={`/writing/${p.slug}`} className="kv-post" morph={{ background: "#2f2f2f", image: p.cover ?? undefined }} style={{ display: "flex", flexDirection: "column", gap: 16, textDecoration: "none" }}>
                  <Cover post={p} ratio="3 / 2" />
                  <span style={{ fontSize: 14, color: "#6b6b6b" }}>{p.date}, {p.readingTime} min read</span>
                  <span className="kv-post-title" style={{ fontSize: "clamp(24px, 2.2vw, 30px)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15 }}>{p.title}</span>
                  <span style={{ fontSize: 17, lineHeight: 1.5, color: "#6b6b6b" }}>{p.subtitle}</span>
                </TLink>
              ))}
            </div>
          </div>
        ) : null}

        {medium ? <p style={{ margin: "48px 0 0", fontSize: 17, color: "#6b6b6b" }}>New posts appear here automatically. <a href={medium} target="_blank" rel="noreferrer" style={{ color: "#000", textUnderlineOffset: 4 }}>Follow on Medium</a> to hear first.</p> : null}
      </div>
      <SiteFooter />
    </main>
  );
}
