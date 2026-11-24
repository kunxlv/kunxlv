// Albums will come from the admin dashboard. This file is the stand-in until then.
export type AlbumBlock =
  | { type: "text"; text: string }
  | { type: "pair"; images: [string, string] }
  | { type: "full"; image: string };

export type Album = {
  slug: string;
  title: string;
  date: string;
  cover: string;
  size: "full" | "third";
  blocks: AlbumBlock[];
};

export const albums: Album[] = [
  {
    slug: "sample-album",
    title: "[Album name]",
    date: "[Month Year]",
    cover: "/images/photo-land.jpg",
    size: "full",
    blocks: [
      { type: "text", text: "[Opening paragraph about the trip: where you went, who with, and what made it worth remembering.]" },
      { type: "pair", images: ["/images/a-p1.jpg", "/images/a-p2.jpg"] },
      { type: "full", image: "/images/a-wide2.jpg" },
      { type: "text", text: "[A second, shorter note between photos.]" },
      { type: "pair", images: ["/images/a-p3.jpg", "/images/a-p1.jpg"] },
      { type: "full", image: "/images/photo-wide.jpg" },
    ],
  },
  { slug: "sample-album-2", title: "[Album name]", date: "[Month Year]", cover: "/images/photo-wide.jpg", size: "third", blocks: [{ type: "full", image: "/images/photo-wide.jpg" }] },
  { slug: "sample-album-3", title: "[Album name]", date: "[Month Year]", cover: "/images/a-p2.jpg", size: "third", blocks: [{ type: "full", image: "/images/a-wide2.jpg" }] },
  { slug: "sample-album-4", title: "[Album name]", date: "[Month Year]", cover: "/images/a-p3.jpg", size: "third", blocks: [{ type: "full", image: "/images/a-wide2.jpg" }] },
];

export function getAlbums() {
  return albums;
}
export function getAlbum(slug: string) {
  return albums.find((a) => a.slug === slug);
}
