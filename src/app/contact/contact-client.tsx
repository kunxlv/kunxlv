"use client";

import { useEffect, useState, type FormEvent } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={() => { navigator.clipboard?.writeText(email).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{ height: 36, padding: "0 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () => setNow(new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit", timeZone, timeZoneName: "short" }).format(new Date()));
    fmt();
    const t = setInterval(fmt, 30000);
    return () => clearInterval(t);
  }, [timeZone]);
  return <span style={{ fontSize: 20, fontVariantNumeric: "tabular-nums", minHeight: 24 }}>{now}</span>;
}

const TOPICS = [
  { id: "role", label: "A full-time role", ph: "Tell me about the team and the role." },
  { id: "freelance", label: "Freelance project", ph: "What are you building, and by when?" },
  { id: "hi", label: "Just saying hi", ph: "Go on." },
];

const field: React.CSSProperties = { height: 52, padding: "0 16px", border: "1px solid #ddd", background: "#f4f4f4", fontFamily: "inherit", fontSize: 17, borderRadius: 0, color: "#000" };
const label: React.CSSProperties = { fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" };

export function ContactForm() {
  const [topic, setTopic] = useState("role");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, topic: TOPICS.find((t) => t.id === topic)?.label }) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
        <h2 style={{ margin: 0, fontSize: "clamp(32px, 3vw, 44px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}>Thanks. It&apos;s in my inbox.</h2>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "#6b6b6b" }}>I&apos;ll get back to you within a couple of days.</p>
        <button type="button" onClick={() => setState("idle")} className="kv-btn kv-btn--ghost" style={{ alignSelf: "flex-start", marginTop: 8 }}>Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 560, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: "clamp(32px, 3vw, 44px)", fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}>Or send a message.</h2>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "#6b6b6b" }}>I reply within a couple of days.</p>
      </div>
      <fieldset style={{ margin: 0, padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <legend style={{ ...label, padding: 0, marginBottom: 12 }}>What&apos;s it about?</legend>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TOPICS.map((t) => {
            const on = t.id === topic;
            return <button key={t.id} type="button" onClick={() => setTopic(t.id)} aria-pressed={on} style={{ height: 44, padding: "0 18px", borderRadius: 100, border: `1px solid ${on ? "#000" : "#ddd"}`, background: on ? "#000" : "#fff", color: on ? "#fff" : "#000", fontFamily: "inherit", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>{t.label}</button>;
          })}
        </div>
      </fieldset>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 8 }}><label htmlFor="c-name" style={label}>Name</label><input id="c-name" name="name" required autoComplete="name" placeholder="Your name" style={field} /></div>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 8 }}><label htmlFor="c-email" style={label}>Email</label><input id="c-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" style={field} /></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><label htmlFor="c-msg" style={label}>Message</label><textarea id="c-msg" name="message" required rows={6} placeholder={TOPICS.find((t) => t.id === topic)?.ph} style={{ ...field, height: "auto", padding: 16, lineHeight: 1.5, resize: "vertical" }} /></div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
      {state === "error" ? <p role="alert" style={{ margin: 0, fontSize: 15, color: "#000" }}>{error}</p> : null}
      <button type="submit" disabled={state === "sending"} className="kv-btn" style={{ alignSelf: "flex-start", opacity: state === "sending" ? 0.6 : 1 }}>{state === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
