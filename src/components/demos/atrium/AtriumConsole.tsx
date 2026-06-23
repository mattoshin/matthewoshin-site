"use client";

import { useEffect, useState } from "react";
import { MODULE_LABELS, ATRIUM_USER, type ModuleId } from "@/data/atrium-demo";
import { Icon, Avatar, cx, ATR_GRADIENT } from "./AtriumKit";
import AtriumSidebar from "./AtriumSidebar";
import { AtriumNav } from "./nav-context";

import AtriumHome from "./modules/AtriumHome";
import AppHub from "./modules/AppHub";
import Automations from "./modules/Automations";
import ItHub from "./modules/ItHub";
import Legal from "./modules/Legal";
import People from "./modules/People";
import Assistant from "./modules/Assistant";

/**
 * AtriumConsole - the Atrium app shell. The sidebar selection switches the active
 * module via local state (no route change), so all seven module screens live
 * behind one Next route. A `?module=` query param deep-links to a module, resolved
 * after mount to keep the SSR markup stable. A floating "Ask Atrium" launcher keeps
 * the assistant one tap away from anywhere (the ambient-AI presence).
 */
const MODULES: Record<ModuleId, React.ComponentType> = {
  home: AtriumHome,
  apps: AppHub,
  automations: Automations,
  it: ItHub,
  legal: Legal,
  people: People,
  assistant: Assistant,
};

const VALID = new Set<string>(Object.keys(MODULES));

export default function AtriumConsole() {
  const [active, setActive] = useState<ModuleId>("home");
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
    <div className="flex min-h-screen">
      {/* sidebar - desktop */}
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-[248px] shrink-0 border-r border-[var(--atr-border)] bg-[var(--atr-card)]/70 backdrop-blur-xl lg:block">
        <AtriumSidebar active={active} onSelect={select} />
      </aside>

      {/* sidebar - mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] border-r border-[var(--atr-border)] bg-[var(--atr-card)] shadow-xl">
            <AtriumSidebar active={active} onSelect={select} />
          </div>
        </div>
      )}

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar */}
        <header className="sticky top-12 z-30 flex items-center gap-3 border-b border-[var(--atr-border)] bg-[var(--atr-bg)]/70 px-4 py-2.5 backdrop-blur-xl">
          <button
            onClick={() => setDrawer(true)}
            className="rounded-md p-1.5 text-[var(--atr-muted)] hover:bg-[var(--atr-surface-2)] lg:hidden"
            aria-label="Open navigation"
          >
            <Icon name="grid" size={18} />
          </button>

          <h1 className="text-[14px] font-semibold text-[var(--atr-ink)]">{MODULE_LABELS[active]}</h1>

          {/* search */}
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-[var(--atr-border)] bg-[var(--atr-card)] px-3 py-1.5 text-[var(--atr-faint)] md:flex">
            <Icon name="search" size={14} />
            <input
              disabled
              placeholder="Search apps, people, docs, or ask anything"
              className="w-64 bg-transparent text-[12px] text-[var(--atr-muted)] placeholder:text-[var(--atr-faint)] focus:outline-none"
            />
            <span className="font-mono text-[10px] text-[var(--atr-faint)]">⌘K</span>
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {active !== "assistant" && (
              <button
                onClick={() => select("assistant")}
                className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(91,74,255,0.5)] transition-all hover:brightness-[1.06] sm:inline-flex"
                style={{ backgroundImage: ATR_GRADIENT }}
              >
                <Icon name="sparkles" size={13} /> Ask Atrium
              </button>
            )}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--atr-muted)] transition-colors hover:bg-[var(--atr-surface-2)] hover:text-[var(--atr-ink)]">
              <Icon name="bell" size={16} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--atr-accent)]" />
            </button>
            <Avatar initials={ATRIUM_USER.initials} size={28} />
          </div>
        </header>

        {/* content */}
        <main className="flex-1">
          <div className={cx("mx-auto px-4 py-6 sm:px-6", active === "home" ? "max-w-[1240px]" : "max-w-[1160px]")}>
            <AtriumNav.Provider value={select}>
              <ActiveModule />
            </AtriumNav.Provider>
          </div>
        </main>
      </div>

      {/* floating Ask Atrium launcher (ambient AI presence) */}
      {active !== "assistant" && (
        <button
          onClick={() => select("assistant")}
          aria-label="Ask Atrium"
          className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full text-white shadow-[0_12px_30px_-8px_rgba(91,74,255,0.6)] transition-transform hover:scale-105"
          style={{ backgroundImage: ATR_GRADIENT, height: 52, width: 52 }}
        >
          <Icon name="sparkles" size={22} />
        </button>
      )}
    </div>
  );
}
