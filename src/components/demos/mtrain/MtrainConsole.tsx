"use client";

import { useEffect, useState } from "react";
import { MODULE_LABELS, MTRAIN_USER, type ModuleId } from "@/data/mtrain-demo";
import { Icon, Avatar } from "./MtrainKit";
import MtrainSidebar from "./MtrainSidebar";
import { MtrainNav } from "./nav-context";

import Overview from "./modules/Overview";
import Schedule from "./modules/Schedule";
import Leads from "./modules/Leads";
import Members from "./modules/Members";

/**
 * MtrainConsole - the studio-admin app shell. The sidebar selection switches the
 * active module via local state (no route change), so all four module screens live
 * behind one Next route. A `?module=` query param deep-links to a module, resolved
 * after mount to keep the SSR markup stable.
 */
const MODULES: Record<ModuleId, React.ComponentType> = {
  overview: Overview,
  schedule: Schedule,
  leads: Leads,
  members: Members,
};

const VALID = new Set<string>(Object.keys(MODULES));

export default function MtrainConsole() {
  const [active, setActive] = useState<ModuleId>("overview");
  const [drawer, setDrawer] = useState(false);

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
    <div className="flex min-h-screen">
      {/* sidebar - desktop */}
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-[240px] shrink-0 border-r border-[var(--mt-border)] bg-[var(--mt-card)]/70 backdrop-blur-xl lg:block">
        <MtrainSidebar active={active} onSelect={select} />
      </aside>

      {/* sidebar - mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-[272px] border-r border-[var(--mt-border)] bg-[var(--mt-card)] shadow-xl">
            <MtrainSidebar active={active} onSelect={select} />
          </div>
        </div>
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-12 z-30 flex items-center gap-3 border-b border-[var(--mt-border)] bg-[var(--mt-bg)]/80 px-4 py-2.5 backdrop-blur-xl">
          <button
            onClick={() => setDrawer(true)}
            className="rounded-md p-1.5 text-[var(--mt-muted)] hover:bg-[var(--mt-surface-2)] lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name="filter" size={18} />
          </button>

          <h1 className="text-[14px] font-semibold text-[var(--mt-ink)]">{MODULE_LABELS[active]}</h1>

          <div className="ml-auto hidden items-center gap-2 rounded-full border border-[var(--mt-border)] bg-[var(--mt-card)] px-3 py-1.5 text-[var(--mt-faint)] md:flex">
            <Icon name="search" size={14} />
            <input
              disabled
              placeholder="Search members, classes, or leads"
              className="w-56 bg-transparent text-[12px] text-[var(--mt-muted)] placeholder:text-[var(--mt-faint)] focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--mt-muted)] transition-colors hover:bg-[var(--mt-surface-2)] hover:text-[var(--mt-ink)]">
              <Icon name="bell" size={16} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--mt-clay)]" />
            </button>
            <Avatar initials={MTRAIN_USER.initials} size={28} />
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-[1160px] px-4 py-6 sm:px-6">
            <MtrainNav.Provider value={select}>
              <ActiveModule />
            </MtrainNav.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}
