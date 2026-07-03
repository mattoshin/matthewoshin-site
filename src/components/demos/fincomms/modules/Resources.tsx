"use client";

import { useState } from "react";
import { RESOURCES, type Resource } from "@/data/fincomms-modules-demo";
import {
  SectionHeading,
  Button,
  Chip,
  Badge,
  Icon,
  DataTable,
  type IconName,
  type Column,
} from "../FcKit";

/**
 * Resources - the client-asset library. A searchable, category-filterable table of
 * decks, models, filings, and templates the advisor shares with clients.
 */
const CATEGORY_ICON: Record<Resource["category"], IconName> = {
  Deck: "barchart",
  Doc: "fileText",
  Sheet: "barchart",
  Filing: "fileText",
};

const CATEGORIES: ReadonlyArray<Resource["category"]> = ["Deck", "Doc", "Sheet", "Filing"];

const COLUMNS: ReadonlyArray<Column<Resource>> = [
  {
    key: "name",
    label: "Name",
    render: (r) => (
      <span className="flex items-center gap-2.5">
        <Icon name={CATEGORY_ICON[r.category]} size={16} className="shrink-0 text-[var(--fc-muted)]" />
        <span className="font-medium text-[var(--fc-ink)]">{r.name}</span>
      </span>
    ),
  },
  { key: "category", label: "Type", render: (r) => <Badge tone="neutral">{r.category}</Badge> },
  { key: "updated", label: "Updated" },
  { key: "size", label: "Size", align: "right", mono: true },
  {
    key: "tags",
    label: "Tags",
    render: (r) => (
      <span className="flex flex-wrap gap-1.5">
        {r.tags.map((t) => (
          <Badge key={t} tone="neutral">{t}</Badge>
        ))}
      </span>
    ),
  },
];

export default function Resources() {
  const [category, setCategory] = useState<Resource["category"] | "All">("All");

  const rows = category === "All" ? RESOURCES : RESOURCES.filter((r) => r.category === category);

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Resources"
        hint="Decks, models, filings, and templates for your clients."
        right={
          <Button variant="ink" size="sm" icon="plus">Upload</Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fc-faint)]">
            <Icon name="search" size={15} />
          </span>
          <input
            disabled
            placeholder="Search resources..."
            className="w-full rounded-lg border border-[var(--fc-border)] bg-[var(--fc-bg)] py-2 pl-9 pr-3 text-[13px] text-[var(--fc-muted)] placeholder:text-[var(--fc-faint)] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={category === "All"} onClick={() => setCategory("All")}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
          ))}
        </div>
      </div>

      <DataTable columns={COLUMNS} rows={rows} getKey={(r) => r.name} />
    </div>
  );
}
