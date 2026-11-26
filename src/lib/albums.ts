import "server-only";
import { createHash } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { get, put } from "@vercel/blob";
import { sampleAlbums, type Album } from "@/content/albums";

export type { Album, AlbumBlock } from "@/content/albums";

export const storageReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// The store is public (photos are served from it), so the albums file gets a name
// nobody can guess. Hidden albums stay out of sight that way.
function dataPath() {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  return `data/albums-${createHash("sha256").update(token).digest("hex").slice(0, 20)}.json`;
}

export async function fetchStored(): Promise<Album[] | null> {
  if (!storageReady()) return null;
  const res = await get(dataPath(), { access: "public", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  const text = await new Response(res.stream).text();
  const parsed = JSON.parse(text) as { albums?: Album[] };
  return Array.isArray(parsed.albums) ? parsed.albums : null;
}

/** Every album, including hidden ones. Falls back to the samples until something is saved. */
export async function readAllAlbums(): Promise<Album[]> {
  "use cache";
  cacheTag("albums");
  cacheLife("days");
  try {
    return (await fetchStored()) ?? sampleAlbums;
  } catch {
    return sampleAlbums;
  }
}

/** Albums visitors can see. */
export async function readAlbums(): Promise<Album[]> {
  return (await readAllAlbums()).filter((a) => !a.hidden);
}

/** Uncached read for the admin, so edits always start from the latest copy. */
export async function readAlbumsFresh(): Promise<Album[]> {
  return (await fetchStored()) ?? sampleAlbums;
}

export async function writeAlbums(albums: Album[]) {
  if (!storageReady()) throw new Error("Storage isn't connected yet.");
  await put(dataPath(), JSON.stringify({ albums, savedAt: new Date().toISOString() }, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
