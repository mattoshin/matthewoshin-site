import { Fraunces } from "next/font/google";

/**
 * MtrainScope - the styling boundary for the mTrain studio-admin demo. mTrain is a
 * real strength-and-wellness studio in Westport, CT; this is a clickable recreation
 * of its back-office dashboard on fictional sample data.
 *
 * The "Studio" theme: a warm sand canvas (#FAF8F4) under a soft evergreen/sage wash,
 * deep evergreen (#1F3D34) as the single accent with a sage partner (#8BA88E) and a
 * warm clay tertiary, editorial Fraunces serif for headings, and the shared mono for
 * numerics. Calm, premium, and grounded, the opposite of a clinical SaaS dashboard.
 * Every mTrain component reads the scoped `--mt-*` tokens; nothing leaks into the
 * global ocean theme.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mt-serif",
  display: "swap",
});

export default function MtrainScope({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={fraunces.variable}
      style={
        {
          // surfaces
          "--mt-bg": "#faf8f4",
          "--mt-card": "#ffffff",
          "--mt-surface-2": "#f2efe9",
          "--mt-recessed": "#f6f3ee",
          // ink + text
          "--mt-ink": "#1c1b19",
          "--mt-ink-2": "#43413b",
          "--mt-muted": "#6e6a60",
          "--mt-faint": "#9c978b",
          // structure
          "--mt-border": "rgba(28,27,25,0.09)",
          "--mt-border-strong": "rgba(28,27,25,0.17)",
          // accent (evergreen) + partners
          "--mt-accent": "#1f3d34",
          "--mt-accent-700": "#163029",
          "--mt-accent-wash": "#e7eeea",
          "--mt-sage": "#8ba88e",
          "--mt-clay": "#c98a5e",
          // semantic (never decorative)
          "--mt-up": "#2f7d52",
          "--mt-down": "#c0492b",
          "--mt-warn": "#b5762b",
          fontFamily:
            "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          minHeight: "100vh",
          color: "var(--mt-ink)",
          // warm sand base with a soft evergreen wash top-left and sage top-right,
          // so the white cards have a faint warmth to sit on.
          background:
            "radial-gradient(54% 48% at 6% -6%, rgba(31,61,52,0.07), transparent 60%), radial-gradient(48% 44% at 100% 0%, rgba(139,168,142,0.12), transparent 58%), var(--mt-bg)",
        } as React.CSSProperties
      }
    >
      {/* Scoped keyframes (namespaced mt-*) so the demo carries its own motion
          without touching the global stylesheet. Static literal. */}
      <style>{`
@keyframes mt-pulse-ring { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(2.6); opacity: 0 } }
@keyframes mt-rise { 0% { opacity: 0; transform: translateY(7px) } 100% { opacity: 1; transform: translateY(0) } }
@keyframes mt-grow { 0% { transform: scaleY(0); opacity: 0 } 100% { transform: scaleY(1); opacity: 1 } }
@media (prefers-reduced-motion: reduce) {
  [class*="mt-"], [style*="mt-"] { animation: none !important; }
}
`}</style>
      {children}
    </div>
  );
}
