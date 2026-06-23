"use client";

import { VANTAGE_NAV, VANTAGE_ACCOUNT, type ModuleId } from "@/data/vantage-demo";
import { Wordmark, Icon, cx } from "./VantageKit";

/**
 * VantageSidebar - the grouped left navigation rail. Sections mirror the command
 * center's domains (Operations / SecOps / IT Ops / Governance / Automation). The
 * active item gets the single place violet appears in the nav: a primary-wash
 * fill + primary text + a 2px left bar.
 */
export default function VantageSidebar({
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

      {/* command palette */}
      <div className="px-3 pb-2">
        <button className="flex w-full items-center gap-2 rounded-full border border-[var(--vnt-border)] bg-[var(--vnt-card)] px-3 py-2 text-[13px] font-medium text-[var(--vnt-muted)] transition-colors hover:border-[var(--vnt-border-strong)] hover:text-[var(--vnt-ink)]">
          <Icon name="sparkles" size={15} className="text-[var(--vnt-highlight)]" />
          Ask Vantage
          <span className="ml-auto font-mono text-[10px] text-[var(--vnt-faint)]">⌘K</span>
        </button>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {VANTAGE_NAV.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="flex items-center gap-1.5 px-2 pb-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: section.color }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--vnt-faint)]">
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
                          ? "bg-[var(--vnt-primary-wash)] text-[var(--vnt-primary)]"
                          : "text-[var(--vnt-ink-2)] hover:bg-[var(--vnt-surface-2)]",
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--vnt-primary)]" />
                      )}
                      <Icon name={item.icon} size={16} className={isActive ? "text-[var(--vnt-primary)]" : "text-[var(--vnt-faint)] group-hover:text-[var(--vnt-muted)]"} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* operator */}
      <div className="border-t border-[var(--vnt-border)] p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--vnt-primary)] text-[11px] font-semibold text-[#0e0f11]">
            {VANTAGE_ACCOUNT.initials}
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12px] font-semibold text-[var(--vnt-ink)]">{VANTAGE_ACCOUNT.name}</div>
            <div className="truncate text-[11px] text-[var(--vnt-muted)]">{VANTAGE_ACCOUNT.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
