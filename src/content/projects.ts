export type Segment = string | { hl: string };
export type Project = {
  slug: string;
  name: string;
  kind: string;
  tile: { bg: string; fg: string; sub: string };
  text: Segment[];
  facts: { k: string; v: string }[];
  links: { label: string; href: string; primary?: boolean }[];
  visual: "phones" | "browser" | "system";
  /** A cut-out product photo (transparent background), shown instead of placeholder screens. */
  hero?: { src: string; alt: string };
  /** Real screenshots, front one first. Also used as the tile image. */
  shots?: { src: string; url: string }[];
};

export const projects: Project[] = [
  {
    slug: "systms", name: "systms", kind: "iOS app",
    tile: { bg: "#1a1a1a", fg: "#fff", sub: "#b5b5b5" },
    text: ["A day planner for iPhone that ", { hl: "doesn’t keep score" }, ". Tasks, lists, routines and reminders sit ", { hl: "beside your calendar" }, ", added in a sentence. Reminders ring as real alarms, tasks move with their meetings, and there are ", { hl: "no streaks, no overdue, nothing red" }, ". No account, and nothing leaves your phone."],
    facts: [{ k: "Website", v: "systms.app" }, { k: "Platform", v: "iOS" }, { k: "Status", v: "Coming soon to the App Store" }, { k: "Role", v: "Design and engineering" }],
    links: [
      { label: "Coming soon on the App Store", href: "", primary: true },
      { label: "Visit systms.app ↗", href: "https://systms.app" },
    ],
    visual: "phones",
    hero: { src: "/images/builds/systms-hand.webp", alt: "systms on an iPhone, showing Monday’s tasks: morning routine, water the plants, laundry and more" },
  },
  {
    slug: "onyx", name: "Onyx", kind: "Home server",
    tile: { bg: "#2f2f2f", fg: "#fff", sub: "#cfcfcf" },
    text: ["My ", { hl: "self-hosted home server" }, " on a Mac mini. Services run on onyx and I reach them from anywhere over ", { hl: "Tailscale" }, ", with ", { hl: "Homebase" }, ", a dashboard of my own, on top."],
    facts: [{ k: "Hardware", v: "Mac mini" }, { k: "Network", v: "Tailscale" }, { k: "Status", v: "Running" }],
    links: [{ label: "Read the write-up", href: "/writing", primary: true }],
    visual: "system",
    // Homebase in demo mode, running on onyx.
    shots: [{ src: "/images/builds/homebase-home.jpg", url: "homebase, on onyx" }],
  },
  {
    slug: "reckoner", name: "Reckoner", kind: "Web tool",
    tile: { bg: "#f4f4f4", fg: "#000", sub: "#6b6b6b" },
    text: ["Personal finance calculators for ", { hl: "12 countries" }, ", with currency conversion and results shown as ", { hl: "interactive charts" }, " instead of a single number."],
    facts: [{ k: "Live at", v: "reckoner.tools" }, { k: "Stack", v: "Next.js, Vercel" }, { k: "Status", v: "Live" }],
    links: [{ label: "Visit reckoner.tools ↗", href: "https://reckoner.tools", primary: true }, { label: "GitHub", href: "https://github.com/kunxlv/reckoner" }],
    visual: "browser",
    shots: [
      { src: "/images/builds/reckoner-mortgage.jpg", url: "reckoner.tools/ie/property/mortgage-calculator" },
      { src: "/images/builds/reckoner-home.jpg", url: "reckoner.tools" },
    ],
  },
  {
    slug: "timesync", name: "TimeSync", kind: "Web tool",
    tile: { bg: "#ffffff", fg: "#000", sub: "#6b6b6b" },
    text: ["Time zone tools for remote teams. Find the ", { hl: "working-hours overlap" }, " across cities, plus ", { hl: "~300 city-pair pages" }, " and a set of small planning tools."],
    facts: [{ k: "Live at", v: "timesync.tools" }, { k: "Stack", v: "Next.js, TypeScript" }, { k: "Status", v: "Live" }],
    links: [{ label: "Visit timesync.tools ↗", href: "https://www.timesync.tools", primary: true }, { label: "GitHub", href: "https://github.com/kunxlv/timesync" }],
    visual: "browser",
    shots: [
      { src: "/images/builds/timesync-planner.jpg", url: "timesync.tools" },
      { src: "/images/builds/timesync-pair.jpg", url: "timesync.tools/meet/london-and-new-york" },
    ],
  },
];
