import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * FcScope - the styling boundary for the Financial Communications Platform
 * demo. Unlike the dark Galactic/Mocean scopes, Financial Comms is a LIGHT, institutional
 * fintech surface: Inter + JetBrains Mono on an off-white canvas, ink-near-black
 * text, and Ultramarine (#0027b3) used sparingly as the single accent. Every
 * Financial Comms component reads these scoped `--fc-*` tokens; nothing leaks into the
 * global ocean theme in globals.css.
 *
 * Exact hexes match the production app's design tokens (app/globals.css): canvas
 * #fafafa, card #ffffff, hairline border #e1e4ea, ink #0c0e13, accent #0027b3.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fc-sans",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fc-mono",
  display: "swap",
});

export default function FcScope({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${jbMono.variable}`}
      style={
        {
          // surfaces
          "--fc-bg": "#fafafa",
          "--fc-card": "#ffffff",
          "--fc-surface-2": "#f3f4f6",
          "--fc-recessed": "#f8fafc",
          // ink + text
          "--fc-ink": "#0c0e13",
          "--fc-ink-2": "#3a3f4a",
          "--fc-muted": "#6b7280",
          "--fc-faint": "#9ca3af",
          // structure
          "--fc-border": "#e1e4ea",
          "--fc-border-strong": "#c8ccd4",
          // accent (Ultramarine) - used on ~5% of pixels
          "--fc-accent": "#0027b3",
          "--fc-accent-700": "#001870",
          "--fc-accent-wash": "#eef1fc",
          // semantic (never decorative)
          "--fc-up": "#15803d",
          "--fc-down": "#b91c1c",
          "--fc-warn": "#b45309",
          // nav-section / chart tints (small dots only)
          "--fc-sec-overview": "#2563eb",
          "--fc-sec-earnings": "#059669",
          "--fc-sec-intel": "#0d9488",
          "--fc-sec-strategy": "#7c3aed",
          "--fc-sec-rnd": "#d97706",
          "--fc-sec-comms": "#db2777",
          "--fc-sec-capmkts": "#0ea5e9",
          "--fc-pink": "#db2777",
          // fonts
          "--fc-mono": "var(--font-fc-mono)",
          fontFamily: "var(--font-fc-sans)",
          minHeight: "100vh",
          background: "var(--fc-bg)",
          color: "var(--fc-ink)",
          fontFeatureSettings: '"cv11", "ss01", "tnum"',
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced fc-*) so the Financial Comms demo carries its own
          motion without touching the global ocean stylesheet. Static literal. */}
      <style>{`
@keyframes fc-pulse-ring { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes fc-blink { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
@keyframes fc-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes fc-dot { 0%,80%,100% { opacity:.25; transform: translateY(0) } 40% { opacity:1; transform: translateY(-2px) } }
@keyframes fc-pop { 0% { opacity: 0; transform: translateY(6px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes fc-slide-in { 0% { opacity: 0; transform: translateX(14px) } 100% { opacity: 1; transform: translateX(0) } }
@keyframes fc-caret { 0%,100% { opacity: 0 } 50% { opacity: 1 } }
`}</style>
      {children}
    </div>
  );
}
