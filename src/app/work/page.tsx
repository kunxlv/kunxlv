import type { Metadata } from "next";
import { WorkStage } from "./work-stage";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return <WorkStage />;
}
