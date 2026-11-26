import type { Metadata } from "next";
import { site } from "@/content/site";
import { ContactForm, CopyEmail, LocalTime } from "./contact-client";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with Kunal Vaidya, a senior backend engineer in Dublin, about roles, freelance projects or anything else." };

const ICONS: Record<string, React.ReactNode> = {
  GitHub: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  LinkedIn: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  Medium: <><circle cx="7" cy="12" r="5" /><ellipse cx="16.5" cy="12" rx="2.5" ry="4.6" /><ellipse cx="21.5" cy="12" rx="0.9" ry="4.2" /></>,
  Instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>,
};

export default function ContactPage() {
  const socials = site.socials.filter((s) => s.url);
  return (
    <main style={{ minHeight: "100svh", display: "flex", flexWrap: "wrap", background: "#fff", color: "#000" }}>
      <style>{`.kv-social { transition: padding-left 300ms ease } .kv-social:hover { padding-left: 8px }`}</style>
      <section style={{ position: "relative", flex: "1 1 560px", minHeight: "100svh", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "32px clamp(20px, 5vw, 64px) 120px", boxSizing: "border-box", backgroundColor: "#2f2f2f", backgroundImage: "url(/images/photo-wide.jpg)", backgroundSize: "cover", backgroundPosition: "30% 30%" }}>
        <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>Kunal Vaidya</span>
          {site.status ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 16px", borderRadius: 100, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.16)", fontSize: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />{site.status}
            </span>
          ) : null}
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 40, marginTop: 48 }}>
          <h1 data-kv-title style={{ margin: 0, fontSize: "clamp(64px, 8vw, 128px)", fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.9 }}>Say hello.</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="kv-label" style={{ color: "rgba(255,255,255,0.75)" }}>Email</span>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <a href={`mailto:${site.email}`} style={{ fontSize: "clamp(24px, 2.4vw, 32px)", fontWeight: 500, letterSpacing: "-0.02em", textUnderlineOffset: 6, textDecorationThickness: 1 }}>{site.email}</a>
              <CopyEmail email={site.email} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span className="kv-label" style={{ color: "rgba(255,255,255,0.75)" }}>Based in</span><span style={{ fontSize: 20 }}>{site.location}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span className="kv-label" style={{ color: "rgba(255,255,255,0.75)" }}>My time</span><LocalTime timeZone={site.timeZone} /></div>
          </div>
          {socials.length ? (
            <nav aria-label="Social links" style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.3)", maxWidth: 520 }}>
              {socials.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="kv-social" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 20, fontWeight: 500 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[s.name]}</svg>
                    {s.name}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </section>
      <section style={{ flex: "1 1 520px", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "96px clamp(20px, 5vw, 80px) 140px", boxSizing: "border-box" }}>
        <ContactForm />
      </section>
    </main>
  );
}
