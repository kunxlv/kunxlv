"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "@/content/experience";
import { Segments } from "@/components/segments";
import { TLink } from "@/components/tlink";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const TONES = ["#2f2f2f", "#262626", "#1c1c1c"];

export function ExperienceScenes() {
  const ref = useRef<HTMLDivElement>(null);
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

  const e0 = ease(clamp(p, 0, 1));
  const frac = 0.2 + 0.8 * e0;
  const inset = ((1 - frac) * 50).toFixed(2);
  const wordEdge = `calc(${(50 + frac * 50).toFixed(2)}% + 28px)`;
  const n = experience.length;

  return (
    <div ref={ref} style={{ height: `${(n + 2.3) * 100}svh`, position: "relative", background: "#000" }}>
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden", background: "#fff" }}>
        <h1 data-kv-title style={{ margin: 0, position: "absolute", inset: 0, pointerEvents: "none", fontSize: "clamp(56px, 8vw, 128px)", fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1, color: "#000" }}>
          <span style={{ position: "absolute", top: "50%", right: wordEdge, transform: "translateY(-50%)", opacity: 1 - e0 * 0.6, whiteSpace: "nowrap" }}>Eight</span>
          <span style={{ position: "absolute", top: "50%", left: wordEdge, transform: "translateY(-50%)", opacity: 1 - e0 * 0.6, whiteSpace: "nowrap" }}>years in.</span>
        </h1>

        {experience.map((c, k) => {
          const enter = k === 0 ? 1 : ease(clamp(p - k, 0, 1));
          const cover = ease(clamp(p - (k + 1), 0, 1));
          const textOp = k === 0 ? clamp((p - 0.8) / 0.2, 0, 1) : clamp((p - k - 0.55) / 0.35, 0, 1);
          const clip = k === 0 && p < 1 ? `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${(10 * (1 - e0)).toFixed(1)}px)` : "none";
          return (
            <section key={c.name} aria-label={c.name} style={{ position: "absolute", inset: 0, zIndex: k + 1, transform: `translateY(${((1 - enter) * 100).toFixed(2)}%) scale(${(1 - 0.08 * cover).toFixed(4)})`, transformOrigin: "50% 30%", borderRadius: `${(28 * cover).toFixed(1)}px`, clipPath: clip, overflow: "hidden", background: TONES[k % TONES.length], color: "#fff" }}>
              {c.photo ? <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${c.photo})`, backgroundSize: "cover", backgroundPosition: "center" }} /> : <span style={{ position: "absolute", left: 32, top: 28, fontSize: 13, color: "#8a8a8a" }}>[Photo: {c.name}, Dublin]</span>}
              <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
              <div style={{ position: "absolute", left: "clamp(24px, 5vw, 72px)", right: "clamp(24px, 5vw, 72px)", bottom: 120, display: "flex", flexDirection: "column", gap: 14, opacity: textOp, transform: `translateY(${((1 - textOp) * 24).toFixed(1)}px)` }}>
                <span className="kv-label" style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>{c.years} · {c.role}</span>
                <h2 style={{ margin: 0, fontSize: "clamp(64px, 11vw, 168px)", fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.9 }}>{c.name}</h2>
                <div style={{ marginTop: 8, maxWidth: 820, display: "flex", flexDirection: "column", gap: 12, fontSize: "clamp(18px, 1.7vw, 24px)", lineHeight: 1.5, color: "rgba(255,255,255,0.88)" }}>
                  {c.paras.map((para, j) => <p key={j} style={{ margin: 0 }}><Segments parts={para} hlStyle={{ color: "#fff", textUnderlineOffset: 5 }} /></p>)}
                </div>
              </div>
              <span style={{ position: "absolute", inset: 0, background: "#000", opacity: 0.6 * cover, pointerEvents: "none" }} />
            </section>
          );
        })}

        <section aria-label="Education and certifications" style={{ position: "absolute", inset: 0, zIndex: n + 1, transform: `translateY(${((1 - ease(clamp(p - n, 0, 1))) * 100).toFixed(2)}%)`, background: "#fff", color: "#000", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "0 clamp(24px, 8vw, 160px)", boxSizing: "border-box" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, opacity: clamp((p - n - 0.5) / 0.35, 0, 1) }}>
            <p className="kv-label" style={{ margin: 0, color: "#6b6b6b" }}>Also</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "clamp(22px, 2.2vw, 30px)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.3 }}>
              <span>MSc Computing, Dublin City University</span>
              <span>Google Cloud Professional Data Engineer</span>
              <span>AWS Developer</span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              <a href="/cv.pdf" className="kv-btn">Download CV</a>
              <TLink href="/contact" className="kv-btn kv-btn--ghost" style={{ height: 50, padding: "0 27px" }}>Get in touch</TLink>
            </div>
          </div>
        </section>

        <span className="kv-label" style={{ position: "absolute", right: 32, bottom: 36, zIndex: 20, color: "#6b6b6b", opacity: p < 0.15 ? 1 : 0, transition: "opacity 300ms ease" }}>Scroll ↓</span>
      </div>
    </div>
  );
}
