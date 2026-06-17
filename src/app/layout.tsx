import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/content";

// Display: Fraunces (variable, optical sizing, warm). Large headings only.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// Body: Hanken Grotesk.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

// Mono accent: JetBrains Mono (metrics/labels only).
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matthewoshin.com"),
  title: {
    default: "Matthew Oshin, builder of AI products and companies",
    template: "%s, Matthew Oshin",
  },
  description:
    "Matthew Oshin is a serial entrepreneur and builder. Chief AI Officer at BrachyClip, previously VP of AI and Innovation at ICR. He builds AI products and trading research tools.",
  authors: [{ name: SITE.name }],
  openGraph: {
    title: "Matthew Oshin",
    description:
      "Serial entrepreneur and builder. AI products, trading research tools, and companies.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#01060f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
