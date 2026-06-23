"use client";

import { ATRIUM_NAV, ATRIUM_USER, ATRIUM_COMPANY, type ModuleId } from "@/data/atrium-demo";
import { Wordmark, Icon, Avatar, cx, ATR_GRADIENT } from "./AtriumKit";

/**
 * AtriumSidebar - the grouped left navigation rail (Workspace / Tools / Support /
 * Assistant). The active item gets the single accent treatment: an accent-wash
 * fill, accent text, and a gradient left bar. The "Ask Workplace AI" button is the
 * always-present AI entry point and jumps to the assistant module.
 */
export default function AtriumSidebar({
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

      {/* ask atrium */}
      <div className="px-3 pb-2">
        <button
          onClick={() => onSelect("assistant")}
          className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(91,74,255,0.5)] transition-all hover:brightness-[1.06]"
          style={{ backgroundImage: ATR_GRADIENT }}
        >
          <Icon name="sparkles" size={15} />
          Ask Workplace AI
          <span className="ml-auto font-mono text-[10px] text-white/70">⌘K</span>
        </button>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {ATRIUM_NAV.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="flex items-center gap-1.5 px-2 pb-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: section.color }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--atr-faint)]">
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
                          ? "bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]"
                          : "text-[var(--atr-ink-2)] hover:bg-[var(--atr-surface-2)]",
                      )}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                          style={{ background: ATR_GRADIENT }}
                        />
                      )}
                      <Icon name={item.icon} size={16} className={isActive ? "text-[var(--atr-accent)]" : "text-[var(--atr-faint)] group-hover:text-[var(--atr-muted)]"} />
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
      <div className="border-t border-[var(--atr-border)] p-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials={ATRIUM_USER.initials} size={32} />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12px] font-semibold text-[var(--atr-ink)]">{ATRIUM_USER.name}</div>
            <div className="truncate text-[11px] text-[var(--atr-muted)]">
              {ATRIUM_USER.role} · {ATRIUM_COMPANY.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
