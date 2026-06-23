import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * VantageScope - the styling boundary for the SecOps Command demo: an agentic security +
 * IT operations command center. Where the Beacon scope is a light institutional
 * fintech surface, SecOps Command is a dark "midnight terminal" SOC console: carbon ->
 * obsidian surfaces, spectral-violet primary, electric-lime highlight, and
 * system-teal accent, with a red/amber/yellow/teal severity scale. Every SecOps Command
 * component reads these scoped `--vnt-*` tokens; nothing leaks into the global
 * ocean theme in globals.css.
 *
 * Palette grounded in a Refero pass over real cybersecurity command centers
 * (Twingate "Midnight Terminal, Pulsing Neon" + Axiom console density).
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vnt-sans",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vnt-mono",
  display: "swap",
});

export default function VantageScope({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${jbMono.variable}`}
      style={
        {
          // surfaces (carbon -> basalt -> obsidian)
          "--vnt-bg": "#0e0f11",
          "--vnt-card": "#141617",
          "--vnt-surface-2": "#1b1e21",
          "--vnt-raised": "#1d2023",
          // ink + text
          "--vnt-ink": "#ffffff",
          "--vnt-ink-2": "#c9cdd2",
          "--vnt-muted": "#9aa0a8",
          "--vnt-faint": "#6b7178",
          // structure (low-contrast hairlines on dark)
          "--vnt-border": "#26292e",
          "--vnt-border-strong": "#363a40",
          // accent (spectral violet) - primary interactive
          "--vnt-primary": "#b6abff",
          "--vnt-primary-700": "#8b7df0",
          "--vnt-primary-wash": "rgba(182,171,255,0.10)",
          // highlight (electric lime) + accent (system teal)
          "--vnt-highlight": "#eef35f",
          "--vnt-highlight-wash": "rgba(238,243,95,0.10)",
          "--vnt-accent": "#00cbaa",
          "--vnt-accent-wash": "rgba(0,203,170,0.10)",
          // severity / semantic scale
          "--vnt-crit": "#ff5c6c",
          "--vnt-high": "#f5a623",
          "--vnt-med": "#e6c84f",
          "--vnt-low": "#00cbaa",
          "--vnt-info": "#7aa2ff",
          "--vnt-up": "#36d399",
          "--vnt-down": "#ff5c6c",
          "--vnt-warn": "#f5a623",
          // nav-section dots (one hue per section)
          "--vnt-sec-ops": "#b6abff",
          "--vnt-sec-secops": "#ff7a85",
          "--vnt-sec-itops": "#00cbaa",
          "--vnt-sec-gov": "#eef35f",
          "--vnt-sec-auto": "#7aa2ff",
          // fonts
          "--vnt-mono": "var(--font-vnt-mono)",
          fontFamily: "var(--font-vnt-sans)",
          minHeight: "100vh",
          background: "var(--vnt-bg)",
          color: "var(--vnt-ink)",
          fontFeatureSettings: '"cv11", "ss01", "tnum"',
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced vnt-*) so the SecOps Command demo carries its own
          motion without touching the global ocean stylesheet. Static literal. */}
      <style>{`
@keyframes vnt-pulse-ring { 0% { transform: scale(1); opacity: .55 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes vnt-blink { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
@keyframes vnt-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes vnt-dot { 0%,80%,100% { opacity:.25; transform: translateY(0) } 40% { opacity:1; transform: translateY(-2px) } }
@keyframes vnt-pop { 0% { opacity: 0; transform: translateY(6px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes vnt-slide-in { 0% { opacity: 0; transform: translateX(14px) } 100% { opacity: 1; transform: translateX(0) } }
@keyframes vnt-scan { 0% { transform: translateY(-100%) } 100% { transform: translateY(400%) } }
@keyframes vnt-sweep { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
@keyframes vnt-glow { 0%,100% { opacity: .4 } 50% { opacity: 1 } }
`}</style>
      {children}
    </div>
  );
}
