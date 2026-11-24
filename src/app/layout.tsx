import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kunalv.com"),
  title: "Kunal Vaidya · Senior Backend Engineer",
  description:
    "Senior backend engineer in Dublin building distributed systems: microservices, event-driven pipelines and LLM integrations.",
  openGraph: {
    title: "Kunal Vaidya · Senior Backend Engineer",
    description: "Distributed systems, Java, Kafka, AWS/GCP. Dublin.",
    url: "https://kunalv.com",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
