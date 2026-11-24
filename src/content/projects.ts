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
};

export const projects: Project[] = [
  {
    slug: "systms", name: "systms", kind: "iOS app",
    tile: { bg: "#1a1a1a", fg: "#fff", sub: "#b5b5b5" },
    text: ["A task app for days that don’t go to plan. It reads your ", { hl: "calendar and location" }, " to switch between ", { hl: "work, home and commute" }, ", starts each morning with a ", { hl: "capacity check-in" }, ", and never shows anything as overdue."],
    facts: [{ k: "Platform", v: "iOS" }, { k: "Status", v: "In development" }, { k: "Role", v: "Design and engineering" }],
    links: [{ label: "Follow the build", href: "/writing", primary: true }],
    visual: "phones",
  },
  {
    slug: "onyx", name: "Onyx", kind: "Home server",
    tile: { bg: "#2f2f2f", fg: "#fff", sub: "#cfcfcf" },
    text: ["My ", { hl: "self-hosted home server" }, " on a Mac mini. Services run on onyx and I reach them from anywhere over ", { hl: "Tailscale" }, ", with ", { hl: "Homebase" }, ", a dashboard of my own, on top."],
    facts: [{ k: "Hardware", v: "Mac mini" }, { k: "Network", v: "Tailscale" }, { k: "Status", v: "Running" }],
    links: [{ label: "Read the write-up", href: "/writing", primary: true }],
    visual: "system",
  },
  {
    slug: "reckoner", name: "Reckoner", kind: "Web tool",
    tile: { bg: "#f4f4f4", fg: "#000", sub: "#6b6b6b" },
    text: ["Personal finance calculators for ", { hl: "10+ countries" }, ", with currency conversion and results shown as ", { hl: "interactive charts" }, " instead of a single number."],
    facts: [{ k: "Live at", v: "reckoner.tools" }, { k: "Stack", v: "Next.js, Vercel" }, { k: "Status", v: "Live" }],
    links: [{ label: "Visit reckoner.tools ↗", href: "https://reckoner.tools", primary: true }, { label: "GitHub", href: "https://github.com/kunxlv/reckoner" }],
    visual: "browser",
  },
  {
    slug: "timesync", name: "TimeSync", kind: "Web tool",
    tile: { bg: "#ffffff", fg: "#000", sub: "#6b6b6b" },
    text: ["Time zone tools for remote teams. Find the ", { hl: "working-hours overlap" }, " across cities, plus ", { hl: "~300 city-pair pages" }, " and a set of small planning tools."],
    facts: [{ k: "Live at", v: "timesync.tools" }, { k: "Stack", v: "Next.js, TypeScript" }, { k: "Status", v: "Live" }],
    links: [{ label: "Visit timesync.tools ↗", href: "https://www.timesync.tools", primary: true }, { label: "GitHub", href: "https://github.com/kunxlv/timesync" }],
    visual: "browser",
  },
];
