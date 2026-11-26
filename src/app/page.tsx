import { HomeDoors } from "./home-doors";
import { HomeName } from "./home-name";
import { readAlbums } from "@/lib/albums";

export default async function Home() {
  // First album on the Life page; cached under the "albums" tag, so saving in the admin refreshes it.
  const lifeCover = (await readAlbums())[0]?.cover;
  return (
    <main style={{ minHeight: "100svh", background: "#fff", color: "#000", display: "flex", flexDirection: "column", padding: "32px clamp(20px, 5vw, 64px) 40px", boxSizing: "border-box" }}>
      <p style={{ margin: 0, fontSize: 15, color: "#6b6b6b" }}>Senior backend engineer in Dublin</p>
      <div data-kv-title style={{ marginTop: "clamp(24px, 5vh, 64px)", display: "flex", flexDirection: "column", gap: "clamp(16px, 2.4vw, 32px)" }}>
        <HomeName text="Kunal Vaidya" />
        <p style={{ margin: 0, maxWidth: 760, fontSize: "clamp(22px, 2.2vw, 30px)", lineHeight: 1.35, letterSpacing: "-0.01em", color: "#6b6b6b" }}>
          I build backend systems for a living, <span style={{ color: "#000" }}>and everything else for fun.</span>
        </p>
      </div>
      <HomeDoors lifeCover={lifeCover} />
    </main>
  );
}
