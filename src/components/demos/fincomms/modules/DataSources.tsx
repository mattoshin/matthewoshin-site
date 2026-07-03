"use client";

import { useState } from "react";
import { DATA_SOURCES, type DataSource } from "@/data/fincomms-demo";
import {
  Card,
  SectionHeading,
  Badge,
  Button,
  Chip,
  Icon,
  cx,
} from "../FcKit";

/**
 * DataSources - the catalog of APIs, MCPs, and feeds powering Financial Comms. A filterable
 * grid of source cards with a (disabled, showcase) AI search toolbar. No company
 * header: this is a platform-level configuration surface, not an analyst module.
 */

const CATEGORY_COLOR: Record<DataSource["category"], string> = {
  Financial: "var(--fc-accent)",
  Regulatory: "var(--fc-sec-overview)",
  Macro: "var(--fc-sec-earnings)",
  Market: "var(--fc-sec-intel)",
  Media: "var(--fc-pink)",
  Intelligence: "var(--fc-sec-strategy)",
  AI: "var(--fc-sec-strategy)",
};

const CATEGORIES = Array.from(new Set(DATA_SOURCES.map((s) => s.category)));

export default function DataSources() {
  const [filter, setFilter] = useState<string>("All");
  const sources =
    filter === "All" ? DATA_SOURCES : DATA_SOURCES.filter((s) => s.category === filter);

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Data sources"
        hint="Catalog of the APIs, MCPs, and feeds powering Financial Comms."
      />

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex min-w-[240px] flex-1 items-center">
          <span className="pointer-events-none absolute left-3 text-[var(--fc-faint)]">
            <Icon name="search" size={15} />
          </span>
          <input
            disabled
            placeholder="Search sources with AI..."
            className="w-full rounded-lg border border-[var(--fc-border)] bg-[var(--fc-card)] py-2 pl-9 pr-9 text-[13px] text-[var(--fc-muted)] placeholder:text-[var(--fc-faint)] focus:outline-none"
          />
          <span className="pointer-events-none absolute right-3 text-[var(--fc-accent)]">
            <Icon name="sparkles" size={14} />
          </span>
        </div>
        <Button variant="outline" icon="plus">Request a source</Button>
        <Button variant="ink">Add integration</Button>
      </div>

      {/* category filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={filter === "All"} onClick={() => setFilter("All")}>All</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => (
          <Card key={s.name} hover className="flex flex-col">
            <div className="flex items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                style={{ background: CATEGORY_COLOR[s.category] }}
              >
                {s.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-[var(--fc-ink)]">{s.name}</div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge tone="neutral">{s.category}</Badge>
                  <Badge tone="neutral">{s.kind}</Badge>
                </div>
              </div>
            </div>
            <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-[var(--fc-muted)]">{s.blurb}</p>
            <div className="mt-3 border-t border-[var(--fc-border)] pt-2.5">
              {s.status === "connected" ? (
                <Badge tone="up" dot>Connected</Badge>
              ) : (
                <Badge tone="neutral" dot>Available</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
