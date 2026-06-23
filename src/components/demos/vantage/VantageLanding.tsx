import Link from "next/link";
import {
  VANTAGE,
  VANTAGE_PLATFORM,
  VANTAGE_MODULES,
  VANTAGE_PAIN_POINTS,
  VANTAGE_STEPS,
  VANTAGE_FACTS,
  VANTAGE_STACK,
} from "@/data/vantage-demo";
import { Wordmark, Icon, cx } from "./VantageKit";

/**
 * VantageLanding - the marketing surface for Vantage, an agentic security + IT
 * operations command center. Dark "midnight-terminal" brand (Inter on carbon,
 * spectral-violet primary, electric-lime highlight). Server component: the only
 * interactions are anchor scroll and links into the console demo. Copy and figures
 * are illustrative sample data.
 */
const DASH = "/app/vantage/dashboard";

const navLinks = [
  { label: "Modules", href: "#modules" },
  { label: "How it works", href: "#how" },
  { label: "Stack", href: "#stack" },
];

export default function VantageLanding() {
  return (
    <div className="relative">
      {/* ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[480px] overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.18]" style={{ background: "radial-gradient(closest-side, var(--vnt-primary), transparent)" }} />
      </div>

      {/* nav */}
      <header className="sticky top-12 z-20 border-b border-[var(--vnt-border)] bg-[var(--vnt-bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-7 text-[13px] text-[var(--vnt-muted)] md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--vnt-ink)]">{l.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={DASH} className="hidden text-[13px] text-[var(--vnt-muted)] transition-colors hover:text-[var(--vnt-ink)] sm:block">Log in</Link>
            <Link href={DASH} className="rounded-full bg-[var(--vnt-primary)] px-4 py-2 text-[13px] font-medium text-[#0e0f11] transition-colors hover:bg-[var(--vnt-primary-700)]">
              Open console
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--vnt-primary)]/25 bg-[var(--vnt-primary-wash)] px-3 py-1 text-[12px] font-medium text-[var(--vnt-primary)]">
            <Icon name="sparkles" size={13} /> Agentic security + IT operations
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--vnt-ink)] sm:text-[56px]">
            Your security and IT command center, run by agents.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--vnt-ink-2)] sm:text-base">
            Vantage unifies SOC and IT operations into one console, then puts autonomous
            agents on the front line: they triage alerts, contain threats, patch
            vulnerabilities, and collect compliance evidence around the clock. You
            supervise the exceptions, not the noise.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={DASH} className="inline-flex items-center gap-2 rounded-full bg-[var(--vnt-primary)] px-6 py-3 text-[14px] font-medium text-[#0e0f11] transition-colors hover:bg-[var(--vnt-primary-700)]">
              Open the console <Icon name="chevron" size={16} />
            </Link>
            <a href="#modules" className="inline-flex items-center gap-2 rounded-full border border-[var(--vnt-border-strong)] bg-transparent px-6 py-3 text-[14px] font-medium text-[var(--vnt-ink)] transition-colors hover:bg-[var(--vnt-surface-2)]">
              Explore modules
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-4 gap-4">
            {VANTAGE_FACTS.map((f) => (
              <div key={f.label}>
                <div className="font-mono text-xl font-semibold tabular-nums text-[var(--vnt-highlight)] sm:text-2xl">{f.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--vnt-faint)]">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <HeroPreview />
      </section>

      {/* stats band */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-[var(--vnt-border)] sm:grid-cols-4">
          {[
            { v: VANTAGE_PLATFORM.endpoints.toLocaleString(), l: "Endpoints monitored" },
            { v: String(VANTAGE_PLATFORM.autonomousAgents), l: "Autonomous agents" },
            { v: VANTAGE_PLATFORM.meanTimeToRespond, l: "Mean time to respond" },
            { v: `${VANTAGE_PLATFORM.hoursSavedWeekly}h`, l: "Analyst hours / week" },
          ].map((s, i) => (
            <div key={s.l} className={cx("bg-[var(--vnt-card)] px-6 py-7 text-center", i < 3 && "sm:border-r", "border-[var(--vnt-border)]")}>
              <div className="font-mono text-2xl font-semibold tabular-nums text-[var(--vnt-ink)] sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--vnt-faint)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* pain points */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-[var(--vnt-ink)] sm:text-3xl">
          Security teams are buried in alerts, scattered tools, and slow response.
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {VANTAGE_PAIN_POINTS.map((p) => (
            <div key={p.title} className="rounded-[12px] border border-[var(--vnt-border)] bg-[var(--vnt-card)] p-6">
              <h3 className="text-[15px] font-semibold text-[var(--vnt-ink)]">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--vnt-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* modules */}
      <section id="modules" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--vnt-primary)]">The command center</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--vnt-ink)] sm:text-3xl">Twelve modules, one console.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VANTAGE_MODULES.map((m) => (
            <Link
              key={m.id}
              href={`${DASH}?module=${m.id}`}
              className="group rounded-[12px] border border-[var(--vnt-border)] bg-[var(--vnt-card)] p-5 transition-colors hover:border-[var(--vnt-border-strong)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--vnt-primary-wash)] text-[var(--vnt-primary)]">
                <Icon name={m.icon} size={18} />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold text-[var(--vnt-ink)]">{m.name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--vnt-muted)]">{m.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--vnt-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                Open <Icon name="chevron" size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--vnt-ink)] sm:text-3xl">From signal to contained in minutes, not hours.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {VANTAGE_STEPS.map((s) => (
            <div key={s.n} className="rounded-[12px] border border-[var(--vnt-border)] bg-[var(--vnt-card)] p-6">
              <span className="font-mono text-[13px] font-semibold text-[var(--vnt-highlight)]">0{s.n}</span>
              <h3 className="mt-2.5 text-[15px] font-semibold text-[var(--vnt-ink)]">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--vnt-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* stack */}
      <section id="stack" className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="rounded-[14px] border border-[var(--vnt-border)] bg-[var(--vnt-card)] p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--vnt-muted)]">
            <Icon name="layers" size={14} /> Built with
          </div>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[var(--vnt-muted)]">
            A modern, type-safe stack: a Next.js console, an agent layer on Anthropic Claude
            with tool use and autonomy guardrails, and a Postgres brain fed by a live event
            stream from your EDR, SIEM, cloud, and identity tools.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VANTAGE_STACK.map((g) => (
              <div key={g.group}>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--vnt-ink)]">{g.group}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-[12.5px] leading-snug text-[var(--vnt-muted)]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-[18px] border border-[var(--vnt-border)] bg-[var(--vnt-card)] p-10 text-center sm:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ background: "radial-gradient(closest-side at 50% 0%, var(--vnt-primary), transparent)" }} />
          <h2 className="relative text-2xl font-semibold tracking-tight text-[var(--vnt-ink)] sm:text-3xl">Walk the command center yourself.</h2>
          <p className="relative mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--vnt-muted)]">
            Click into every module on sample data. Nothing here talks to a live server.
          </p>
          <Link href={DASH} className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--vnt-highlight)] px-7 py-3.5 text-[14px] font-semibold text-[#0e0f11] transition-transform hover:scale-[1.02]">
            Open Vantage <Icon name="chevron" size={16} />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--vnt-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <Wordmark size="sm" />
          <p className="text-[12px] text-[var(--vnt-faint)]">Concept demo · sample data. {VANTAGE.product}.</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------ hero preview --- */

function HeroPreview() {
  return (
    <div className="relative justify-self-center">
      <div className="w-full max-w-md overflow-hidden rounded-[16px] border border-[var(--vnt-border)] bg-[var(--vnt-card)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] px-3 py-2.5">
          <Wordmark size="sm" />
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-[var(--vnt-warn)]/30 bg-[var(--vnt-warn)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--vnt-warn)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--vnt-warn)]" style={{ animation: "vnt-blink 1.6s ease-in-out infinite" }} /> Elevated
          </span>
        </div>
        <div className="space-y-3 p-4">
          {/* agent brief */}
          <div className="rounded-r-[12px] border border-l-2 border-[var(--vnt-border)] border-l-[var(--vnt-highlight)] bg-[var(--vnt-card)] p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--vnt-highlight)]/30 bg-[var(--vnt-highlight-wash)] px-2 py-0.5 text-[10px] font-medium text-[var(--vnt-highlight)]">
                <Icon name="sparkles" size={10} /> Agent
              </span>
              <span className="font-mono text-[10px] text-[var(--vnt-accent)]">Triage Agent</span>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--vnt-ink-2)]">
              Auto-triaged 47 alerts overnight, closed 41 with no human action. 2 incidents open.
            </p>
          </div>
          {/* stat tiles */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-[var(--vnt-faint)]">Posture</div>
              <div className="mt-1 font-mono text-[15px] font-semibold tabular-nums text-[var(--vnt-primary)]">86<span className="text-[var(--vnt-faint)]">/100</span></div>
            </div>
            <div className="rounded-lg border border-[var(--vnt-border)] bg-[var(--vnt-surface-2)] p-2.5">
              <div className="text-[10px] uppercase tracking-wide text-[var(--vnt-faint)]">MTTR</div>
              <div className="mt-1 font-mono text-[15px] font-semibold tabular-nums text-[var(--vnt-ink)]">11m</div>
            </div>
          </div>
          {/* incident row */}
          <div className="flex items-center gap-2 rounded-lg border border-[var(--vnt-border)] px-3 py-2">
            <span className="rounded-full border border-[var(--vnt-crit)]/35 bg-[var(--vnt-crit)]/12 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[var(--vnt-crit)]">Critical</span>
            <span className="min-w-0 flex-1 truncate text-[11.5px] text-[var(--vnt-ink-2)]">Unpatched RCE on 3 edge hosts</span>
            <span className="font-mono text-[10px] text-[var(--vnt-faint)]">18m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
