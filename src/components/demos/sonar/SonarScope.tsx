import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * SonarScope - the styling boundary for the Sonar Media demo. Applies Sonar Media's own
 * brand (Inter + JetBrains Mono on an amber "midnight command-center" palette,
 * grounded in a Refero style pass) as scoped CSS variables, fully isolated from
 * the site's ocean theme. Every Sonar Media component reads these tokens; nothing
 * leaks into the global @theme in globals.css.
 *
 * Foundation: deep charcoal surfaces, thin 1px borders, tight negative tracking
 * on headings, monospace for tickers / timestamps / spec, and a single
 * functional accent (signal amber #FFB224) reserved for actions and live state.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-s-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-s-mono",
  display: "swap",
});

export default function SonarScope({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={
        {
          "--s-bg": "#0A0C10",
          "--s-panel": "#11151C",
          "--s-panel-2": "#0C1016",
          "--s-raised": "#161B24",
          "--s-border": "#1E2632",
          "--s-text": "#C2CAD6",
          "--s-muted": "#7A8595",
          "--s-faint": "#4D5868",
          "--s-heading": "#FFFFFF",
          "--s-amber": "#FFB224",
          "--s-amber-dim": "rgba(255,178,36,0.12)",
          "--s-bull": "#36D399",
          "--s-bear": "#F87171",
          "--s-neutral": "#8B98A8",
          "--s-mono": "var(--font-s-mono)",
          fontFamily: "var(--font-s-sans)",
          letterSpacing: "-0.011em",
          minHeight: "100vh",
          background: "var(--s-bg)",
          color: "var(--s-text)",
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced s-*) so the Sonar Media demo carries its own
          motion without touching the global ocean-theme stylesheet. Static
          literal, no user input. */}
      <style>{`
@keyframes s-sweep { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes s-ping { 0% { transform: scale(1); opacity: .55 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes s-pop { 0% { transform: translateY(6px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
@keyframes s-blip { 0%,100% { opacity: .25; transform: scale(.85) } 50% { opacity: 1; transform: scale(1) } }
@keyframes s-fade { 0% { opacity: 0 } 100% { opacity: 1 } }
@keyframes s-slide-in { 0% { transform: translateX(20px); opacity: 0 } 100% { transform: translateX(0); opacity: 1 } }
`}</style>
      {children}
    </div>
  );
}
