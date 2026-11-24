"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, isAdmin, passwordMatches, startSession } from "@/lib/admin-auth";
import { fetchStored, slugify, storageReady, writeAlbums, type Album, type AlbumBlock } from "@/lib/albums";

export type ActionResult = { ok: true; slug?: string } | { ok: false; error: string };

export async function signIn(_: unknown, form: FormData): Promise<{ error: string } | undefined> {
  const password = String(form.get("password") ?? "");
  if (!passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 800));
    return { error: "That password isn't right." };
  }
  await startSession();
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/admin");
}

async function guard(): Promise<ActionResult | null> {
  if (!(await isAdmin())) return { ok: false, error: "Your session ended. Sign in again." };
  if (!storageReady()) return { ok: false, error: "Storage isn't connected yet, so nothing can be saved." };
  return null;
}

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const url = (v: unknown) => {
  const s = str(v, 1000);
  return /^(https:\/\/|\/)/.test(s) ? s : "";
};

function clean(input: Album): Album {
  const blocks: AlbumBlock[] = (input.blocks ?? []).flatMap((b): AlbumBlock[] => {
    if (b.type === "text") { const text = str(b.text, 5000); return text ? [{ type: "text", text }] : []; }
    if (b.type === "full") { const image = url(b.image); return image ? [{ type: "full", image }] : []; }
    if (b.type === "pair") {
      const [a, c] = [url(b.images?.[0]), url(b.images?.[1])];
      if (a && c) return [{ type: "pair", images: [a, c] }];
      return a || c ? [{ type: "full", image: a || c }] : [];
    }
    return [];
  });
  return {
    slug: slugify(input.slug || input.title) || "album",
    title: str(input.title, 120) || "Untitled",
    date: str(input.date, 60),
    cover: url(input.cover),
    size: input.size === "third" ? "third" : "full",
    hidden: Boolean(input.hidden),
    blocks,
  };
}

export async function saveAlbum(originalSlug: string | null, input: Album): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const album = clean(input);
  if (!album.cover) return { ok: false, error: "Add a cover photo before saving." };
  const all = ((await fetchStored()) ?? []);
  if (all.some((a) => a.slug === album.slug && a.slug !== originalSlug)) {
    return { ok: false, error: `Another album already uses the address /life/${album.slug}. Change the address and save again.` };
  }
  const idx = originalSlug ? all.findIndex((a) => a.slug === originalSlug) : -1;
  const next = idx >= 0 ? all.map((a, i) => (i === idx ? album : a)) : [album, ...all];
  await writeAlbums(next);
  updateTag("albums");
  return { ok: true, slug: album.slug };
}

export async function deleteAlbum(slug: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const all = ((await fetchStored()) ?? []);
  await writeAlbums(all.filter((a) => a.slug !== slug));
  updateTag("albums");
  return { ok: true };
}

export async function saveOrder(slugs: string[]): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const all = ((await fetchStored()) ?? []);
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  const ordered = slugs.map((s) => bySlug.get(s)).filter((a): a is Album => Boolean(a));
  const rest = all.filter((a) => !slugs.includes(a.slug));
  await writeAlbums([...ordered, ...rest]);
  updateTag("albums");
  return { ok: true };
}

export async function setLayout(slug: string, size: "full" | "third"): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  const all = ((await fetchStored()) ?? []);
  await writeAlbums(all.map((a) => (a.slug === slug ? { ...a, size } : a)));
  updateTag("albums");
  return { ok: true };
}
