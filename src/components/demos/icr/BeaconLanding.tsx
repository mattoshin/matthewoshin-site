import Link from "next/link";
import {
  BEACON,
  BEACON_PLATFORM,
  BEACON_MODULES,
  BEACON_PAIN_POINTS,
  BEACON_STEPS,
  BEACON_FACTS,
  BEACON_STACK,
} from "@/data/icr-demo";
import { Wordmark, Icon, cx } from "./BeaconKit";

/**
 * BeaconLanding - a faithful recreation of the Financial Communications Platform's
 * marketing surface, rebuilt in this stack on Financial Comms's light, institutional brand
 * (Inter on #fafafa, ink near-black, ultramarine accent used sparingly). Server
 * component: the only interactions are anchor scroll and links into the console
 * demo. Copy and figures are illustrative sample data.
 */
const DASH = "/app/financial-comms/dashboard";

const navLinks = [
  { label: "Modules", href: "#modules" },
  { label: "How it works", href: "#how" },
  { label: "Stack", href: "#stack" },
];

export default function BeaconLanding() {
  return (
    <div className="relative">
      {/* nav */}
      <header className="sticky top-12 z-20 border-b border-[var(--icr-border)] bg-[var(--icr-bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-7 text-[13px] text-[var(--icr-muted)] md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--icr-ink)]">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={DASH} className="hidden text-[13px] text-[var(--icr-muted)] transition-colors hover:text-[var(--icr-ink)] sm:block">
              Log in
            </Link>
            <Link
              href={DASH}
              className="rounded-lg bg-[var(--icr-ink)] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-black"
            >
              Open Financial Comms
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--icr-accent)]/25 bg-[var(--icr-accent-wash)] px-3 py-1 text-[12px] font-medium text-[var(--icr-accent)]">
            <Icon name="sparkles" size={13} /> The AI intelligence layer for IR, PR, and capital markets
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--icr-ink)] sm:text-[56px]">
            Financial communications, with an AI analyst on every desk.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--icr-ink-2)] sm:text-base">
            Financial Comms turns the work of an IR, PR, and capital-markets team, media monitoring,
            earnings prep, investor targeting, crisis response, and on-voice drafting, into a single
            workspace grounded in live market and media data.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={DASH} className="inline-flex items-center gap-2 rounded-lg bg-[var(--icr-ink)] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-black">
              Open the console <Icon name="chevron" size={16} />
            </Link>
            <a href="#modules" className="inline-flex items-center gap-2 rounded-lg border border-[var(--icr-border-strong)] bg-[var(--icr-card)] px-6 py-3 text-[14px] font-medium text-[var(--icr-ink)] transition-colors hover:bg-[var(--icr-surface-2)]">
              Explore modules
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-4 gap-4">
            {BEACON_FACTS.map((f) => (
              <div key={f.label}>
                <div className="font-mono text-xl font-semibold tabular-nums text-[var(--icr-ink)] sm:text-2xl">{f.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--icr-faint)]">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* hero product preview */}
        <HeroPreview />
      </section>

      {/* stats band */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-[12px] border border-[var(--icr-border)] sm:grid-cols-4">
          {[
            { v: `${BEACON_PLATFORM.clients}`, l: "Client engagements" },
            { v: "2.8k", l: "Briefs generated" },
            { v: `${BEACON_PLATFORM.dataSources}`, l: "Data sources" },
            { v: `${BEACON_PLATFORM.hoursSavedWeekly}h`, l: "Saved per week" },
          ].map((s, i) => (
            <div key={s.l} className={cx("bg-[var(--icr-card)] px-6 py-7 text-center", i < 3 && "sm:border-r", "border-[var(--icr-border)]")}>
              <div className="font-mono text-2xl font-semibold tabular-nums text-[var(--icr-ink)] sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--icr-faint)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* pain points */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-[var(--icr-ink)] sm:text-3xl">
          Comms and IR teams are drowning in prep, scattered data, and tight deadlines.
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {BEACON_PAIN_POINTS.map((p) => (
            <div key={p.title} className="rounded-[10px] border border-[var(--icr-border)] bg-[var(--icr-card)] p-6">
              <h3 className="text-[15px] font-semibold text-[var(--icr-ink)]">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--icr-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* modules */}
      <section id="modules" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--icr-accent)]">The platform</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--icr-ink)] sm:text-3xl">Twenty-five modules, one workspace.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BEACON_MODULES.map((m) => (
            <Link
              key={m.id}
              href={`${DASH}?module=${m.id}`}
              className="group rounded-[10px] border border-[var(--icr-border)] bg-[var(--icr-card)] p-5 transition-colors hover:border-[var(--icr-border-strong)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--icr-accent-wash)] text-[var(--icr-accent)]">
                <Icon name={m.icon} size={18} />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold text-[var(--icr-ink)]">{m.name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--icr-muted)]">{m.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--icr-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                Open <Icon name="chevron" size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--icr-ink)] sm:text-3xl">From ticker to talking points in minutes.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {BEACON_STEPS.map((s) => (
            <div key={s.n} className="rounded-[10px] border border-[var(--icr-border)] bg-[var(--icr-card)] p-6">
              <span className="font-mono text-[13px] font-semibold text-[var(--icr-accent)]">0{s.n}</span>
              <h3 className="mt-2.5 text-[15px] font-semibold text-[var(--icr-ink)]">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--icr-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* stack */}
      <section id="stack" className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="rounded-[12px] border border-[var(--icr-border)] bg-[var(--icr-card)] p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--icr-muted)]">
            <Icon name="layers" size={14} /> Built with
          </div>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[var(--icr-muted)]">
            A modern, type-safe stack: a Next.js front end, an AI layer on Anthropic Claude with
            tool use and RAG over filings, and a Postgres brain fed by live market-data APIs.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BEACON_STACK.map((g) => (
              <div key={g.group}>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--icr-ink)]">{g.group}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-[12.5px] leading-snug text-[var(--icr-muted)]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-[16px] border border-[var(--icr-border)] bg-[var(--icr-ink)] p-10 text-center sm:p-14">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">See the console for yourself.</h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/70">
            Click into every module on sample data. Nothing here talks to a live server.
          </p>
          <Link
            href={DASH}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-[14px] font-semibold text-[var(--icr-ink)] transition-transform hover:scale-[1.02]"
          >
            Open Financial Comms <Icon name="chevron" size={16} />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--icr-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <Wordmark size="sm" />
          <p className="text-[12px] text-[var(--icr-faint)]">Recreated demo · sample data. {BEACON.product}.</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------ hero preview --- */

function HeroPreview() {
  return (
    <div className="justify-self-center">
      <div className="w-full max-w-md overflow-hidden rounded-[14px] border border-[var(--icr-border)] bg-[var(--icr-card)] shadow-[0_24px_48px_-12px_rgba(12,14,19,0.12)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--icr-border)] bg-[var(--icr-recessed)] px-3 py-2.5">
          <Wordmark size="sm" />
          <span className="ml-auto flex items-center gap-1 rounded-full border border-[var(--icr-up)]/25 bg-[#ecfdf3] px-2 py-0.5 text-[10px] font-medium text-[var(--icr-up)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--icr-up)]" /> Live
          </span>
        </div>
        <div className="space-y-3 p-4">
          {/* AI brief */}
          <div className="rounded-r-[10px] border border-l-2 border-[var(--icr-border)] border-l-[var(--icr-accent)] bg-[var(--icr-card)] p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--icr-accent)]/25 bg-[var(--icr-accent-wash)] px-2 py-0.5 text-[10px] font-medium text-[var(--icr-accent)]">
                <Icon name="sparkles" size={10} /> Morning brief
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--icr-ink-2)]">
              Three clients report this week, led by Quanta Labs Thursday. Software multiples up 6% on cooling inflation.
            </p>
          </div>
          {/* stat tiles */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[var(--icr-border)] bg-[var(--icr-recessed)] p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-[var(--icr-faint)]">Consensus</div>
              <div className="mt-1 font-mono text-[15px] font-semibold tabular-nums text-[var(--icr-ink)]">$158 PT</div>
            </div>
            <div className="rounded-lg border border-[var(--icr-border)] bg-[var(--icr-recessed)] p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-[var(--icr-faint)]">NRR</div>
              <div className="mt-1 font-mono text-[15px] font-semibold tabular-nums text-[var(--icr-ink)]">119%</div>
            </div>
          </div>
          {/* ticker row */}
          <div className="flex items-center justify-between rounded-lg border border-[var(--icr-border)] px-3 py-2">
            <span className="font-mono text-[13px] font-semibold text-[var(--icr-accent)]">QNTA</span>
            <span className="font-mono text-[13px] tabular-nums text-[var(--icr-ink)]">$142.50</span>
            <span className="font-mono text-[12px] font-medium tabular-nums text-[var(--icr-up)]">▲ +1.82%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
