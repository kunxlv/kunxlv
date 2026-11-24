import { HomeDoors } from "./home-doors";

export default function Home() {
  return (
    <main style={{ minHeight: "100svh", background: "#fff", color: "#000", display: "flex", flexDirection: "column", padding: "32px clamp(20px, 5vw, 64px) 40px", boxSizing: "border-box" }}>
      <p style={{ margin: 0, fontSize: 15, color: "#6b6b6b" }}>Senior backend engineer in Dublin</p>
      <div data-kv-title style={{ marginTop: "clamp(40px, 8vh, 96px)", display: "flex", flexDirection: "column", gap: 28 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(64px, 11vw, 176px)", fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.86 }}>Kunal Vaidya</h1>
        <p style={{ margin: 0, maxWidth: 760, fontSize: "clamp(22px, 2.2vw, 30px)", lineHeight: 1.35, letterSpacing: "-0.01em", color: "#6b6b6b" }}>
          I build backend systems for a living, <span style={{ color: "#000" }}>and everything else for fun.</span>
        </p>
      </div>
      <HomeDoors />
    </main>
  );
}
