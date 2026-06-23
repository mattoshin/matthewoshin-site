"use client";

import { useMemo, useState } from "react";
import {
  APPS,
  APP_CATEGORIES,
  ATRIUM_USER,
  ATRIUM_PLATFORM,
  type App,
  type AppCategory,
} from "@/data/atrium-demo";
import {
  GlassCard,
  StatCard,
  AppTile,
  Badge,
  Button,
  Icon,
  Chip,
  SectionHeading,
  EmptyState,
  AIBlock,
  cx,
} from "../AtriumKit";
import { useAtriumNav } from "../nav-context";

/**
 * AppHub - the internal app store / launcher. Every company app in one place
 * behind a single login: a stat strip on connections, a search + category filter,
 * a role-based recommendation row for Maya's Design team, and the full responsive
 * grid where installed apps open and available apps can be requested (tracked in
 * local state). Mirrors the Home module's Aurora craft and density.
 */

type Filter = "All" | AppCategory;
const FILTERS: readonly Filter[] = ["All", ...APP_CATEGORIES];

export default function AppHub() {
  const go = useAtriumNav();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [requested, setRequested] = useState<ReadonlySet<string>>(new Set());

  const installedCount = APPS.filter((a) => a.status === "installed").length;
  const availableCount = APPS.filter((a) => a.status === "available").length;
  const roleRecs = APPS.filter((a) => a.roleRec);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APPS.filter((a) => {
      const inCat = filter === "All" || a.category === filter;
      const inQuery =
        !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [query, filter]);

  const request = (name: string) =>
    setRequested((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });

  return (
    <div className="space-y-7">
      {/* intro */}
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--atr-faint)]">App Hub</p>
        <h2 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--atr-ink)]">
          Every company app, one login.
        </h2>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--atr-muted)]">
          Launch anything you already have with single sign-on, or request access to something new. Atrium
          auto-approves the apps your role is cleared for, so most requests clear without a signature.
        </p>
      </div>

      {/* stat strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Apps connected" value={String(installedCount)} icon="grid" accent hint="one login" />
        <StatCard label="Available to add" value={String(availableCount)} icon="plus" hint="in the catalog" />
        <StatCard label="Requests pending" value={String(requested.size)} icon="clock" hint="awaiting access" />
        <StatCard label="Org apps unified" value={String(ATRIUM_PLATFORM.appsConnected)} icon="layers" hint="across Northwind" />
      </div>

      {/* search + category filter */}
      <GlassCard className="space-y-4" padded>
        <div className="flex items-center gap-2.5 rounded-full border border-[var(--atr-border)] bg-[var(--atr-card)] px-4 py-2.5">
          <Icon name="search" size={16} className="shrink-0 text-[var(--atr-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps by name or what they do"
            className="w-full bg-transparent text-[13.5px] text-[var(--atr-ink)] placeholder:text-[var(--atr-faint)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="shrink-0 text-[var(--atr-faint)] transition-colors hover:text-[var(--atr-ink)]"
              aria-label="Clear search"
            >
              <Icon name="close" size={15} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
      </GlassCard>

      {/* recommended for your role */}
      {filter === "All" && !query && (
        <section>
          <SectionHeading
            title="Recommended for your role"
            hint={`Picked for the ${ATRIUM_USER.team} team · ${ATRIUM_USER.role}`}
            right={
              <Badge tone="accent">
                <Icon name="sparkles" size={11} /> Role match
              </Badge>
            }
          />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {roleRecs.map((a) => (
              <AppCard
                key={a.name}
                app={a}
                requested={requested.has(a.name)}
                onOpen={() => go("automations")}
                onRequest={() => request(a.name)}
              />
            ))}
          </div>
        </section>
      )}

      {/* main grid */}
      <section>
        <SectionHeading
          title={filter === "All" ? "All apps" : filter}
          hint="Installed apps open with SSO. Available apps request access by role."
          right={
            <span className="font-mono text-[12px] tabular-nums text-[var(--atr-faint)]">
              {filtered.length} {filtered.length === 1 ? "app" : "apps"}
            </span>
          }
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No apps match that"
            body="Try a different search or clear the category filter. If a tool you need is missing, request it from IT."
            cta={
              <Button
                variant="outline"
                size="sm"
                icon="refresh"
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
              >
                Reset filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <AppCard
                key={a.name}
                app={a}
                requested={requested.has(a.name)}
                onOpen={() => go("automations")}
                onRequest={() => request(a.name)}
              />
            ))}
          </div>
        )}
      </section>

      {/* AI access note */}
      <AIBlock
        tag="Atrium AI"
        title="Access, handled"
        footer="Request access from any tile · most resolve before you switch tabs"
      >
        When you request a role-standard app, I provision the SSO seat automatically under the {ATRIUM_USER.team} policy, no
        ticket and no waiting. For anything outside policy, I route it to the right approver and keep you posted. So far this
        month I have granted {ATRIUM_PLATFORM.appsConnected} seats across Northwind with zero manual steps.
      </AIBlock>
    </div>
  );
}

/* --------------------------------------------------------------- subviews --- */

/** A richer launcher tile than the bare AppTile: it carries status and a request
 *  affordance, and reflects a "Requested" state once an available app is added. */
function AppCard({
  app,
  requested,
  onOpen,
  onRequest,
}: {
  app: App;
  requested: boolean;
  onOpen: () => void;
  onRequest: () => void;
}) {
  // Installed apps deep-link to where they live; default to the plain AppTile.
  if (app.status === "installed") {
    return (
      <AppTile
        name={app.name}
        category={app.desc}
        initial={app.initial}
        color={app.color}
        status="installed"
        onClick={onOpen}
      />
    );
  }

  return (
    <button
      onClick={() => !requested && onRequest()}
      disabled={requested}
      className={cx("text-left", requested && "cursor-default")}
    >
      <GlassCard hover={!requested} className="flex h-full items-center gap-3 p-3.5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-semibold text-white"
          style={{ background: app.color }}
        >
          {app.initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[13px] font-semibold text-[var(--atr-ink)]">{app.name}</span>
            {app.popular && !requested && <Badge tone="info">Popular</Badge>}
          </span>
          <span className="block truncate text-[11px] text-[var(--atr-muted)]">{app.desc}</span>
        </span>
        {requested ? (
          <Badge tone="accent">
            <Icon name="check" size={11} /> Requested
          </Badge>
        ) : (
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--atr-accent)]">
            <Icon name="plus" size={14} /> Add
          </span>
        )}
      </GlassCard>
    </button>
  );
}
