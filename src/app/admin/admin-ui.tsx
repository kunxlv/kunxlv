"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { upload } from "@vercel/blob/client";
import type { Album, AlbumBlock } from "@/content/albums";
import { deleteAlbum, saveAlbum, saveOrder, setLayout, signIn, signOut } from "./actions";

/* ---------- shared bits ---------- */

const ink = "#000";
const slate = "#6b6b6b";
const line = "#d6d6d6";
const field: CSSProperties = { height: 48, padding: "0 14px", border: "1px solid #8c8c8c", background: "#fff", fontFamily: "inherit", fontSize: 16, color: ink, borderRadius: 0, width: "100%", boxSizing: "border-box" };
const labelStyle: CSSProperties = { fontSize: 14, fontWeight: 600 };
const small: CSSProperties = { height: 36, padding: "0 12px", border: `1px solid ${line}`, background: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: ink, cursor: "pointer", whiteSpace: "nowrap" };

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

export function AdminFrame({ children, signedIn }: { children: ReactNode; signedIn: boolean }) {
  return (
    <div style={{ minHeight: "100svh", background: "#f4f4f4", color: ink }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "0 clamp(16px, 4vw, 40px)", height: 64, background: "#fff", borderBottom: `1px solid ${line}` }}>
        <Link href="/admin" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", textDecoration: "none" }}>Kunal Vaidya <span style={{ fontWeight: 500, color: slate }}>/ Albums</span></Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 15 }}>
          <a href="/life" target="_blank" rel="noreferrer" style={{ textUnderlineOffset: 4 }}>View Life page ↗</a>
          {signedIn ? <form action={signOut}><button type="submit" style={{ ...small, border: 0, padding: 0, textDecoration: "underline", textUnderlineOffset: 4, background: "none" }}>Sign out</button></form> : null}
        </nav>
      </header>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "40px clamp(16px, 4vw, 40px) 140px" }}>{children}</div>
    </div>
  );
}

export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${line}`, padding: 28, display: "flex", flexDirection: "column", gap: 10, maxWidth: 640 }}>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</h2>
      <div style={{ fontSize: 16, lineHeight: 1.55, color: "#2f2f2f" }}>{children}</div>
    </div>
  );
}

/* ---------- sign in ---------- */

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} style={{ maxWidth: 400, margin: "10vh auto 0", background: "#fff", border: `1px solid ${line}`, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>Sign in</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor="pw" style={labelStyle}>Password</label>
        <input id="pw" name="password" type="password" required autoComplete="current-password" autoFocus style={field} />
      </div>
      {state?.error ? <p role="alert" style={{ margin: 0, fontSize: 15 }}>{state.error}</p> : null}
      <button type="submit" className="kv-btn" disabled={pending} style={{ justifyContent: "center", opacity: pending ? 0.6 : 1 }}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

/* ---------- album list ---------- */

export function AlbumList({ albums, usingSamples, storage }: { albums: Album[]; usingSamples: boolean; storage: boolean }) {
  const router = useRouter();
  const [order, setOrder] = useState(albums);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setDirty(true);
  };

  async function persistOrder() {
    setBusy(true);
    const res = await saveOrder(order.map((a) => a.slug));
    setBusy(false);
    setMsg(res.ok ? "Order saved." : res.error);
    if (res.ok) { setDirty(false); router.refresh(); }
  }

  async function changeLayout(slug: string, size: "full" | "third") {
    setOrder((o) => o.map((a) => (a.slug === slug ? { ...a, size } : a)));
    const res = await setLayout(slug, size);
    setMsg(res.ok ? "Layout saved." : res.error);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em" }}>Albums</h1>
          <p style={{ margin: 0, fontSize: 15, color: slate }}>Shown on the Life page in this order. One-third albums sit side by side, up to three in a row.</p>
        </div>
        {storage ? <Link href="/admin/albums/new" className="kv-btn">New album</Link> : null}
      </div>

      {!storage ? (
        <Notice title="Storage isn't connected">Photos and albums are saved to Vercel Blob. Connect a Blob store to this project in Vercel, redeploy, and this page will let you add albums.</Notice>
      ) : usingSamples ? (
        <Notice title="These are the sample albums">The Life page shows these placeholders until you save your first album. Saving a new album replaces all of them, so the samples disappear from the site.</Notice>
      ) : null}

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {order.map((a, i) => (
          <li key={a.slug} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: `1px solid ${line}`, padding: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || usingSamples} aria-label={`Move ${a.title} up`} style={{ ...small, width: 36, padding: 0, opacity: i === 0 || usingSamples ? 0.35 : 1 }}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1 || usingSamples} aria-label={`Move ${a.title} down`} style={{ ...small, width: 36, padding: 0, opacity: i === order.length - 1 || usingSamples ? 0.35 : 1 }}>↓</button>
            </div>
            <div style={{ width: 112, height: 76, background: `#ddd url(${a.cover}) center / cover`, flexShrink: 0 }} />
            <div style={{ flex: "1 1 200px", minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{a.title}{a.hidden ? <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 500, color: slate, border: `1px solid ${line}`, padding: "2px 8px" }}>Hidden</span> : null}</span>
              <span style={{ fontSize: 14, color: slate }}>{a.date || "No date"}, /life/{a.slug}, {a.blocks.length} {a.blocks.length === 1 ? "block" : "blocks"}</span>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <span style={{ color: slate }}>Layout</span>
              <select value={a.size} disabled={usingSamples} onChange={(e) => changeLayout(a.slug, e.target.value as "full" | "third")} style={{ ...small, paddingRight: 8 }}>
                <option value="full">Full width</option>
                <option value="third">One third</option>
              </select>
            </label>
            {usingSamples ? null : <Link href={`/admin/albums/${a.slug}`} style={{ ...small, display: "inline-flex", alignItems: "center", textDecoration: "none", background: ink, color: "#fff", borderColor: ink }}>Edit</Link>}
          </li>
        ))}
      </ol>

      {dirty || msg ? (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff", borderTop: `1px solid ${line}`, padding: "14px clamp(16px, 4vw, 40px)", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
          <span role="status" style={{ fontSize: 15, color: slate }}>{dirty ? "The new order isn't saved yet." : msg}</span>
          {dirty ? <button type="button" className="kv-btn" onClick={persistOrder} disabled={busy}>{busy ? "Saving…" : "Save order"}</button> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- photo uploads ---------- */

const looksHeic = (f: File) => /image\/hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name);

// Chrome and Firefox can't decode HEIC (iPhone photos), so those go through libheif,
// loaded only when needed. Safari decodes HEIC itself and takes the fast path.
async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch (err) {
    if (!looksHeic(file)) throw new Error(`Couldn't read ${file.name}. Try a JPEG, PNG or HEIC photo.`, { cause: err });
    const { heicTo } = await import("heic-to");
    return heicTo({ blob: file, type: "bitmap", options: { imageOrientation: "from-image" } });
  }
}

async function shrink(file: File): Promise<Blob> {
  const bmp = await decode(file);
  const max = 2400;
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * s);
  canvas.height = Math.round(bmp.height * s);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't read that photo."))), "image/jpeg", 0.86));
}

async function uploadPhoto(file: File, folder: string): Promise<string> {
  const blob = await shrink(file);
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "photo";
  const res = await upload(`albums/${folder || "untitled"}/${base}.jpg`, blob, { access: "public", handleUploadUrl: "/api/admin/upload", contentType: "image/jpeg" });
  return res.url;
}

function PhotoSlot({ src, folder, onChange, ratio, label }: { src: string; folder: string; onChange: (url: string) => void; ratio: string; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    setBusy(true); setErr("");
    try { onChange(await uploadPhoto(f, folder)); } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed."); }
    setBusy(false);
    if (input.current) input.current.value = "";
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <button type="button" onClick={() => input.current?.click()} aria-label={src ? `Replace ${label}` : `Add ${label}`}
        style={{ position: "relative", aspectRatio: ratio, width: "100%", border: src ? 0 : `1px dashed #8c8c8c`, background: src ? `#ddd url(${src}) center / cover` : "#fafafa", cursor: "pointer", fontFamily: "inherit", fontSize: 15, color: slate, padding: 0 }}>
        {busy ? <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.8)", color: ink }}>Uploading…</span>
          : src ? <span style={{ position: "absolute", right: 8, bottom: 8, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 13, padding: "4px 10px" }}>Replace</span>
          : <span>Add {label}</span>}
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" hidden onChange={(e) => pick(e.target.files)} />
      {err ? <span role="alert" style={{ fontSize: 13 }}>{err}</span> : null}
    </div>
  );
}

/* ---------- album editor ---------- */

type EditBlock = AlbumBlock & { _k: string };
let keySeq = 0;
const withKey = (b: AlbumBlock): EditBlock => ({ ...b, _k: `b${++keySeq}` });
const strip = ({ _k, ...b }: EditBlock): AlbumBlock => { void _k; return b as AlbumBlock; };

const emptyAlbum: Album = { slug: "", title: "", date: "", cover: "", size: "third", hidden: false, blocks: [] };

export function AlbumEditor({ album, isNew }: { album: Album | null; isNew: boolean }) {
  const router = useRouter();
  const start = album ?? emptyAlbum;
  const [title, setTitle] = useState(start.title);
  const [date, setDate] = useState(start.date);
  const [slug, setSlug] = useState(start.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [cover, setCover] = useState(start.cover);
  const [size, setSize] = useState<Album["size"]>(start.size);
  const [hidden, setHidden] = useState(Boolean(start.hidden));
  const [blocks, setBlocks] = useState<EditBlock[]>(() => start.blocks.map(withKey));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [bulk, setBulk] = useState<{ done: number; total: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bulkInput = useRef<HTMLInputElement>(null);

  const folder = slug || slugify(title) || "untitled";
  const touch = () => { setDirty(true); setStatus(""); };

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (k: string, b: AlbumBlock) => { setBlocks((all) => all.map((x) => (x._k === k ? { ...b, _k: k } : x))); touch(); };
  const remove = (k: string) => { setBlocks((all) => all.filter((x) => x._k !== k)); touch(); };
  const move = (i: number, d: number) => {
    setBlocks((all) => { const j = i + d; if (j < 0 || j >= all.length) return all; const n = [...all]; [n[i], n[j]] = [n[j], n[i]]; return n; });
    touch();
  };
  const add = (b: AlbumBlock) => { setBlocks((all) => [...all, withKey(b)]); touch(); };
  const pairWithNext = (i: number) => {
    setBlocks((all) => {
      const a = all[i], b = all[i + 1];
      if (a?.type !== "full" || b?.type !== "full") return all;
      const n = [...all];
      n.splice(i, 2, withKey({ type: "pair", images: [a.image, b.image] }));
      return n;
    });
    touch();
  };
  const split = (i: number) => {
    setBlocks((all) => {
      const a = all[i];
      if (a?.type !== "pair") return all;
      const n = [...all];
      n.splice(i, 1, withKey({ type: "full", image: a.images[0] }), withKey({ type: "full", image: a.images[1] }));
      return n;
    });
    touch();
  };

  async function addMany(files: FileList | null) {
    const list = Array.from(files ?? []);
    if (!list.length) return;
    setBulk({ done: 0, total: list.length });
    for (let i = 0; i < list.length; i++) {
      try {
        const url = await uploadPhoto(list[i], folder);
        setBlocks((all) => [...all, withKey({ type: "full", image: url })]);
        setCover((c) => c || url);
        touch();
      } catch {
        setStatus(`Couldn't upload ${list[i].name}.`);
      }
      setBulk({ done: i + 1, total: list.length });
    }
    setBulk(null);
    if (bulkInput.current) bulkInput.current.value = "";
  }

  async function save() {
    setSaving(true); setStatus("");
    const res = await saveAlbum(isNew ? null : start.slug, { slug: slug || slugify(title), title, date, cover, size, hidden, blocks: blocks.map(strip) });
    setSaving(false);
    if (!res.ok) { setStatus(res.error); return; }
    setDirty(false);
    setStatus("Saved. The Life page is updated.");
    if (res.slug && (isNew || res.slug !== start.slug)) router.replace(`/admin/albums/${res.slug}`);
    else router.refresh();
  }

  async function destroy() {
    const res = await deleteAlbum(start.slug);
    if (!res.ok) { setStatus(res.error); setConfirmDelete(false); return; }
    setDirty(false);
    router.replace("/admin");
  }

  const photos = blocks.flatMap((b) => (b.type === "full" ? [b.image] : b.type === "pair" ? b.images : []));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Link href="/admin" style={{ fontSize: 15, color: slate, textUnderlineOffset: 4, alignSelf: "flex-start" }}>← All albums</Link>
        <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em" }}>{isNew ? "New album" : title || "Untitled"}</h1>
      </div>

      <section style={{ background: "#fff", border: `1px solid ${line}`, padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="a-title" style={labelStyle}>Title</label>
            <input id="a-title" value={title} placeholder="Italy" style={field} onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); touch(); }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="a-date" style={labelStyle}>Date</label>
            <input id="a-date" value={date} placeholder="June 2025" style={field} onChange={(e) => { setDate(e.target.value); touch(); }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="a-slug" style={labelStyle}>Page address</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #8c8c8c", background: "#fff" }}>
              <span style={{ paddingLeft: 14, fontSize: 16, color: slate }}>/life/</span>
              <input id="a-slug" value={slug} style={{ ...field, border: 0, paddingLeft: 2 }} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); touch(); }} />
            </div>
          </div>
          <fieldset style={{ margin: 0, padding: 0, border: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <legend style={{ ...labelStyle, padding: 0, marginBottom: 8 }}>Size on the Life page</legend>
            <div style={{ display: "flex", gap: 8 }}>
              {(["full", "third"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={size === v} onClick={() => { setSize(v); touch(); }}
                  style={{ ...small, height: 44, background: size === v ? ink : "#fff", color: size === v ? "#fff" : ink, borderColor: size === v ? ink : "#8c8c8c" }}>
                  {v === "full" ? "Full width" : "One third"}
                </button>
              ))}
            </div>
          </fieldset>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, cursor: "pointer" }}>
            <input type="checkbox" checked={hidden} onChange={(e) => { setHidden(e.target.checked); touch(); }} style={{ width: 18, height: 18, accentColor: ink }} />
            Hide from the site
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={labelStyle}>Cover photo</span>
          <PhotoSlot src={cover} folder={folder} label="cover photo" ratio="3 / 2" onChange={(u) => { setCover(u); touch(); }} />
          <span style={{ fontSize: 13, color: slate }}>Shown on the Life page and at the top of the album. You can also pick any photo below with “Use as cover”.</span>
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>Story</h2>
          <span style={{ fontSize: 14, color: slate }}>Photos and text, top to bottom, as they appear on the album page.</span>
        </div>

        {blocks.length === 0 ? (
          <div style={{ background: "#fff", border: `1px dashed #8c8c8c`, padding: 32, fontSize: 16, color: slate, textAlign: "center" }}>
            No photos yet. Add photos below; each one starts full width, and you can pair two side by side.
          </div>
        ) : null}

        {blocks.map((b, i) => (
          <div key={b._k} style={{ background: "#fff", border: `1px solid ${line}`, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, marginRight: "auto" }}>{b.type === "text" ? "Text" : b.type === "pair" ? "Two photos side by side" : "Full-width photo"}</span>
              {b.type === "full" && blocks[i + 1]?.type === "full" ? <button type="button" style={small} onClick={() => pairWithNext(i)}>Pair with next photo</button> : null}
              {b.type === "pair" ? <button type="button" style={small} onClick={() => split(i)}>Split</button> : null}
              {b.type === "full" && b.image ? <button type="button" style={small} onClick={() => { setCover(b.image); touch(); }} disabled={cover === b.image}>{cover === b.image ? "Cover" : "Use as cover"}</button> : null}
              <button type="button" style={{ ...small, width: 36, padding: 0 }} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" style={{ ...small, width: 36, padding: 0 }} onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label="Move down">↓</button>
              <button type="button" style={small} onClick={() => remove(b._k)}>Remove</button>
            </div>
            {b.type === "text" ? (
              <textarea value={b.text} rows={4} placeholder="Write about this part of the trip." onChange={(e) => update(b._k, { type: "text", text: e.target.value })}
                style={{ ...field, height: "auto", padding: 14, lineHeight: 1.55, resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 15 }} />
            ) : b.type === "pair" ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 560 }}>
                {[0, 1].map((j) => (
                  <PhotoSlot key={j} src={b.images[j]} folder={folder} label={j === 0 ? "left photo" : "right photo"} ratio="2 / 3"
                    onChange={(u) => update(b._k, { type: "pair", images: j === 0 ? [u, b.images[1]] : [b.images[0], u] })} />
                ))}
              </div>
            ) : (
              <div style={{ maxWidth: 560 }}>
                <PhotoSlot src={b.image} folder={folder} label="photo" ratio="3 / 2" onChange={(u) => update(b._k, { type: "full", image: u })} />
              </div>
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="kv-btn" onClick={() => bulkInput.current?.click()} disabled={Boolean(bulk)}>
            {bulk ? `Uploading ${bulk.done + 1 > bulk.total ? bulk.total : bulk.done + 1} of ${bulk.total}…` : "Add photos"}
          </button>
          <button type="button" className="kv-btn kv-btn--ghost" onClick={() => add({ type: "text", text: "" })}>Add text</button>
          <button type="button" className="kv-btn kv-btn--ghost" onClick={() => add({ type: "pair", images: ["", ""] as [string, string] })}>Add photo pair</button>
          <input ref={bulkInput} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" multiple hidden onChange={(e) => addMany(e.target.files)} />
        </div>
        <span style={{ fontSize: 13, color: slate }}>Photos are resized to 2400px on the long side before uploading. {photos.length} {photos.length === 1 ? "photo" : "photos"} in this album.</span>
      </section>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 20, background: "#fff", borderTop: `1px solid ${line}`, padding: "14px clamp(16px, 4vw, 40px)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {!isNew ? (
          confirmDelete ? (
            <>
              <span style={{ fontSize: 15 }}>Delete this album from the site?</span>
              <button type="button" style={{ ...small, height: 44, background: ink, color: "#fff", borderColor: ink }} onClick={destroy}>Delete album</button>
              <button type="button" style={{ ...small, height: 44 }} onClick={() => setConfirmDelete(false)}>Keep it</button>
            </>
          ) : (
            <button type="button" style={{ ...small, height: 44 }} onClick={() => setConfirmDelete(true)}>Delete album…</button>
          )
        ) : null}
        <span role="status" style={{ marginLeft: "auto", fontSize: 15, color: slate }}>{status || (dirty ? "Unsaved changes" : "")}</span>
        {!isNew && !dirty ? <a href={`/life/${start.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: 15, textUnderlineOffset: 4 }}>View album ↗</a> : null}
        <button type="button" className="kv-btn" onClick={save} disabled={saving || Boolean(bulk) || (!dirty && !isNew)} style={{ opacity: saving || (!dirty && !isNew) ? 0.5 : 1 }}>{saving ? "Saving…" : "Save album"}</button>
      </div>
    </div>
  );
}
