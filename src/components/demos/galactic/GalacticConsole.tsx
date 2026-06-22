"use client";

import { useEffect, useState } from "react";
import GalacticDashboard from "./GalacticDashboard";
import GalacticAdmin from "./GalacticAdmin";

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
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "admin") setMode("admin");
  }, []);
  const toggle = <ConsoleToggle mode={mode} onChange={setMode} />;
  return mode === "user" ? <GalacticDashboard modeToggle={toggle} /> : <GalacticAdmin modeToggle={toggle} />;
}

function ConsoleToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex items-center rounded-lg border p-0.5" style={{ borderColor: "var(--g-border)", background: "var(--g-panel-2)" }} role="tablist" aria-label="Switch console">
      {(["user", "admin"] as const).map((m) => {
        const active = mode === m;
        const activeStyle = m === "admin" ? { background: "var(--g-blurple)", color: "#fff" } : { background: "var(--g-teal)", color: "#04140f" };
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            className="rounded-md px-3 py-1 text-xs font-semibold transition-colors"
            style={active ? activeStyle : { color: "var(--g-muted)" }}
          >
            {m === "user" ? "User" : "Admin"}
          </button>
        );
      })}
    </div>
  );
}
