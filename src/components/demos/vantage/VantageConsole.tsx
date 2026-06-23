"use client";

import { useEffect, useState } from "react";
import { MODULE_LABELS, POSTURE, type ModuleId } from "@/data/vantage-demo";
import { Icon, cx } from "./VantageKit";
import VantageSidebar from "./VantageSidebar";
import { VantageNav } from "./nav-context";

import Overview from "./modules/Overview";
import Activity from "./modules/Activity";
import Incidents from "./modules/Incidents";
import Detections from "./modules/Detections";
import ThreatIntel from "./modules/ThreatIntel";
import Assets from "./modules/Assets";
import Vulnerabilities from "./modules/Vulnerabilities";
import Network from "./modules/Network";
import Identity from "./modules/Identity";
import Compliance from "./modules/Compliance";
import Agents from "./modules/Agents";
import Admin from "./modules/Admin";

/**
 * VantageConsole - the command-center app shell. The sidebar selection switches
 * the active module via local state (no route change), so all 12 module screens
 * live behind one Next route. A `?module=` query param deep-links to a module,
 * resolved after mount to keep the SSR markup stable.
 */
const MODULES: Record<ModuleId, React.ComponentType> = {
  overview: Overview,
  activity: Activity,
  incidents: Incidents,
  detections: Detections,
  "threat-intel": ThreatIntel,
  assets: Assets,
  vulnerabilities: Vulnerabilities,
  network: Network,
  identity: Identity,
  compliance: Compliance,
  agents: Agents,
  admin: Admin,
};

const VALID = new Set<string>(Object.keys(MODULES));

const THREAT_TONE: Record<typeof POSTURE.threatLevel, string> = {
  Guarded: "var(--vnt-up)",
  Elevated: "var(--vnt-warn)",
  High: "var(--vnt-high)",
  Severe: "var(--vnt-crit)",
};

export default function VantageConsole() {
  const [active, setActive] = useState<ModuleId>("overview");
  const [drawer, setDrawer] = useState(false);

  // One-time deep-link resolve after mount (reading window during render would
  // diverge from the server default and cause a hydration mismatch).
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get("module");
    if (m && VALID.has(m)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(m as ModuleId);
    }
  }, []);

  const select = (id: ModuleId) => {
    setActive(id);
    setDrawer(false);
  };

  const ActiveModule = MODULES[active];
  const threatTone = THREAT_TONE[POSTURE.threatLevel];

  return (
    <div className="flex min-h-screen bg-[var(--vnt-bg)]">
      {/* sidebar - desktop */}
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-[248px] shrink-0 border-r border-[var(--vnt-border)] bg-[var(--vnt-card)] lg:block">
        <VantageSidebar active={active} onSelect={select} />
      </aside>

      {/* sidebar - mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] border-r border-[var(--vnt-border)] bg-[var(--vnt-card)] shadow-2xl">
            <VantageSidebar active={active} onSelect={select} />
          </div>
        </div>
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar */}
        <header className="sticky top-12 z-30 flex items-center gap-3 border-b border-[var(--vnt-border)] bg-[var(--vnt-card)]/90 px-4 py-2.5 backdrop-blur">
          <button
            onClick={() => setDrawer(true)}
            className="rounded-md p-1.5 text-[var(--vnt-muted)] hover:bg-[var(--vnt-surface-2)] lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name="dashboard" size={18} />
          </button>

          <h1 className="text-[14px] font-semibold text-[var(--vnt-ink)]">{MODULE_LABELS[active]}</h1>

          {/* threat-level pill */}
          <span
            className="ml-1 hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide sm:inline-flex"
            style={{ color: threatTone, borderColor: `color-mix(in srgb, ${threatTone} 35%, transparent)`, background: `color-mix(in srgb, ${threatTone} 12%, transparent)` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: threatTone, animation: "vnt-blink 1.6s ease-in-out infinite" }} />
            Threat: {POSTURE.threatLevel}
          </span>

          {/* search */}
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-[var(--vnt-border)] bg-[var(--vnt-bg)] px-2.5 py-1.5 text-[var(--vnt-faint)] md:flex">
            <Icon name="search" size={14} />
            <input
              disabled
              placeholder="Search host, IP, CVE, user, or incident"
              className="w-60 bg-transparent text-[12px] text-[var(--vnt-muted)] placeholder:text-[var(--vnt-faint)] focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--vnt-muted)] transition-colors hover:bg-[var(--vnt-surface-2)] hover:text-[var(--vnt-ink)]">
              <Icon name="bell" size={16} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--vnt-crit)]" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--vnt-muted)] transition-colors hover:bg-[var(--vnt-surface-2)] hover:text-[var(--vnt-ink)]">
              <Icon name="settings" size={16} />
            </button>
          </div>
        </header>

        {/* content */}
        <main className="flex-1">
          <div className={cx("mx-auto px-4 py-6 sm:px-6", active === "overview" ? "max-w-[1280px]" : "max-w-[1180px]")}>
            <VantageNav.Provider value={select}>
              <ActiveModule />
            </VantageNav.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}
