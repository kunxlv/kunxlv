import type { Segment } from "./projects";

export const experience: { name: string; years: string; role: string; photo: string; /** Tall crop for phones (9:16). */ photoPortrait?: string; credit?: { text: string; href: string }; paras: Segment[][] }[] = [
  {
    name: "Squarespace", years: "2025 — Present", role: "Senior Software Engineer",
    // Ship Street Great, Dublin 8, where the Squarespace office is. CC0.
    photo: "/images/experience/squarespace.jpg",
    photoPortrait: "/images/experience/squarespace-portrait.jpg",
    credit: { text: "Ship Street Great, Dublin. Photo: Ridiculopathy, CC0", href: "https://commons.wikimedia.org/wiki/File:Ship_Street_Great_approaching_10pm_on_a_summers_evening,_Dublin,_Ireland_02.jpg" },
    paras: [
      ["Built the ", { hl: "Font Catalog Service" }, " from scratch: ", { hl: "4,500 fonts" }, " served to ", { hl: "~13M websites" }, ", with its own auth, monitoring and a production SLA."],
      ["Led ", { hl: "variable fonts" }, " from design doc to release, and added ", { hl: "real-time AI text generation" }, " to the content generator through the OpenAI and Anthropic APIs."],
    ],
  },
  {
    name: "IBM", years: "2024 — 2025", role: "Senior Software Engineer",
    // IBM Studios, Milan. Unsplash License (free to use, credit appreciated).
    photo: "/images/experience/ibm.jpg",
    photoPortrait: "/images/experience/ibm-portrait.jpg",
    credit: { text: "IBM Studios, Milan. Photo: Claudio Schwarz, Unsplash", href: "https://unsplash.com/photos/T1K4kWrt9tA" },
    paras: [["Moved fraud-detection microservices to ", { hl: "serverless, event-driven AWS" }, ", cutting operating costs by ", { hl: "30%" }, " and processing time by ", { hl: "25%" }, "."]],
  },
  {
    name: "Mastercard", years: "2022 — 2024", role: "Software Engineer II",
    photo: "/images/experience/mastercard.jpg",
    photoPortrait: "/images/experience/mastercard-portrait.jpg",
    credit: { text: "Dublin Bay. Photo: Jonjobaker, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:North_Dublin_Bay_with_Poolbeg_Chimneys.jpg" },
    paras: [
      ["Built ", { hl: "real-time data ingestion on Kafka" }, ", and a reporting plugin other teams adopted with ", { hl: "zero code changes" }, "."],
      ["Mentored the junior engineers on the team."],
    ],
  },
];
