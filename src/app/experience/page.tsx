import type { Metadata } from "next";
import { ExperienceScenes } from "./scenes";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return <ExperienceScenes />;
}
