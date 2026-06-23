"use client";

import { BEACON_NAV, BEACON_ACCOUNT, type ModuleId } from "@/data/icr-demo";
import { Wordmark, Icon, cx } from "./BeaconKit";

/**
 * BeaconSidebar - the grouped left navigation rail. Mirrors the real Financial Comms
 * structure (Overview / Earnings / Intelligence / Strategy / Workspace). Active
 * item gets the accent treatment that is the single place ultramarine appears in
 * the nav: accent-wash fill + accent text + a 2px left bar.
 */
export default function BeaconSidebar({
  active,
  onSelect,
}: {
  active: ModuleId;
  onSelect: (id: ModuleId) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* brand */}
      <div className="flex items-center justify-between px-4 py-4">
        <Wordmark />
      </div>

      {/* ask beacon */}
      <div className="px-3 pb-2">
        <button className="flex w-full items-center gap-2 rounded-lg border border-[var(--icr-border)] bg-[var(--icr-card)] px-3 py-2 text-[13px] font-medium text-[var(--icr-muted)] transition-colors hover:border-[var(--icr-border-strong)] hover:text-[var(--icr-ink)]">
          <Icon name="sparkles" size={15} className="text-[var(--icr-accent)]" />
          Ask Financial Comms
          <span className="ml-auto font-mono text-[10px] text-[var(--icr-faint)]">⌘K</span>
        </button>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {BEACON_NAV.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="flex items-center gap-1.5 px-2 pb-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: section.color }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--icr-faint)]">
                {section.label}
              </span>
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.id === active;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={cx(
                        "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                        isActive
                          ? "bg-[var(--icr-accent-wash)] text-[var(--icr-accent)]"
                          : "text-[var(--icr-ink-2)] hover:bg-[var(--icr-surface-2)]",
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--icr-accent)]" />
                      )}
                      <Icon name={item.icon} size={16} className={isActive ? "text-[var(--icr-accent)]" : "text-[var(--icr-faint)] group-hover:text-[var(--icr-muted)]"} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* account */}
      <div className="border-t border-[var(--icr-border)] p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--icr-ink)] text-[11px] font-semibold text-white">
            {BEACON_ACCOUNT.initials}
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12px] font-semibold text-[var(--icr-ink)]">{BEACON_ACCOUNT.name}</div>
            <div className="truncate text-[11px] text-[var(--icr-muted)]">{BEACON_ACCOUNT.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
