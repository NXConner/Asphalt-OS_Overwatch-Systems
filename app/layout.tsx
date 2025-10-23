import type { Metadata, Viewport } from "next";
import "@/globals.css";
import { Providers } from "@/providers";
import HUD from "@/components/game/HUD";
import { PWAInstaller } from "@/pwa-installer";

export const metadata: Metadata = {
  title: "Asphalt OS - Overwatch Systems",
  description: "Advanced business management system for asphalt paving, sealcoating, crack repair, and line striping operations.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFD700",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <PWAInstaller />
          <HUD />
          {children}
        </Providers>
      </body>
    </html>
  );
}
