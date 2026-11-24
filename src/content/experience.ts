import type { Segment } from "./projects";

export const experience: { name: string; years: string; role: string; photo: string; paras: Segment[][] }[] = [
  {
    name: "Squarespace", years: "2025 — Present", role: "Senior Software Engineer", photo: "",
    paras: [
      ["Built the ", { hl: "Font Catalog Service" }, " from scratch: ", { hl: "4,500 fonts" }, " served to ", { hl: "~13M websites" }, ", with its own auth, monitoring and a production SLA."],
      ["Led ", { hl: "variable fonts" }, " from design doc to release, and added ", { hl: "real-time AI text generation" }, " to the content generator through the OpenAI and Anthropic APIs."],
    ],
  },
  {
    name: "IBM", years: "2024 — 2025", role: "Senior Software Engineer", photo: "",
    paras: [["Moved fraud-detection microservices to ", { hl: "serverless, event-driven AWS" }, ", cutting operating costs by ", { hl: "30%" }, " and processing time by ", { hl: "25%" }, "."]],
  },
  {
    name: "Mastercard", years: "2022 — 2024", role: "Software Engineer II", photo: "",
    paras: [
      ["Built ", { hl: "real-time data ingestion on Kafka" }, ", and a reporting plugin other teams adopted with ", { hl: "zero code changes" }, "."],
      ["Mentored the junior engineers on the team."],
    ],
  },
];
