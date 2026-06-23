"use client";

import { useEffect, useState } from "react";
import { MODULE_LABELS, ACTIVE_COMPANY, type ModuleId } from "@/data/icr-demo";
import { Icon, cx } from "./BeaconKit";
import BeaconSidebar from "./BeaconSidebar";
import { BeaconNav } from "./nav-context";

import Dashboard from "./modules/BeaconDashboard";
import DataSources from "./modules/DataSources";
import EarningsHub from "./modules/EarningsHub";
import GuidanceAnalyzer from "./modules/GuidanceAnalyzer";
import InvestorIntel from "./modules/InvestorIntel";
import PeerIntel from "./modules/PeerIntel";
import ConferenceIntel from "./modules/ConferenceIntel";
import CrisisCommand from "./modules/CrisisCommand";
import IpoCapitalMarkets from "./modules/IpoCapitalMarkets";
import Governance from "./modules/Governance";
import Comms from "./modules/Comms";
import Resources from "./modules/Resources";
import Admin from "./modules/Admin";

/**
 * BeaconConsole - the Financial Comms app shell. The sidebar selection switches the active
 * module via local state (no route change), so all 13 module screens live behind
 * one Next route. A `?module=` query param deep-links to a module, resolved after
 * mount to keep the SSR markup stable (matches the GalacticConsole pattern).
 */
const MODULES: Record<ModuleId, React.ComponentType> = {
  dashboard: Dashboard,
  "data-sources": DataSources,
  earnings: EarningsHub,
  guidance: GuidanceAnalyzer,
  investor: InvestorIntel,
  peers: PeerIntel,
  conference: ConferenceIntel,
  crisis: CrisisCommand,
  ipo: IpoCapitalMarkets,
  governance: Governance,
  comms: Comms,
  resources: Resources,
  admin: Admin,
};

const VALID = new Set<string>(Object.keys(MODULES));

export default function BeaconConsole() {
  const [active, setActive] = useState<ModuleId>("dashboard");
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

  return (
    <div className="flex min-h-screen bg-[var(--icr-bg)]">
      {/* sidebar - desktop */}
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-[248px] shrink-0 border-r border-[var(--icr-border)] bg-[var(--icr-card)] lg:block">
        <BeaconSidebar active={active} onSelect={select} />
      </aside>

      {/* sidebar - mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] border-r border-[var(--icr-border)] bg-[var(--icr-card)] shadow-xl">
            <BeaconSidebar active={active} onSelect={select} />
          </div>
        </div>
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar */}
        <header className="sticky top-12 z-30 flex items-center gap-3 border-b border-[var(--icr-border)] bg-[var(--icr-card)]/90 px-4 py-2.5 backdrop-blur">
          <button
            onClick={() => setDrawer(true)}
            className="rounded-md p-1.5 text-[var(--icr-muted)] hover:bg-[var(--icr-surface-2)] lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name="dashboard" size={18} />
          </button>

          <h1 className="text-[14px] font-semibold text-[var(--icr-ink)]">{MODULE_LABELS[active]}</h1>

          {/* company selector pill */}
          <button className="ml-1 hidden items-center gap-1.5 rounded-full border border-[var(--icr-border)] bg-[var(--icr-card)] px-2.5 py-1 text-[12px] font-medium text-[var(--icr-ink-2)] transition-colors hover:border-[var(--icr-border-strong)] sm:inline-flex">
            <span className="font-mono font-semibold text-[var(--icr-accent)]">{ACTIVE_COMPANY.ticker}</span>
            <span className="text-[var(--icr-faint)]">{ACTIVE_COMPANY.name}</span>
            <Icon name="chevronDown" size={13} className="text-[var(--icr-faint)]" />
          </button>

          {/* search */}
          <div className="ml-auto hidden items-center gap-2 rounded-lg border border-[var(--icr-border)] bg-[var(--icr-bg)] px-2.5 py-1.5 text-[var(--icr-faint)] md:flex">
            <Icon name="search" size={14} />
            <input
              disabled
              placeholder="Search company, ticker, or filing"
              className="w-56 bg-transparent text-[12px] text-[var(--icr-muted)] placeholder:text-[var(--icr-faint)] focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <IconButton name="bell" />
            <IconButton name="settings" />
          </div>
        </header>

        {/* content */}
        <main className="flex-1">
          <div className={cx("mx-auto px-4 py-6 sm:px-6", active === "dashboard" ? "max-w-[1240px]" : "max-w-[1160px]")}>
            <BeaconNav.Provider value={select}>
              <ActiveModule />
            </BeaconNav.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}

function IconButton({ name }: { name: Parameters<typeof Icon>[0]["name"] }) {
  return (
    <button className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--icr-muted)] transition-colors hover:bg-[var(--icr-surface-2)] hover:text-[var(--icr-ink)]">
      <Icon name={name} size={16} />
    </button>
  );
}
