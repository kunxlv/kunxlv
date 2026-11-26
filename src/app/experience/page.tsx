import type { Metadata } from "next";
import { ExperienceScenes } from "./scenes";

export const metadata: Metadata = { title: "Experience", description: "Eight years building backend systems at Squarespace, IBM and Mastercard." };

export default function ExperiencePage() {
  return <ExperienceScenes />;
}
