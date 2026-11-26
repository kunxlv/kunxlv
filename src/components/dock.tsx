"use client";

import { usePathname } from "next/navigation";
import { TLink } from "./tlink";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/builds", label: "Builds" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/life", label: "Life" },
  { href: "/contact", label: "Contact" },
];

export function Dock() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname.startsWith("/admin");
  return (
    <nav
      aria-label="Site"
      aria-hidden={onHome}
      style={{
        position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", zIndex: 1000,
        display: "flex", alignItems: "center", gap: 2, padding: "6px clamp(2px, 1vw, 6px)", borderRadius: 100,
        background: "rgba(24,24,24,0.58)", boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.16)",
        maxWidth: "calc(100% - 16px)", overflowX: "auto",
        opacity: onHome ? 0 : 1, pointerEvents: onHome ? "none" : "auto", transition: "opacity 400ms ease",
      }}
    >
      {ITEMS.map((it) => {
        const active = it.href === "/" ? onHome : pathname.startsWith(it.href);
        return (
          <TLink
            key={it.href}
            href={it.href}
            tabIndex={onHome ? -1 : undefined}
            aria-current={active ? "page" : undefined}
            style={{
              display: "inline-flex", alignItems: "center", height: 44, padding: "0 clamp(6px, 2vw, 16px)", color: "#fff",
              fontSize: "clamp(12.5px, 3.4vw, 15px)", fontWeight: active ? 600 : 500, whiteSpace: "nowrap",
              textDecoration: active ? "underline" : "none", textDecorationThickness: "1.5px", textUnderlineOffset: 7,
            }}
          >
            {it.label}
          </TLink>
        );
      })}
    </nav>
  );
}
