import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/content";
import DescentChrome from "@/components/chrome/DescentChrome";
import SiteFooter from "@/components/chrome/SiteFooter";

// Poppins (rounded, friendly, coherent) drives the type that sits on the water
// (hero, nav, bucket labels, OceanAI), the body and the labels via the --font-*
// vars in globals.css. Fraunces, the share card's face, is the serif for every
// heading inside a glass panel (`font-serif`), so the ocean keeps its playful
// sans and the card and the pages share one face.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Variable font, roman: weight axis plus optical size. Preloaded, since every
// glass-panel heading uses it.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: "normal",
  axes: ["opsz"],
  display: "swap",
});

// The italic is a second family on purpose: only pull quotes and the home beat
// set an italic serif, so it is fetched on use (`.font-serif.italic` in
// globals.css) instead of adding ~80 KB of preload to every route.
const frauncesItalic = Fraunces({
  variable: "--font-fraunces-italic",
  subsets: ["latin"],
  style: "italic",
  axes: ["opsz"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matthewoshin.com"),
  title: {
    default: "Matthew Oshin",
    template: "%s, Matthew Oshin",
  },
  description: `${SITE.name} builds ${SITE.focus}.`,
  authors: [{ name: SITE.name }],
  openGraph: {
    title: "Matthew Oshin",
    description: `${SITE.focus}.`,
    type: "website",
    url: "https://matthewoshin.com",
    // The card image comes from src/app/opengraph-image.tsx (file convention),
    // so the tagline is code, not pixels. Do not point this back at a PNG.
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Oshin",
    description: `${SITE.focus}.`,
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
      className={`${poppins.variable} ${fraunces.variable} ${frauncesItalic.variable} h-full antialiased`}
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
