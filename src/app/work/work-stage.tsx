"use client";

import { useEffect, useRef, useState, type MouseEvent, type WheelEvent } from "react";
import { projects, type Project } from "@/content/projects";
import { Segments } from "@/components/segments";

const D = 800;
const E = "var(--ease)";
const TILE = 380;
const GAP = 24;
type Phase = "idle" | "start" | "grow" | "done" | "cstart" | "shrink";

export function WorkStage() {
  const rootRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastWheel = useRef(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [jump, setJump] = useState(false);
  const [box, setBox] = useState({ l: 0, t: 0 });
  const [size, setSize] = useState({ W: 1440, H: 900 });
  const [titleScale, setTitleScale] = useState(0.15);
  const tilt = 58;
  const n = projects.length;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  const raf2 = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

  function stripInfo() {
    const strip = stripRef.current;
    const root = rootRef.current;
    let tx = 0;
    if (strip) {
      try { tx = new DOMMatrix(getComputedStyle(strip).transform).m41; } catch { tx = 0; }
    }
    const r = root?.getBoundingClientRect();
    return { tiles: strip ? Array.from(strip.querySelectorAll<HTMLButtonElement>(".kv-tile")) : [], tx, W: Math.round(r?.width ?? 1440), H: Math.round(r?.height ?? 900) };
  }

  function openFrom(e: MouseEvent<HTMLButtonElement>, k: number) {
    if (phase !== "idle") return;
    const tile = e.currentTarget;
    const info = stripInfo();
    const j = info.tiles.indexOf(tile);
    let ty = 0;
    try { ty = new DOMMatrix(getComputedStyle(tile).transform).m42; } catch { ty = 0; }
    setTitleScale(20 / Math.min(136, Math.max(56, info.W * 0.09)));
    setSize({ W: info.W, H: info.H });
    setBox({ l: Math.round(j * (TILE + GAP) + info.tx), t: Math.round(ty) });
    setI(k);
    setJump(true);
    setPhase("start");
    raf2(() => setPhase("grow"));
    later(() => { setOpen(true); setPhase("done"); }, D + 20);
    later(() => setJump(false), D + 150);
  }

  function close() {
    if (phase !== "done") return;
    const info = stripInfo();
    let best = box;
    let bestD = Infinity;
    info.tiles.forEach((el, j) => {
      if (el.dataset.pid !== String(i)) return;
      const x = j * (TILE + GAP) + info.tx;
      const d = Math.abs(x + TILE / 2 - info.W / 2);
      if (d < bestD) { bestD = d; best = { l: Math.round(x), t: 0 }; }
    });
    setBox(best);
    setSize({ W: info.W, H: info.H });
    setPhase("cstart");
    raf2(() => { setPhase("shrink"); setOpen(false); });
    later(() => setPhase("idle"), D + 20);
  }

  function step(d: number, at?: number) {
    if (at !== undefined) {
      if (at - lastWheel.current < 900) return;
      lastWheel.current = at;
    }
    setI((cur) => Math.min(n - 1, Math.max(0, cur + d)));
  }

  function onWheel(e: WheelEvent) {
    if (!open) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) > 12) step(delta > 0 ? 1 : -1, e.timeStamp);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const moving = open || phase === "grow" || phase === "cstart";
  const isFull = phase === "grow" || phase === "done" || phase === "cstart";
  const still = phase === "start" || phase === "cstart";
  const cur = projects[i];
  const ink = moving ? "#000" : "#fff";
  const strip = [...projects, ...projects];

  return (
    <main ref={rootRef} onWheel={onWheel} style={{ position: "relative", height: "100svh", minHeight: 680, overflow: "hidden", background: "#000" }}>
      <style>{`
        @keyframes kv-strip { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .kv-strip { animation: kv-strip 36s linear infinite; }
        .kv-strip:hover { animation-play-state: paused; }
        .kv-tile { transition: transform 400ms ease; }
        .kv-tile:hover, .kv-tile:focus-visible { transform: translateY(-14px); }
      `}</style>

      <div aria-hidden={moving} style={{ position: "absolute", inset: 0, opacity: moving ? 0 : 1, transition: "opacity 500ms ease", pointerEvents: moving ? "none" : "auto" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: TILE, perspective: 1400 }}>
          <div style={{ transform: `rotateX(${tilt}deg)`, transformOrigin: "50% 0%" }}>
            <div ref={stripRef} className="kv-strip" style={{ display: "flex", gap: GAP, width: "max-content", animationPlayState: phase === "idle" ? "running" : "paused" }}>
              {strip.map((p, j) => (
                <button key={j} type="button" className="kv-tile" data-pid={projects.indexOf(p)} onClick={(e) => openFrom(e, projects.indexOf(p))} aria-label={`Open ${p.name}`}
                  style={{ flex: "none", width: TILE, height: TILE, border: 0, borderRadius: 6, position: "relative", overflow: "hidden", background: p.shots?.length ? `#111 url(${p.shots[0].src}) left top / cover` : p.tile.bg, color: p.shots?.length ? "#fff" : p.tile.fg, padding: 28, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", textAlign: "left", fontFamily: "inherit", cursor: "pointer" }}>
                  {p.shots?.length ? <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0) 55%)" }} /> : null}
                  <span className="kv-tag kv-glass-dark" style={{ position: "relative" }}>{p.kind}</span>
                  <span style={{ position: "relative", fontSize: 52, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1 }}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p style={{ position: "absolute", top: 330, left: 0, right: 0, margin: "0 auto", maxWidth: 540, padding: "0 20px", textAlign: "center", fontSize: 19, lineHeight: 1.5, color: "#b5b5b5" }}>An iOS app, my own home server and a couple of web tools, built after hours. Pick one to open it.</p>
      </div>

      <div aria-hidden={!open} style={{ position: "absolute", inset: 0, background: "#f4f4f4", color: "#000", opacity: open ? 1 : 0, transition: `opacity ${phase === "done" ? "200ms" : "0ms"} ease`, pointerEvents: open ? "auto" : "none" }}>
        {projects.map((p, k) => {
          const off = k - i;
          const tr = jump ? "none" : `transform 1000ms cubic-bezier(0.76, 0, 0.24, 1), opacity 1000ms ease`;
          return (
            <section key={p.slug} aria-label={p.name} aria-hidden={off !== 0} style={{ position: "absolute", inset: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px 64px", padding: "130px clamp(20px, 5vw, 64px) 170px", boxSizing: "border-box", transform: `translateX(${off * 100}%)`, opacity: off === 0 ? 1 : 0.35, transition: tr, pointerEvents: off === 0 && open ? "auto" : "none", overflowY: "auto" }}>
              <ProjectDetails p={p} />
              <div aria-hidden="true" style={{ flex: "999 1 520px", minWidth: 0, height: 540, position: "relative", transform: `translateX(${off * 35}%)`, transition: jump ? "none" : "transform 1000ms cubic-bezier(0.76, 0, 0.24, 1)" }}>
                <ProjectVisual p={p} />
              </div>
            </section>
          );
        })}
        <div style={{ position: "absolute", left: "50%", bottom: 100, transform: "translateX(-50%)", zIndex: 6, display: "flex", gap: 12 }}>
          <RoundButton label="Previous project" onClick={() => step(-1)} disabled={i === 0}><path d="M8 2 L2 8 L8 14" fill="none" stroke="#000" strokeWidth="1.4" /></RoundButton>
          <button type="button" onClick={close} aria-label="Back to all projects" style={{ width: 48, height: 48, borderRadius: "50%", border: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2 L12 12 M12 2 L2 12" fill="none" stroke="#fff" strokeWidth="1.4" /></svg>
          </button>
          <RoundButton label="Next project" onClick={() => step(1)} disabled={i === n - 1}><path d="M2 2 L8 8 L2 14" fill="none" stroke="#000" strokeWidth="1.4" /></RoundButton>
        </div>
      </div>

      {/* The card that lifts out of the floor */}
      <div aria-hidden="true" style={{ position: "absolute", zIndex: 7, left: 0, right: 0, top: 470, height: TILE, perspective: 1400, pointerEvents: "none", opacity: phase === "idle" || phase === "done" ? 0 : 1, transition: "opacity 200ms ease" }}>
        <div style={{ position: "relative", height: TILE, transform: `rotateX(${isFull ? 0 : tilt}deg)`, transformOrigin: "50% 0%", transition: still ? "none" : `transform ${D}ms ${E}` }}>
          <div style={{
            position: "absolute", left: isFull ? 0 : box.l, top: isFull ? -470 : box.t, width: isFull ? size.W : TILE, height: isFull ? size.H : TILE,
            borderRadius: isFull ? 0 : 6, background: isFull ? "#f4f4f4" : cur.tile.bg, overflow: "hidden",
            transition: still ? "none" : ["left", "top", "width", "height", "border-radius", "background-color"].map((p) => `${p} ${D}ms ${E}`).join(", "),
          }}>
            {cur.shots?.length ? (
              <span style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0) 55%), #111 url(${cur.shots[0].src}) left top / cover`, opacity: phase === "start" || phase === "shrink" ? 1 : 0, transition: phase === "shrink" ? "opacity 300ms ease 500ms" : still ? "none" : "opacity 250ms ease" }} />
            ) : null}
            <span className={cur.shots?.length ? "kv-tag kv-glass-dark" : "kv-label"} style={{ position: "absolute", left: 28, top: 28, color: cur.shots?.length ? "#fff" : cur.tile.sub, opacity: phase === "start" || phase === "shrink" ? 1 : 0, transition: phase === "shrink" ? "opacity 300ms ease 500ms" : still ? "none" : "opacity 250ms ease", whiteSpace: "nowrap" }}>{cur.kind}</span>
            <span style={{ position: "absolute", left: 28, bottom: 28, fontSize: 52, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1, color: cur.shots?.length ? "#fff" : cur.tile.fg, opacity: phase === "start" || phase === "shrink" ? 1 : 0, transition: phase === "shrink" ? "opacity 300ms ease 500ms" : still ? "none" : "opacity 250ms ease", whiteSpace: "nowrap" }}>{cur.name}</span>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 8, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "32px clamp(20px, 5vw, 64px)", color: ink, transition: `color ${D}ms ${E}` }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>Kunal Vaidya</span>
        <span style={{ fontSize: 15, fontWeight: 500, color: moving ? "#6b6b6b" : "#b5b5b5", fontVariantNumeric: "tabular-nums", transition: `color ${D}ms ${E}` }}>
          {open ? `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}` : `${String(n).padStart(2, "0")} projects`}
        </span>
      </div>

      <h1 data-kv-title style={{ position: "absolute", zIndex: 8, left: 0, right: 0, top: 168, margin: 0, textAlign: "center", fontSize: "clamp(56px, 9vw, 136px)", fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.92, color: ink, transform: moving ? `translateY(-134px) scale(${titleScale})` : "none", transformOrigin: "50% 0", transition: `transform ${D}ms ${E}, color ${D}ms ${E}`, pointerEvents: "none" }}>
        Things I&apos;ve shipped.
      </h1>
    </main>
  );
}

function RoundButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="kv-glass" style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.3 : 1 }}>
      <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">{children}</svg>
    </button>
  );
}

function ProjectDetails({ p }: { p: Project }) {
  return (
    <div style={{ flex: "1 1 420px", minWidth: 0, maxWidth: 560, display: "flex", flexDirection: "column", gap: 22 }}>
      <span className="kv-label" style={{ color: "#6b6b6b" }}>{p.kind}</span>
      <h2 style={{ margin: 0, fontSize: "clamp(64px, 8.5vw, 132px)", fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.9 }}>{p.name}</h2>
      <p style={{ margin: 0, fontSize: "clamp(18px, 1.5vw, 21px)", lineHeight: 1.55, color: "#2f2f2f" }}><Segments parts={p.text} /></p>
      <dl style={{ margin: 0, display: "flex", flexDirection: "column", borderTop: "1px solid #ddd" }}>
        {p.facts.map((f) => (
          <div key={f.k} style={{ display: "flex", gap: 24, padding: "12px 0", borderBottom: "1px solid #ddd", fontSize: 15 }}>
            <dt style={{ width: 96, flex: "none", color: "#6b6b6b" }}>{f.k}</dt>
            <dd style={{ margin: 0 }}>{f.v}</dd>
          </div>
        ))}
      </dl>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {p.links.map((l) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={l.primary ? "kv-btn" : "kv-btn kv-btn--ghost"} style={{ height: 48, padding: "0 24px" }}>{l.label}</a>
        ))}
      </div>
    </div>
  );
}

function Card({ style, label }: { style: React.CSSProperties; label: string }) {
  return <div style={{ position: "absolute", borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", display: "flex", alignItems: "flex-end", padding: 18, boxSizing: "border-box", fontSize: 13, color: "#6b6b6b", ...style }}>{label}</div>;
}

function ProjectVisual({ p }: { p: Project }) {
  if (p.visual === "system") {
    return (
      <div style={{ position: "absolute", left: "14%", top: "8%", width: "72%", height: "82%", borderRadius: 18, background: "#1a1a1a", color: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", padding: 36, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, fontSize: 16 }}>
        <div style={{ border: "1px solid #555", borderRadius: 10, padding: "14px 18px" }}>You, anywhere</div>
        <div style={{ paddingLeft: 20, color: "#b5b5b5" }}>↓ Tailscale</div>
        <div style={{ border: "1px solid #fff", borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontWeight: 600 }}>onyx, a Mac mini</span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["Homebase dashboard", "[Service]", "[Service]"].map((s, k) => <span key={k} style={{ border: "1px solid #555", borderRadius: 100, padding: "6px 12px", fontSize: 14 }}>{s}</span>)}
          </div>
        </div>
      </div>
    );
  }
  if (p.visual === "phones") {
    return (
      <>
        <Card label="[Screen]" style={{ left: "4%", top: "10%", width: "30%", height: "86%", transform: "rotate(-9deg)", background: "#dadad4" }} />
        <Card label="[Screen]" style={{ left: "64%", top: "10%", width: "30%", height: "86%", transform: "rotate(9deg)", background: "#cfcfca" }} />
        <Card label="[Screen]" style={{ left: "34%", top: "4%", width: "30%", height: "86%", background: "#2f2f2f", color: "#8a8a8a" }} />
      </>
    );
  }
  if (p.shots?.length) {
    const [front, back] = p.shots;
    return (
      <>
        {back ? <BrowserShot shot={back} style={{ left: "26%", top: "4%", width: "72%", transform: "rotate(3deg)", opacity: 0.9 }} /> : null}
        <BrowserShot shot={front} style={back ? { left: "2%", top: "22%", width: "78%" } : { left: "6%", top: "10%", width: "88%" }} />
      </>
    );
  }
  return (
    <>
      <Card label="[Screenshot]" style={{ left: 0, top: "18%", width: "58%", height: "58%", transform: "rotate(-7deg)", background: "#dadad4" }} />
      <Card label="[Screenshot]" style={{ left: "40%", top: "30%", width: "58%", height: "58%", transform: "rotate(6deg)", background: "#cfcfca" }} />
      <Card label="[Screenshot]" style={{ left: "16%", top: "6%", width: "66%", height: "62%", background: "#fff" }} />
    </>
  );
}

function BrowserShot({ shot, style }: { shot: { src: string; url: string }; style: React.CSSProperties }) {
  return (
    <figure style={{ position: "absolute", margin: 0, borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)", ...style }}>
      <div style={{ height: 30, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: "#f1f1f1", borderBottom: "1px solid #e2e2e2" }}>
        {[0, 1, 2].map((k) => <span key={k} style={{ width: 9, height: 9, borderRadius: "50%", background: "#d0d0d0" }} />)}
        <span style={{ marginLeft: 10, flex: 1, height: 18, borderRadius: 5, background: "#fff", fontSize: 11, color: "#6b6b6b", display: "flex", alignItems: "center", padding: "0 8px", overflow: "hidden", whiteSpace: "nowrap" }}>{shot.url}</span>
      </div>
      <img src={shot.src} alt={`Screenshot of ${shot.url}`} loading="lazy" style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top left" }} />
    </figure>
  );
}
