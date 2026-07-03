import Link from "next/link";
import {
  SEC,
  SEC_PLATFORM,
  SEC_FACTS,
  SEC_FEATURES,
  SEC_PAIN_POINTS,
  SEC_STEPS,
  SEC_STACK,
} from "@/data/sec-demo";
import { Wordmark, Icon, FormBadge, cx } from "./SecKit";

/**
 * SecLanding - the marketing surface for the SEC Intelligence demo, rebuilt on the
 * dark "modern Bloomberg terminal" brand (Inter on near-black, white doing the
 * work, a single azure accent, gold reserved for "material"). Mirrors the fincomms
 * landing's section structure: sticky nav, two-column hero with a product preview,
 * a stats band, pain points, the feature grid, how-it-works, the stack card, a
 * final CTA, and a footer. Server component: the only interactions are anchor
 * scroll and links into the terminal demo. Copy and figures are sample data.
 */
const DASH = "/app/sec-intelligence/dashboard";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Stack", href: "#stack" },
];

export default function SecLanding() {
  return (
    <div className="relative">
      {/* nav */}
      <header className="sticky top-12 z-20 border-b border-[var(--sec-border)] bg-[var(--sec-bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-7 text-[13px] text-[var(--sec-muted)] md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--sec-ink)]">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={DASH} className="hidden text-[13px] text-[var(--sec-muted)] transition-colors hover:text-[var(--sec-ink)] sm:block">
              Log in
            </Link>
            <Link
              href={DASH}
              className="rounded-lg bg-[var(--sec-accent)] px-4 py-2 text-[13px] font-medium text-[#04121f] transition-colors hover:bg-[#5bb8ff]"
            >
              Open the terminal
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--sec-accent)]/25 bg-[var(--sec-accent-wash)] px-3 py-1 text-[12px] font-medium text-[var(--sec-accent)]">
            <Icon name="bolt" size={13} /> Real-time SEC filing intelligence
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--sec-ink)] sm:text-[56px]">
            Every material filing, read and routed before your client calls you.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--sec-ink-2)] sm:text-base">
            SEC Intelligence surfaces every 8-K, 10-Q, S-1, Form 4, and 13D the moment it
            hits EDGAR, filtered to your book and ranked by materiality. An AI analyst reads
            each one, and the signal lands wherever you need it, your phone, your team, your
            own downstream agents.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={DASH} className="inline-flex items-center gap-2 rounded-lg bg-[var(--sec-accent)] px-6 py-3 text-[14px] font-medium text-[#04121f] transition-colors hover:bg-[#5bb8ff]">
              Open the terminal <Icon name="chevron" size={16} />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 rounded-lg border border-[var(--sec-border-strong)] bg-[var(--sec-surface-2)] px-6 py-3 text-[14px] font-medium text-[var(--sec-ink)] transition-colors hover:bg-[var(--sec-elevated)]">
              See the feed
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-4 gap-4">
            {SEC_FACTS.map((f) => (
              <div key={f.label}>
                <div className="font-mono text-xl font-semibold tabular-nums text-[var(--sec-ink)] sm:text-2xl">{f.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--sec-faint)]">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* hero product preview */}
        <HeroPreview />
      </section>

      {/* stats band */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-[12px] border border-[var(--sec-border)] sm:grid-cols-4">
          {[
            { v: "8.4k", l: "Companies covered" },
            { v: SEC_PLATFORM.avgTimeToAlert, l: "Avg time to alert" },
            { v: `${SEC_PLATFORM.formsTracked}`, l: "Filing forms tracked" },
            { v: SEC_PLATFORM.uptime, l: "Uptime" },
          ].map((s, i) => (
            <div key={s.l} className={cx("bg-[var(--sec-card)] px-6 py-7 text-center", i < 3 && "sm:border-r", "border-[var(--sec-border)]")}>
              <div className="font-mono text-2xl font-semibold tabular-nums text-[var(--sec-ink)] sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--sec-faint)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* pain points */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-[var(--sec-ink)] sm:text-3xl">
          The filing that moves your book is already public before you read it.
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {SEC_PAIN_POINTS.map((p) => (
            <div key={p.title} className="rounded-[10px] border border-[var(--sec-border)] bg-[var(--sec-card)] p-6">
              <h3 className="text-[15px] font-semibold text-[var(--sec-ink)]">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--sec-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sec-accent)]">The terminal</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--sec-ink)] sm:text-3xl">
          Built for people who answer to clients.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEC_FEATURES.map((m, i) => (
            <Link
              key={i}
              href={`${DASH}?module=${m.id}`}
              className="group rounded-[10px] border border-[var(--sec-border)] bg-[var(--sec-card)] p-5 transition-colors hover:border-[var(--sec-border-strong)] hover:bg-[var(--sec-surface-2)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sec-accent-wash)] text-[var(--sec-accent)]">
                <Icon name={m.icon} size={18} />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold text-[var(--sec-ink)]">{m.name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sec-muted)]">{m.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--sec-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                Open <Icon name="chevron" size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--sec-ink)] sm:text-3xl">From EDGAR to your phone in seconds.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {SEC_STEPS.map((s) => (
            <div key={s.n} className="rounded-[10px] border border-[var(--sec-border)] bg-[var(--sec-card)] p-6">
              <span className="font-mono text-[13px] font-semibold text-[var(--sec-accent)]">0{s.n}</span>
              <h3 className="mt-2.5 text-[15px] font-semibold text-[var(--sec-ink)]">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--sec-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* stack */}
      <section id="stack" className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="rounded-[12px] border border-[var(--sec-border)] bg-[var(--sec-card)] p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sec-muted)]">
            <Icon name="layers" size={14} /> Built with
          </div>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[var(--sec-muted)]">
            A modern, type-safe terminal: a Next.js front end, an AI layer on Anthropic Claude
            with tool use and RAG over EDGAR full-text, a Postgres brain fed by real-time
            filing ingest, and delivery across email, voice, push, and agent webhooks.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SEC_STACK.map((g) => (
              <div key={g.group}>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--sec-ink)]">{g.group}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-[12.5px] leading-snug text-[var(--sec-muted)]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-[16px] border border-[var(--sec-accent)]/25 bg-[var(--sec-elevated)] p-10 text-center sm:p-14">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--sec-ink)] sm:text-3xl">Open the terminal.</h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--sec-ink-2)]">
            Click through every screen on sample data. Nothing here talks to a live server.
          </p>
          <Link
            href={DASH}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--sec-accent)] px-7 py-3.5 text-[14px] font-semibold text-[#04121f] transition-transform hover:scale-[1.02]"
          >
            Open the terminal <Icon name="chevron" size={16} />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--sec-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <Wordmark size="sm" />
          <p className="text-[12px] text-[var(--sec-faint)]">Recreated demo, sample data. {SEC.product}.</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------ hero preview --- */

type PreviewRow = { form: import("./SecKit").FormType; ticker: string; title: string; change: number };
const PREVIEW_ROWS: PreviewRow[] = [
  { form: "8-K", ticker: "ATLX", title: "Item 5.02, CFO transition", change: 2.91 },
  { form: "8-K", ticker: "CRVN", title: "Positive Phase III readout", change: 5.62 },
  { form: "10-Q", ticker: "PYLN", title: "Q2 results, NRR softens", change: -1.74 },
];

function HeroPreview() {
  return (
    <div className="justify-self-center">
      <div className="w-full max-w-md overflow-hidden rounded-[14px] border border-[var(--sec-border)] bg-[var(--sec-card)] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--sec-border)] bg-[var(--sec-recessed)] px-3 py-2.5">
          <Wordmark size="sm" />
          <span className="ml-auto flex items-center gap-1 rounded-full border border-[var(--sec-up)]/25 bg-[var(--sec-up-wash)] px-2 py-0.5 text-[10px] font-medium text-[var(--sec-up)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--sec-up)]" /> Live
          </span>
        </div>
        <div className="space-y-2.5 p-4">
          {/* filing rows */}
          {PREVIEW_ROWS.map((r) => {
            const up = r.change >= 0;
            return (
              <div key={r.ticker} className="flex items-center gap-3 rounded-lg border border-[var(--sec-border)] bg-[var(--sec-recessed)] px-3 py-2.5">
                <FormBadge form={r.form} />
                <span className="font-mono text-[13px] font-semibold text-[var(--sec-accent)]">{r.ticker}</span>
                <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--sec-ink-2)]">{r.title}</span>
                <span
                  className="shrink-0 font-mono text-[12px] font-medium tabular-nums"
                  style={{ color: up ? "var(--sec-up)" : "var(--sec-down)" }}
                >
                  {up ? "▲" : "▼"} {up ? "+" : ""}{r.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
          {/* AI read */}
          <div className="rounded-r-[10px] border border-l-2 border-[var(--sec-border)] border-l-[var(--sec-accent)] bg-[var(--sec-card)] p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--sec-accent)]/25 bg-[var(--sec-accent-wash)] px-2 py-0.5 text-[10px] font-medium text-[var(--sec-accent)]">
                <Icon name="sparkles" size={10} /> Why it matters
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--sec-ink-2)]">
              CFO exit 4 days before the 10-Q is a timing flag. Harborview holds 11% in ATLX, queue the call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
