import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * AtriumScope - the styling boundary for the Atrium demo. Atrium is an unbranded
 * concept: a redesign of the corporate employee workspace, light and consumer-grade,
 * the antidote to the junk drawer of legacy corporate portals.
 *
 * The "Aurora" theme: a near-white canvas washed with soft violet-to-cyan radial
 * fields, so the frosted-glass surfaces (GlassCard) have color to refract. A single
 * violet accent (#6d4aff) with a cyan partner (#22b8e0) carries the brand; depth
 * comes from translucency and hairline borders rather than heavy shadows. Every
 * Atrium component reads these scoped `--atr-*` tokens; nothing leaks into the
 * global ocean theme in globals.css. Numerics use the shared mono (font-mono).
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-atr-sans",
  display: "swap",
});

export default function AtriumScope({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={jakarta.variable}
      style={
        {
          // surfaces
          "--atr-bg": "#fafafe",
          "--atr-card": "#ffffff",
          "--atr-glass": "rgba(255,255,255,0.62)",
          "--atr-glass-border": "rgba(255,255,255,0.75)",
          "--atr-surface-2": "#f1f1fa",
          "--atr-recessed": "#f7f7fd",
          // ink + text
          "--atr-ink": "#14121f",
          "--atr-ink-2": "#3a3850",
          "--atr-muted": "#6b6880",
          "--atr-faint": "#9a97ad",
          // structure
          "--atr-border": "rgba(20,18,31,0.08)",
          "--atr-border-strong": "rgba(20,18,31,0.16)",
          // accent (Aurora violet + cyan)
          "--atr-accent": "#6d4aff",
          "--atr-accent-2": "#22b8e0",
          "--atr-accent-700": "#5a37e6",
          "--atr-accent-wash": "#f0ecff",
          // semantic (never decorative)
          "--atr-up": "#15803d",
          "--atr-down": "#dc2626",
          "--atr-warn": "#d97706",
          // nav-section tints (small dots only)
          "--atr-sec-workspace": "#6d4aff",
          "--atr-sec-tools": "#22b8e0",
          "--atr-sec-support": "#0ea5a3",
          "--atr-sec-assistant": "#a855f7",
          fontFamily: "var(--font-atr-sans)",
          minHeight: "100vh",
          color: "var(--atr-ink)",
          // the aurora field: violet top-left, cyan top-right, violet low-right,
          // over the near-white base. This is what the glass surfaces refract.
          background:
            "radial-gradient(62% 55% at 12% -5%, rgba(124,92,255,0.20), transparent 60%), radial-gradient(55% 50% at 98% 0%, rgba(34,184,224,0.16), transparent 58%), radial-gradient(52% 46% at 88% 108%, rgba(124,92,255,0.12), transparent 60%), var(--atr-bg)",
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced atr-*) so the Atrium demo carries its own
          motion without touching the global ocean stylesheet. Static literal. */}
      <style>{`
@keyframes atr-pulse-ring { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes atr-blink { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
@keyframes atr-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes atr-dot { 0%,80%,100% { opacity:.25; transform: translateY(0) } 40% { opacity:1; transform: translateY(-2px) } }
@keyframes atr-pop { 0% { opacity: 0; transform: translateY(6px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes atr-slide-in { 0% { opacity: 0; transform: translateX(14px) } 100% { opacity: 1; transform: translateX(0) } }
@keyframes atr-caret { 0%,100% { opacity: 0 } 50% { opacity: 1 } }
@keyframes atr-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
@media (prefers-reduced-motion: reduce) {
  [class*="atr-"], [style*="atr-"] { animation: none !important; }
}
`}</style>
      {children}
    </div>
  );
}
