"use client";

import { useEffect, useState } from "react";
import { MODULE_LABELS, ACTIVE_COMPANY, type ModuleId } from "@/data/sec-demo";
import { Icon, RoleToggle, type Role, cx } from "./SecKit";
import SecSidebar from "./SecSidebar";
import { SecNav, SecRole } from "./console-context";

import SecDashboard from "./modules/SecDashboard";
import SecWatchlist from "./modules/SecWatchlist";
import SecFilingFeed from "./modules/SecFilingFeed";
import SecInsider from "./modules/SecInsider";
import SecAIAnalyst from "./modules/SecAIAnalyst";
import SecAlertCenter from "./modules/SecAlertCenter";
import SecAdmin from "./modules/SecAdmin";

/**
 * SecConsole - the SEC Intelligence app shell. The sidebar selection switches the
 * active module via local state (no route change), so all seven screens live behind
 * one Next route. A `?module=` query param deep-links to a module and `?role=`
 * deep-links to the wealth-manager / trader view, both resolved after mount to keep
 * the SSR markup stable (matches the Beacon + Galactic patterns).
 */
const MODULES: Record<ModuleId, React.ComponentType> = {
  dashboard: SecDashboard,
  watchlist: SecWatchlist,
  filings: SecFilingFeed,
  insider: SecInsider,
  "ai-analyst": SecAIAnalyst,
  alerts: SecAlertCenter,
  admin: SecAdmin,
};

const VALID = new Set<string>(Object.keys(MODULES));

export default function SecConsole() {
  const [active, setActive] = useState<ModuleId>("dashboard");
  const [role, setRole] = useState<Role>("advisor");
  const [drawer, setDrawer] = useState(false);

  // One-time deep-link resolve after mount (reading window during render would
  // diverge from the server defaults and cause a hydration mismatch).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("module");
    const r = params.get("role");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time deep-link sync from the URL after mount
    if (m && VALID.has(m)) setActive(m as ModuleId);
    if (r === "trader" || r === "advisor") setRole(r);
  }, []);

  const select = (id: ModuleId) => {
    setActive(id);
    setDrawer(false);
  };

  const ActiveModule = MODULES[active];

  return (
    <SecRole.Provider value={role}>
      <SecNav.Provider value={select}>
        <div className="flex min-h-screen bg-[var(--sec-bg)]">
          {/* sidebar - desktop */}
          <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-[248px] shrink-0 border-r border-[var(--sec-border)] bg-[var(--sec-card)] lg:block">
            <SecSidebar active={active} onSelect={select} />
          </aside>

          {/* sidebar - mobile drawer */}
          {drawer && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
              <div className="absolute left-0 top-0 h-full w-[280px] border-r border-[var(--sec-border)] bg-[var(--sec-card)] shadow-2xl">
                <SecSidebar active={active} onSelect={select} />
              </div>
            </div>
          )}

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* topbar */}
            <header className="sticky top-12 z-30 flex items-center gap-3 border-b border-[var(--sec-border)] bg-[var(--sec-card)]/90 px-4 py-2.5 backdrop-blur">
              <button
                onClick={() => setDrawer(true)}
                className="rounded-md p-1.5 text-[var(--sec-muted)] hover:bg-[var(--sec-surface-2)] lg:hidden"
                aria-label="Open navigation"
              >
                <Icon name="dashboard" size={18} />
              </button>

              <h1 className="text-[14px] font-semibold text-[var(--sec-ink)]">{MODULE_LABELS[active]}</h1>

              {/* company selector pill */}
              <button className="ml-1 hidden items-center gap-1.5 rounded-full border border-[var(--sec-border)] bg-[var(--sec-surface-2)] px-2.5 py-1 text-[12px] font-medium text-[var(--sec-ink-2)] transition-colors hover:border-[var(--sec-border-strong)] sm:inline-flex">
                <span className="font-mono font-semibold text-[var(--sec-accent)]">{ACTIVE_COMPANY.ticker}</span>
                <span className="text-[var(--sec-faint)]">{ACTIVE_COMPANY.name}</span>
                <Icon name="chevronDown" size={13} className="text-[var(--sec-faint)]" />
              </button>

              {/* search */}
              <div className="ml-auto hidden items-center gap-2 rounded-lg border border-[var(--sec-border)] bg-[var(--sec-recessed)] px-2.5 py-1.5 text-[var(--sec-faint)] xl:flex">
                <Icon name="search" size={14} />
                <input
                  disabled
                  placeholder="Search ticker, company, or filing"
                  className="w-52 bg-transparent text-[12px] text-[var(--sec-muted)] placeholder:text-[var(--sec-faint)] focus:outline-none"
                />
              </div>

              <div className="ml-auto flex items-center gap-2 xl:ml-0">
                <RoleToggle role={role} onChange={setRole} />
                <button
                  onClick={() => select("alerts")}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--sec-muted)] transition-colors hover:bg-[var(--sec-surface-2)] hover:text-[var(--sec-ink)]"
                  aria-label="Alerts"
                >
                  <Icon name="bell" size={16} />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--sec-material)]" />
                </button>
                <button
                  onClick={() => select("admin")}
                  className="hidden h-8 w-8 items-center justify-center rounded-full text-[var(--sec-muted)] transition-colors hover:bg-[var(--sec-surface-2)] hover:text-[var(--sec-ink)] sm:flex"
                  aria-label="Settings"
                >
                  <Icon name="settings" size={16} />
                </button>
              </div>
            </header>

            {/* content */}
            <main className="flex-1">
              <div className={cx("mx-auto px-4 py-6 sm:px-6", active === "dashboard" ? "max-w-[1280px]" : "max-w-[1180px]")}>
                <ActiveModule />
              </div>
            </main>
          </div>
        </div>
      </SecNav.Provider>
    </SecRole.Provider>
  );
}
