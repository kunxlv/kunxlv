import { cacheLife } from "next/cache";
import { parseFeed, type Post } from "./medium-parse";

export type { Post } from "./medium-parse";

export async function getPosts(username: string): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  if (!username) return [];
  try {
    const res = await fetch(`https://medium.com/feed/@${username}`, { headers: { "user-agent": "kunalv.com" } });
    if (!res.ok) return [];
    return parseFeed(await res.text());
  } catch {
    return [];
  }
}
