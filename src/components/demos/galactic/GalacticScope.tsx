import { Space_Grotesk, Geist_Mono } from "next/font/google";

/**
 * GalacticScope - the styling boundary for the Galactic Signals demo. Applies
 * Galactic's own brand (Space Grotesk + Geist Mono on the dark cosmic palette
 * from the real app) as scoped CSS variables, fully isolated from the site's
 * ocean theme. Every Galactic component reads these tokens; nothing leaks into
 * the global @theme in globals.css.
 *
 * Exact hexes match the production app: bg #0B1120, teal accent #1DD1A1,
 * Discord blurple #5865F2 (the default embed color).
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-g-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-g-mono",
  display: "swap",
});

export default function GalacticScope({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${spaceGrotesk.variable} ${geistMono.variable}`}
      style={
        {
          "--g-bg": "#0B1120",
          "--g-panel": "#0F1A2E",
          "--g-panel-2": "#0C1424",
          "--g-border": "#1E2A44",
          "--g-teal": "#1DD1A1",
          "--g-cyan": "#22D3EE",
          "--g-blurple": "#5865F2",
          "--g-text": "#C7D2E0",
          "--g-muted": "#7C8DA8",
          "--g-faint": "#56688A",
          "--g-heading": "#FFFFFF",
          "--g-mono": "var(--font-g-mono)",
          fontFamily: "var(--font-g-sans)",
          minHeight: "100vh",
          background: "var(--g-bg)",
          color: "var(--g-text)",
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced g-*) so the Galactic demo carries its own
          motion without touching the global ocean-theme stylesheet. Static
          literal, no user input. */}
      <style>{`
@keyframes g-twinkle { 0%,100% { opacity: .2 } 50% { opacity: .9 } }
@keyframes g-pulse-ring { 0% { transform: scale(1); opacity: .6 } 100% { transform: scale(2.4); opacity: 0 } }
@keyframes g-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes g-pop { 0% { transform: translateY(6px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
@keyframes g-slide-in { 0% { transform: translateX(24px); opacity: 0 } 100% { transform: translateX(0); opacity: 1 } }
`}</style>
      {children}
    </div>
  );
}
