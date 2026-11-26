"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "@/content/experience";
import { Segments } from "@/components/segments";
import { TLink } from "@/components/tlink";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const TONES = ["#2f2f2f", "#262626", "#1c1c1c"];

export function ExperienceScenes() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      setP(Math.max(0, -top) / window.innerHeight);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // One gesture = one scene: snap to each scene and never fly past one, however hard you scroll.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollSnapType;
    html.style.scrollSnapType = "y mandatory";
    return () => { html.style.scrollSnapType = prev; };
  }, []);

  const e0 = ease(clamp(p, 0, 1));
  // Opening: "Eight years in." starts as one line with no picture. On scroll the words part
  // and the first photo opens from a slit between them until it fills the screen.
  const fx = e0;
  const fy = 0.13 + 0.87 * e0;
  const insetX = ((1 - fx) * 50).toFixed(2);
  const insetY = ((1 - fy) * 50).toFixed(2);
  const wordEdge = `calc(${(50 + fx * 50).toFixed(2)}% + 0.13em)`;
  const n = experience.length;

  return (
    <main ref={ref} style={{ height: `${(n + 2.3) * 100}svh`, position: "relative", background: "#000" }}>
      {/* Snap stops: the opening, each company fully in view, then the end panel. */}
      {Array.from({ length: n + 1 }, (_, i) => (
        <div key={i} aria-hidden="true" style={{ position: "absolute", left: 0, width: 1, height: 1, top: `${i * 100}svh`, scrollSnapAlign: "start", scrollSnapStop: "always" }} />
      ))}
      <div aria-hidden="true" style={{ position: "absolute", left: 0, width: 1, height: 1, bottom: 0, scrollSnapAlign: "end", scrollSnapStop: "always" }} />
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden", background: "#fff" }}>
        <h1 data-kv-title style={{ margin: 0, position: "absolute", inset: 0, pointerEvents: "none", fontSize: "clamp(56px, 8vw, 128px)", fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1, color: "#000" }}>
          <span style={{ position: "absolute", top: "50%", right: wordEdge, transform: "translateY(-50%)", opacity: 1 - e0 * 0.6, whiteSpace: "nowrap" }}>Eight</span>{" "}
          <span style={{ position: "absolute", top: "50%", left: wordEdge, transform: "translateY(-50%)", opacity: 1 - e0 * 0.6, whiteSpace: "nowrap" }}>years in.</span>
        </h1>

        {experience.map((c, k) => {
          const enter = k === 0 ? 1 : ease(clamp(p - k, 0, 1));
          const cover = ease(clamp(p - (k + 1), 0, 1));
          const textOp = k === 0 ? clamp((p - 0.8) / 0.2, 0, 1) : clamp((p - k - 0.55) / 0.35, 0, 1);
          const clip = k === 0 && p < 1 ? `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${(10 * (1 - e0)).toFixed(1)}px)` : "none";
          return (
            <section key={c.name} aria-label={c.name} style={{ position: "absolute", inset: 0, zIndex: k + 1, transform: `translateY(${((1 - enter) * 100).toFixed(2)}%) scale(${(1 - 0.08 * cover).toFixed(4)})`, transformOrigin: "50% 30%", borderRadius: `${(28 * cover).toFixed(1)}px`, clipPath: clip, overflow: "hidden", background: TONES[k % TONES.length], color: "#fff" }}>
              {c.photo ? (
                <picture>
                  {c.photoPortrait ? <source media="(max-aspect-ratio: 4/5)" srcSet={c.photoPortrait} /> : null}
                  <img src={c.photo} alt="" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </picture>
              ) : null}
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.2) 100%)" }} />
              <div style={{ position: "absolute", left: "clamp(24px, 5vw, 72px)", right: "clamp(24px, 5vw, 72px)", bottom: 120, display: "flex", flexDirection: "column", gap: 14, opacity: textOp, transform: `translateY(${((1 - textOp) * 24).toFixed(1)}px)` }}>
                <span className="kv-tag kv-glass-dark" style={{ alignSelf: "flex-start", height: 34, fontSize: 14 }}>{c.role}, {c.years}</span>
                <h2 style={{ margin: 0, fontSize: "clamp(44px, 11vw, 168px)", fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.9 }}>{c.name}</h2>
                <div style={{ marginTop: 8, maxWidth: 820, display: "flex", flexDirection: "column", gap: 12, fontSize: "clamp(18px, 1.7vw, 24px)", lineHeight: 1.5, color: "rgba(255,255,255,0.88)" }}>
                  {c.paras.map((para, j) => <p key={j} style={{ margin: 0 }}><Segments parts={para} hlStyle={{ color: "#fff", textUnderlineOffset: 5 }} /></p>)}
                </div>
              </div>
              {c.credit ? (
                <a href={c.credit.href || undefined} target={c.credit.href ? "_blank" : undefined} rel="noreferrer" className="kv-tag kv-glass-dark" style={{ position: "absolute", right: "clamp(24px, 5vw, 72px)", top: 28, height: 26, padding: "0 12px", fontSize: 12, color: "rgba(255,255,255,0.85)", textDecoration: "none", opacity: textOp }}>{c.credit.text}</a>
              ) : null}
              <span style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.6 * cover, pointerEvents: "none" }} />
            </section>
          );
        })}

        <section aria-label="Earlier experience, education and certifications" style={{ position: "absolute", inset: 0, zIndex: n + 1, transform: `translateY(${((1 - ease(clamp(p - n, 0, 1))) * 100).toFixed(2)}%)`, background: "#fff", color: "#000", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "0 clamp(24px, 8vw, 160px)", boxSizing: "border-box" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, opacity: clamp((p - n - 0.5) / 0.35, 0, 1) }}>
            <h2 className="kv-label" style={{ margin: 0, color: "#6b6b6b" }}>Before Dublin</h2>
            <p style={{ margin: 0, maxWidth: 760, fontSize: "clamp(22px, 2.2vw, 30px)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.3 }}>Two years as a software engineer in India, building identity and access management software.</p>
            <h2 className="kv-label" style={{ margin: "12px 0 0", color: "#6b6b6b" }}>Education and certifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "clamp(22px, 2.2vw, 30px)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.3 }}>
              <span>MSc Computing, Dublin City University</span>
              <span>Google Cloud Professional Data Engineer</span>
              <span>AWS Developer</span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              <a href="/Kunal_Vaidya_CV.pdf" download="Kunal_Vaidya_CV.pdf" className="kv-btn">Download CV</a>
              <TLink href="/contact" className="kv-btn kv-btn--ghost" style={{ height: 50, padding: "0 27px" }}>Get in touch</TLink>
            </div>
          </div>
        </section>

        <span className="kv-label" style={{ position: "absolute", right: 32, bottom: 36, zIndex: 20, color: "#6b6b6b", opacity: p < 0.15 ? 1 : 0, transition: "opacity 300ms ease" }}>Scroll</span>
      </div>
    </main>
  );
}
