"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const REST = 560;
const PEAK = 860;
const RADIUS = 260; // px of influence around the pointer

/**
 * The name on Home, sized to run edge to edge. Each letter's weight follows the pointer:
 * Urbanist is a variable font, so letters near the cursor thicken and relax as it moves on.
 */
export function HomeName({ text }: { text: string }) {
  const box = useRef<HTMLHeadingElement>(null);
  const letters = useRef<HTMLSpanElement[]>([]);

  // Fit the name to the container width, measured at the heaviest weight so it never overflows.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const probe = document.createElement("span");
      probe.textContent = text;
      Object.assign(probe.style, { position: "absolute", visibility: "hidden", whiteSpace: "nowrap", fontSize: "100px", fontWeight: String(PEAK), letterSpacing: "-0.06em", fontFamily: getComputedStyle(el).fontFamily });
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      el.style.fontSize = `${Math.floor((el.clientWidth / w) * 100 * 0.995)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [text]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (still || !finePointer) return;
    let raf = 0;
    let px = -9999;
    let py = -9999;
    const paint = () => {
      raf = 0;
      for (const l of letters.current) {
        if (!l) continue;
        const r = l.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / RADIUS);
        const eased = t * t * (3 - 2 * t);
        l.style.fontVariationSettings = `"wght" ${Math.round(REST + (PEAK - REST) * eased)}`;
      }
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => {
      px = py = -9999;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h1 ref={box} aria-label={text} style={{ margin: 0, fontSize: "clamp(64px, 15vw, 280px)", fontWeight: REST, letterSpacing: "-0.06em", lineHeight: 0.86, whiteSpace: "nowrap", width: "100%" }}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true" ref={(n) => { if (n) letters.current[i] = n; }}
          style={{ display: "inline-block", whiteSpace: "pre", fontVariationSettings: `"wght" ${REST}`, transition: "font-variation-settings 380ms cubic-bezier(0.22, 1, 0.36, 1)" }}>
          {ch}
        </span>
      ))}
    </h1>
  );
}
