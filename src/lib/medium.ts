import { cacheLife } from "next/cache";
import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";

export type Post = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readingTime: number;
  cover: string | null;
  url: string;
  html: string;
};

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function toPost(item: Record<string, unknown>): Post | null {
  const link = String(item.link ?? "");
  const title = decode(String(item.title ?? "")).trim();
  const raw = String(item["content:encoded"] ?? item.description ?? "");
  if (!link || !title) return null;
  let slug = "";
  try { slug = new URL(link).pathname.split("/").filter(Boolean).pop() ?? ""; } catch { slug = ""; }
  if (!slug) return null;

  const cover = raw.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? null;
  let body = raw
    .replace(/<img[^>]+src="[^"]*stat\?event[^"]*"[^>]*>/g, "")
    .replace(/^\s*<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/, "");
  if (cover) body = body.replace(/<figure>(?:(?!<\/figure>)[\s\S])*?<img[^>]+src="[^"]+"[\s\S]*?<\/figure>/, "");

  const firstPara = body.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "";
  const subtitle = decode(text(firstPara)).slice(0, 180).replace(/\s\S*$/, "") + (text(firstPara).length > 180 ? "…" : "");
  const words = text(body).split(" ").length;
  const html = sanitizeHtml(body, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "h1", "h2"]),
    allowedAttributes: { a: ["href", "rel", "target"], img: ["src", "alt"] },
    transformTags: { a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noreferrer" }) },
  });
  return {
    slug,
    title,
    subtitle,
    date: new Date(String(item.pubDate ?? "")).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" }),
    readingTime: Math.max(1, Math.round(words / 230)),
    cover,
    url: link.split("?")[0],
    html,
  };
}

export async function getPosts(username: string): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  if (!username) return [];
  try {
    const res = await fetch(`https://medium.com/feed/@${username}`, { headers: { "user-agent": "kunalv.com" } });
    if (!res.ok) return [];
    const xml = await res.text();
    const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
    const items = parsed?.rss?.channel?.item;
    const list: Record<string, unknown>[] = Array.isArray(items) ? items : items ? [items] : [];
    return list.map(toPost).filter((p): p is Post => p !== null);
  } catch {
    return [];
  }
}
