import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer style={{ background: "#1a1a1a", color: "#fff", padding: "72px 24px 140px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>Kunal Vaidya</span>
      <p style={{ margin: 0, fontSize: 14, color: "#cfcfcf" }}>Senior backend engineer in Dublin</p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", fontSize: 14 }}>
        {site.socials.filter((s) => s.url).map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{ color: "#fff" }}>{s.name}</a>
        ))}
      </div>
    </footer>
  );
}
