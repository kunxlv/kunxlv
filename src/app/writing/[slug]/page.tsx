import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/medium";
import { site } from "@/content/site";
import { TLink } from "@/components/tlink";
import { SiteFooter } from "@/components/site-footer";

export default function PostPage({ params }: PageProps<"/writing/[slug]">) {
  return (
    <main style={{ background: "#fff", color: "#000" }}>
      <Suspense fallback={<div style={{ minHeight: "100svh", background: "#2f2f2f" }} />}>
        <PostBody params={params} />
      </Suspense>
      <SiteFooter />
    </main>
  );
}

async function PostBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts(site.mediumUsername);
  const idx = posts.findIndex((p) => p.slug === slug);
  const post = posts[idx];
  if (!post) notFound();
  const newer = posts[idx - 1];
  const older = posts[idx + 1];

  return (
    <>
      <header style={{ position: "relative", minHeight: "min(760px, 90svh)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#2f2f2f", backgroundImage: post.cover ? `url(${post.cover})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
        <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "32px clamp(20px, 5vw, 48px)" }}>
          <TLink href="/writing" className="kv-tag kv-glass-dark" style={{ height: 40, padding: "0 18px", fontSize: 15, textDecoration: "none" }}>← Writing</TLink>
          <a href={post.url} target="_blank" rel="noreferrer" className="kv-tag kv-glass-dark" style={{ height: 40, padding: "0 18px", fontSize: 15, textDecoration: "none" }}>Read on Medium ↗</a>
        </div>
        <div data-kv-title style={{ position: "relative", width: "100%", maxWidth: 760, margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) 72px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{post.date}{post.readingTime ? `, ${post.readingTime} min read` : ""}</span>
          <h1 style={{ margin: 0, fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05 }}>{post.title}</h1>
        </div>
      </header>
      {post.partial ? (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "88px clamp(20px, 5vw, 48px) 0", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 28 }}>
          {post.subtitle ? <p style={{ margin: 0, fontSize: 24, lineHeight: 1.5, letterSpacing: "-0.01em" }}>{post.subtitle}</p> : null}
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#6b6b6b" }}>The full post is on Medium.</p>
          <a href={post.url} target="_blank" rel="noreferrer" className="kv-btn" style={{ alignSelf: "flex-start" }}>Read it on Medium ↗</a>
        </div>
      ) : (
        <article className="kv-prose" style={{ maxWidth: 680, margin: "0 auto", padding: "88px clamp(20px, 5vw, 48px) 0", boxSizing: "border-box" }} dangerouslySetInnerHTML={{ __html: post.html }} />
      )}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "72px clamp(20px, 5vw, 48px) 120px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 32 }}>
        <p style={{ margin: 0, paddingTop: 24, borderTop: "1px solid #ddd", fontSize: 15, color: "#6b6b6b" }}>Originally published on <a href={post.url} target="_blank" rel="noreferrer" style={{ color: "#000", textUnderlineOffset: 4 }}>Medium ↗</a></p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          {older ? <TLink href={`/writing/${older.slug}`} direction="left" style={{ display: "flex", flexDirection: "column", gap: 6, textDecoration: "none", maxWidth: 300 }}><span className="kv-label" style={{ color: "#6b6b6b" }}>Previous post</span><span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.25 }}>{older.title}</span></TLink> : <span />}
          {newer ? <TLink href={`/writing/${newer.slug}`} direction="right" style={{ display: "flex", flexDirection: "column", gap: 6, textDecoration: "none", maxWidth: 300, textAlign: "right", marginLeft: "auto" }}><span className="kv-label" style={{ color: "#6b6b6b" }}>Next post</span><span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.25 }}>{newer.title}</span></TLink> : null}
        </div>
      </div>
    </>
  );
}
