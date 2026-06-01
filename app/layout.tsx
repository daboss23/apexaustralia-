import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "T-APEX Australia — Train Beyond Human Limits",
  description:
    "Intelligent resistance training technology for elite Australian performance. Real-time telemetry, AI-calibrated resistance, and data-driven athlete development.",
  keywords: ["T-APEX", "resistance training", "athlete performance", "sports technology", "Australia", "telemetry"],
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
