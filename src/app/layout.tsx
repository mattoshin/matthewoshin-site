import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/content";
import DescentChrome from "@/components/chrome/DescentChrome";
import SiteFooter from "@/components/chrome/SiteFooter";

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
    url: "https://matthewoshin.com",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Matthew Oshin" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Oshin",
    description:
      "Builder. Chief AI Officer at BrachyClip. Markets, AI, and emerging tech.",
    images: ["/og.png"],
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
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* No-JS safety: the SharkLoader veil is dismissed by JS. If JS never
            runs it would otherwise cover the page forever, so hide it when JS
            is off (this <noscript> style only applies with JS disabled). */}
        <noscript>
          <style>{`.shark-loader{display:none!important}`}</style>
        </noscript>

        {/* Skip link: first focusable element, jumps past the ocean chrome to
            the page content. */}
        <a
          href="#content"
          className="sr-only left-4 top-4 z-50 rounded-md bg-bio-cyan px-4 py-2 font-medium text-abyss-void focus:not-sr-only"
        >
          Skip to content
        </a>

        {/*
          THE PERSISTENT OCEAN. Lives in the layout, so the WebGL canvas + every
          chrome piece persist across client-side route navigations (no
          unmount/remount, no flash). The page content below swaps; the ocean
          stays, and the camera dives between depths as each route's ZoneSetter
          changes the target. DescentChrome is a Client Component that does the
          ssr:false dynamic import of the canvas internally (ssr:false is not
          allowed directly in this Server Component layout).
        */}
        <DescentChrome />

        {/* Page content rides on top of the fixed ocean (z auto > -z-10). The
            #content anchor is the skip-link target. */}
        <div id="content">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
