import type { Metadata } from "next";
import { Suspense } from "react";
import "@fontsource-variable/urbanist";
import "@fontsource/dm-mono/400.css";
import "./globals.css";
import { TransitionProvider } from "@/components/transition-provider";
import { Dock } from "@/components/dock";

export const metadata: Metadata = {
  metadataBase: new URL("https://kunalv.com"),
  title: { default: "Kunal Vaidya", template: "%s · Kunal Vaidya" },
  description: "Senior backend engineer in Dublin. I build backend systems for a living, and everything else for fun.",
  openGraph: { title: "Kunal Vaidya", description: "Senior backend engineer in Dublin.", url: "https://kunalv.com", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider
          chrome={
            <Suspense fallback={null}>
              <Dock />
            </Suspense>
          }
        >
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
