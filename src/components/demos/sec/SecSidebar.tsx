"use client";

import { SEC_NAV, SEC_ACCOUNT, type ModuleId } from "@/data/sec-demo";
import { Wordmark, Icon, ROLE_LABEL, cx } from "./SecKit";
import { useSecRole } from "./console-context";

/**
 * SecSidebar - the grouped left navigation rail. Active item gets the single place
 * the azure accent appears in the nav: accent-wash fill + accent text + a 2px left
 * bar. The account footer reflects the live role (Wealth Manager / Trader).
 */
export default function SecSidebar({
  active,
  onSelect,
}: {
  active: ModuleId;
  onSelect: (id: ModuleId) => void;
}) {
  const role = useSecRole();
  return (
    <div className="flex h-full flex-col">
      {/* brand */}
      <div className="flex items-center justify-between px-4 py-4">
        <Wordmark />
      </div>

      {/* ask the analyst */}
      <div className="px-3 pb-2">
        <button
          onClick={() => onSelect("ai-analyst")}
          className="flex w-full items-center gap-2 rounded-lg border border-[var(--sec-border)] bg-[var(--sec-surface-2)] px-3 py-2 text-[13px] font-medium text-[var(--sec-muted)] transition-colors hover:border-[var(--sec-border-strong)] hover:text-[var(--sec-ink)]"
        >
          <Icon name="sparkles" size={15} className="text-[var(--sec-accent)]" />
          Ask the analyst
          <span className="ml-auto font-mono text-[10px] text-[var(--sec-faint)]">⌘K</span>
        </button>
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {SEC_NAV.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="flex items-center gap-1.5 px-2 pb-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: section.color }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--sec-faint)]">
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
                          ? "bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]"
                          : "text-[var(--sec-ink-2)] hover:bg-[var(--sec-surface-2)]",
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--sec-accent)]" />
                      )}
                      <Icon name={item.icon} size={16} className={isActive ? "text-[var(--sec-accent)]" : "text-[var(--sec-faint)] group-hover:text-[var(--sec-muted)]"} />
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
      <div className="border-t border-[var(--sec-border)] p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sec-accent)] text-[11px] font-semibold text-[#04121f]">
            {SEC_ACCOUNT.initials}
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12px] font-semibold text-[var(--sec-ink)]">{SEC_ACCOUNT.name}</div>
            <div className="truncate text-[11px] text-[var(--sec-muted)]">{ROLE_LABEL[role]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
