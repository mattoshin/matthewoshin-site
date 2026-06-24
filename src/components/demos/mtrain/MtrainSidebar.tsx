"use client";

import { MTRAIN_NAV, MTRAIN_USER, MTRAIN, type ModuleId } from "@/data/mtrain-demo";
import { Wordmark, Icon, Avatar, cx } from "./MtrainKit";

/**
 * MtrainSidebar - the grouped left navigation rail (Studio / Growth). The active
 * item gets the single accent treatment: an evergreen wash fill, accent text, and
 * an accent left bar.
 */
export default function MtrainSidebar({
  active,
  onSelect,
}: {
  active: ModuleId;
  onSelect: (id: ModuleId) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-4">
        <Wordmark />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {MTRAIN_NAV.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="flex items-center gap-1.5 px-2 pb-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: section.color }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--mt-faint)]">
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
                          ? "bg-[var(--mt-accent-wash)] text-[var(--mt-accent)]"
                          : "text-[var(--mt-ink-2)] hover:bg-[var(--mt-surface-2)]",
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--mt-accent)]" />
                      )}
                      <Icon
                        name={item.icon}
                        size={16}
                        className={isActive ? "text-[var(--mt-accent)]" : "text-[var(--mt-faint)] group-hover:text-[var(--mt-muted)]"}
                      />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--mt-border)] p-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials={MTRAIN_USER.initials} size={32} />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12px] font-semibold text-[var(--mt-ink)]">{MTRAIN_USER.name}</div>
            <div className="truncate text-[11px] text-[var(--mt-muted)]">
              {MTRAIN_USER.role} · {MTRAIN.location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
