import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * SecScope - the styling boundary for the SEC Intelligence demo. Where the fincomms
 * demo is a LIGHT institutional surface, SEC Intelligence is a DARK, "modern
 * Bloomberg terminal": near-black canvas, glassy hairline-bordered cards, white +
 * gray doing most of the work, a single cool azure for interaction, green/red for
 * filing sentiment and price, and one gold flag reserved for "material" filings.
 * Grounded in Refero references (Fey's midnight command-center, Glassnode's
 * institutional discipline). Every SEC component reads these scoped `--sec-*`
 * tokens; nothing leaks into the global ocean theme in globals.css.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sec-sans",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sec-mono",
  display: "swap",
});

export default function SecScope({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${jbMono.variable}`}
      style={
        {
          // surfaces (near-black, layered like Fey: canvas -> card -> elevated)
          "--sec-bg": "#060708",
          "--sec-card": "#0c0e11",
          "--sec-surface-2": "#131619",
          "--sec-recessed": "#0a0b0d",
          "--sec-elevated": "#15191e",
          // ink + text (white does the work)
          "--sec-ink": "#f3f5f7",
          "--sec-ink-2": "#aeb6c0",
          "--sec-muted": "#737d89",
          "--sec-faint": "#4a525c",
          // structure (hairline borders over shadows)
          "--sec-border": "rgba(255,255,255,0.08)",
          "--sec-border-strong": "rgba(255,255,255,0.15)",
          // accent (azure - interactive / brand; ~5% of pixels)
          "--sec-accent": "#3da9fc",
          "--sec-accent-2": "#1f6fd4",
          "--sec-accent-wash": "rgba(61,169,252,0.12)",
          // semantic (never decorative)
          "--sec-up": "#3fcf8e",
          "--sec-up-wash": "rgba(63,207,142,0.12)",
          "--sec-down": "#f2555a",
          "--sec-down-wash": "rgba(242,85,90,0.12)",
          // material / urgent filing flag - the single gold accent, used sparingly
          "--sec-material": "#f5b53d",
          "--sec-material-wash": "rgba(245,181,61,0.13)",
          "--sec-warn": "#f5b53d",
          // nav-section dots (small dots only)
          "--sec-sec-overview": "#3da9fc",
          "--sec-sec-filings": "#3fcf8e",
          "--sec-sec-surveillance": "#b59bff",
          "--sec-sec-ai": "#52d9d0",
          "--sec-sec-alerts": "#f5b53d",
          // fonts
          "--sec-mono": "var(--font-sec-mono)",
          fontFamily: "var(--font-sec-sans)",
          minHeight: "100vh",
          background: "var(--sec-bg)",
          color: "var(--sec-ink)",
          fontFeatureSettings: '"cv11", "ss01", "tnum"',
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced sec-*) so the demo carries its own motion
          without touching the global ocean stylesheet. Static literal. */}
      <style>{`
@keyframes sec-pulse-ring { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes sec-blink { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
@keyframes sec-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes sec-dot { 0%,80%,100% { opacity:.25; transform: translateY(0) } 40% { opacity:1; transform: translateY(-2px) } }
@keyframes sec-pop { 0% { opacity: 0; transform: translateY(6px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes sec-slide-in { 0% { opacity: 0; transform: translateX(14px) } 100% { opacity: 1; transform: translateX(0) } }
@keyframes sec-caret { 0%,100% { opacity: 0 } 50% { opacity: 1 } }
@keyframes sec-tape { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
@media (prefers-reduced-motion: reduce) {
  .sec-tape-track { animation: none !important; }
}
`}</style>
      {children}
    </div>
  );
}
