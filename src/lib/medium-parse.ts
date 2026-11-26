import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";

export type Post = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  /** Minutes; null when Medium only shares a preview of the post. */
  readingTime: number | null;
  cover: string | null;
  url: string;
  html: string;
  /** True when the feed carries only a preview, so the full post lives on Medium. */
  partial: boolean;
};

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

function clip(s: string, max = 180) {
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s\S*$/, "") + "…";
}

export function toPost(item: Record<string, unknown>): Post | null {
  const link = String(item.link ?? "");
  const title = decode(String(item.title ?? "")).trim();
  if (!link || !title) return null;
  let slug = "";
  try { slug = new URL(link).pathname.split("/").filter(Boolean).pop() ?? ""; } catch { slug = ""; }
  if (!slug) return null;

  const encoded = item["content:encoded"] ? String(item["content:encoded"]) : "";
  const description = String(item.description ?? "");
  const partial = !encoded;
  const raw = encoded || description;
  const cover = raw.match(/<img[^>]+src="([^"]+)"/)?.[1] ?? null;
  const date = new Date(String(item.pubDate ?? "")).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Dublin" });
  const url = link.split("?")[0];

  if (partial) {
    const snippet = decode(text(description.match(/<p class="medium-feed-snippet">([\s\S]*?)<\/p>/)?.[1] ?? ""));
    return { slug, title, subtitle: clip(snippet), date, readingTime: null, cover, url, html: "", partial: true };
  }

  let body = encoded
    .replace(/<img[^>]+src="[^"]*stat\?event[^"]*"[^>]*>/g, "")
    .replace(/^\s*<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/, "");
  if (cover) body = body.replace(/<figure>(?:(?!<\/figure>)[\s\S])*?<img[^>]+src="[^"]+"[\s\S]*?<\/figure>/, "");
  // Medium often repeats the subtitle as an h4 right under the title.
  const lead = body.match(/^\s*<h[3-4][^>]*>([\s\S]*?)<\/h[3-4]>/)?.[1];
  const firstPara = lead ?? body.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "";
  const html = sanitizeHtml(body, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "h1", "h2"]),
    allowedAttributes: { a: ["href", "rel", "target"], img: ["src", "alt"] },
    transformTags: { a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noreferrer" }) },
  });
  return {
    slug, title, date, cover, url, html, partial: false,
    subtitle: clip(decode(text(firstPara))),
    readingTime: Math.max(1, Math.round(text(body).split(" ").length / 230)),
  };
}

export function parseFeed(xml: string): Post[] {
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
  const items = parsed?.rss?.channel?.item;
  const list: Record<string, unknown>[] = Array.isArray(items) ? items : items ? [items] : [];
  return list.map(toPost).filter((p): p is Post => p !== null);
}
