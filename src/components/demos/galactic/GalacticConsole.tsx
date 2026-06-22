"use client";

import { useEffect, useState } from "react";
import GalacticDashboard from "./GalacticDashboard";
import GalacticAdmin from "./GalacticAdmin";
import { Icon } from "./GalacticKit";

/**
 * GalacticConsole - wraps the Galactic demo app and lets a viewer flip between
 * the customer-facing user dashboard and the internal admin console with a single
 * top toggle. State lives here so the switch is instant (no route change); each
 * view renders the shared toggle in its own header. A `?view=admin` query param
 * deep-links straight to the admin console (resolved after mount to keep the SSR
 * markup stable).
 */
type Mode = "user" | "admin";

export default function GalacticConsole() {
  const [mode, setMode] = useState<Mode>("user");
  // One-time deep-link resolve after mount: reading window during render would
  // diverge from the server ("user") and cause a hydration mismatch, so we sync
  // from the URL here on purpose.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "admin") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("admin");
    }
  }, []);
  const toggle = <ConsoleToggle mode={mode} onChange={setMode} />;
  return mode === "user" ? <GalacticDashboard modeToggle={toggle} /> : <GalacticAdmin modeToggle={toggle} />;
}

function ConsoleToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--g-faint)] sm:inline">View as</span>
      <div
        className="inline-flex items-center rounded-xl border p-1"
        style={{ borderColor: "var(--g-border)", background: "var(--g-panel-2)" }}
        role="tablist"
        aria-label="Switch between the user and admin console"
      >
        {(["user", "admin"] as const).map((m) => {
          const active = mode === m;
          const activeStyle =
            m === "admin"
              ? { background: "var(--g-blurple)", color: "#fff", boxShadow: "0 6px 18px rgba(88,101,242,0.35)" }
              : { background: "var(--g-teal)", color: "#04140f", boxShadow: "0 6px 18px rgba(29,209,161,0.3)" };
          return (
            <button
              key={m}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(m)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
              style={active ? activeStyle : { color: "var(--g-muted)" }}
            >
              <Icon name={m === "admin" ? "shield" : "users"} size={13} />
              {m === "user" ? "User" : "Admin"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
