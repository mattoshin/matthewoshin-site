import { Poppins } from "next/font/google";

/**
 * MoceanScope - the styling boundary for the Mocean demo. Applies Mocean's own
 * brand (Poppins + the teal-on-navy palette from the original app's App.css) as
 * scoped CSS variables, fully isolated from the site's ocean theme. Every Mocean
 * component reads these tokens; nothing leaks into the global @theme.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function MoceanScope({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={poppins.className}
      style={
        {
          "--mo-bg": "#061427",
          "--mo-panel": "#0c222f",
          "--mo-panel-2": "#0a1b28",
          "--mo-border": "#2a545c",
          "--mo-teal": "#5ecdd1",
          "--mo-text": "#c2c4d1",
          "--mo-muted": "#8b97a8",
          "--mo-heading": "#ffffff",
          minHeight: "100vh",
          background: "var(--mo-bg)",
          color: "var(--mo-text)",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
