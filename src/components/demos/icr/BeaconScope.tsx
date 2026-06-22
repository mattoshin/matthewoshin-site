import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * BeaconScope - the styling boundary for the ICR Intelligence Platform (Beacon)
 * demo. Unlike the dark Galactic/Mocean scopes, Beacon is a LIGHT, institutional
 * fintech surface: Inter + JetBrains Mono on an off-white canvas, ink-near-black
 * text, and ICR Ultramarine (#0027b3) used sparingly as the single accent. Every
 * Beacon component reads these scoped `--icr-*` tokens; nothing leaks into the
 * global ocean theme in globals.css.
 *
 * Exact hexes match the production app's design tokens (app/globals.css): canvas
 * #fafafa, card #ffffff, hairline border #e1e4ea, ink #0c0e13, accent #0027b3.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-icr-sans",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-icr-mono",
  display: "swap",
});

export default function BeaconScope({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${jbMono.variable}`}
      style={
        {
          // surfaces
          "--icr-bg": "#fafafa",
          "--icr-card": "#ffffff",
          "--icr-surface-2": "#f3f4f6",
          "--icr-recessed": "#f8fafc",
          // ink + text
          "--icr-ink": "#0c0e13",
          "--icr-ink-2": "#3a3f4a",
          "--icr-muted": "#6b7280",
          "--icr-faint": "#9ca3af",
          // structure
          "--icr-border": "#e1e4ea",
          "--icr-border-strong": "#c8ccd4",
          // accent (ICR Ultramarine) - used on ~5% of pixels
          "--icr-accent": "#0027b3",
          "--icr-accent-700": "#001870",
          "--icr-accent-wash": "#eef1fc",
          // semantic (never decorative)
          "--icr-up": "#15803d",
          "--icr-down": "#b91c1c",
          "--icr-warn": "#b45309",
          // nav-section / chart tints (small dots only)
          "--icr-sec-overview": "#2563eb",
          "--icr-sec-earnings": "#059669",
          "--icr-sec-intel": "#0d9488",
          "--icr-sec-strategy": "#7c3aed",
          "--icr-sec-rnd": "#d97706",
          "--icr-pink": "#db2777",
          // fonts
          "--icr-mono": "var(--font-icr-mono)",
          fontFamily: "var(--font-icr-sans)",
          minHeight: "100vh",
          background: "var(--icr-bg)",
          color: "var(--icr-ink)",
          fontFeatureSettings: '"cv11", "ss01", "tnum"',
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced icr-*) so the Beacon demo carries its own
          motion without touching the global ocean stylesheet. Static literal. */}
      <style>{`
@keyframes icr-pulse-ring { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes icr-blink { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
@keyframes icr-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes icr-dot { 0%,80%,100% { opacity:.25; transform: translateY(0) } 40% { opacity:1; transform: translateY(-2px) } }
@keyframes icr-pop { 0% { opacity: 0; transform: translateY(6px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes icr-slide-in { 0% { opacity: 0; transform: translateX(14px) } 100% { opacity: 1; transform: translateX(0) } }
@keyframes icr-caret { 0%,100% { opacity: 0 } 50% { opacity: 1 } }
`}</style>
      {children}
    </div>
  );
}
