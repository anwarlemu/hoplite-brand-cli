import type { Metadata } from "next";
import { Chakra_Petch, Kode_Mono } from "next/font/google";

import { registryName, registryUrl } from "@www/lib/registry";
import { Providers } from "./providers";

import "./globals.css";

const chakraPetch = Chakra_Petch({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-chakra-petch", display: "swap" });
const kodeMono = Kode_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-kode-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(registryUrl),
  title: { default: `${registryName} design system`, template: `%s | ${registryName} design system` },
  alternates: { types: { "text/markdown": "/agents.md", "text/plain": "/llms.txt" } },
  description: `Components, design tokens and CLI guidance for building ${registryName} interfaces.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${chakraPetch.variable} ${kodeMono.variable}`} data-theme="light" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
