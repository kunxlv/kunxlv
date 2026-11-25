import type { Metadata } from "next";
import { WorkStage } from "./work-stage";

export const metadata: Metadata = { title: "Builds", description: "Things Kunal Vaidya has built after hours: systms, an iOS app; Onyx, a home server; and the web tools Reckoner and TimeSync." };

export default function WorkPage() {
  return <WorkStage />;
}
