"use client";

import { useState } from "react";
import { TLink } from "@/components/tlink";

const DOORS = [
  { href: "/work", name: "Work", peek: "systms, Onyx, Reckoner and TimeSync", bg: "#1a1a1a", fg: "#fff", morphBg: "#000" },
  { href: "/experience", name: "Experience", peek: "Squarespace, IBM and Mastercard", bg: "#2f2f2f", fg: "#fff", morphBg: "#fff" },
  { href: "/writing", name: "Writing", peek: "Posts from Medium", bg: "#f4f4f4", fg: "#000", morphBg: "#fff" },
  { href: "/life", name: "Life", peek: "Photo albums and the stories behind them", bg: "#2f2f2f", fg: "#fff", image: "/images/photo-land.jpg", shade: 0.25, morphBg: "#2f2f2f" },
  { href: "/contact", name: "Contact", peek: "Email, socials and a message form", bg: "#2f2f2f", fg: "#fff", image: "/images/photo-wide.jpg", shade: 0.45, morphBg: "#2f2f2f" },
];

export function HomeDoors() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <nav aria-label="Pages" onMouseLeave={() => setHover(null)} className="kv-doors" style={{ marginTop: "auto", paddingTop: 48, display: "flex", gap: 12, height: "clamp(300px, 46vh, 480px)" }}>
      {DOORS.map((d) => {
        const active = hover === d.href;
        return (
          <TLink
            key={d.href}
            href={d.href}
            morph={{ background: d.morphBg, image: d.image }}
            onMouseEnter={() => setHover(d.href)}
            onFocus={() => setHover(d.href)}
            className="kv-door"
            style={{
              position: "relative", flex: `${hover ? (active ? 3 : 0.75) : 1} 1 0`, minWidth: 0, borderRadius: 6, overflow: "hidden",
              backgroundColor: d.bg, backgroundImage: d.image ? `url(${d.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center",
              color: d.fg, padding: 20, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "flex-end",
              textDecoration: "none", transition: "flex-grow 700ms var(--ease)",
            }}
          >
            {d.shade ? <span style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${d.shade})` }} /> : null}
            <span style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8, whiteSpace: "nowrap" }}>
              <span className={d.image ? "kv-tag kv-glass-dark" : undefined} style={{ alignSelf: "flex-start", fontSize: 14, opacity: active ? (d.image ? 1 : 0.8) : 0, transition: "opacity 400ms ease" }}>{d.peek}</span>
              <span style={{ fontSize: "clamp(24px, 2.4vw, 40px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>{d.name}</span>
            </span>
          </TLink>
        );
      })}
    </nav>
  );
}
