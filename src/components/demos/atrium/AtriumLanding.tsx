import Link from "next/link";
import {
  ATRIUM,
  ATRIUM_MODULES,
  ATRIUM_PAINS,
  ATRIUM_STEPS,
  ATRIUM_FACTS,
  ATRIUM_STACK,
} from "@/data/atrium-demo";
import { Wordmark, Icon, GradientText, GlassCard, Avatar, ATR_GRADIENT } from "./AtriumKit";

/**
 * AtriumLanding - the marketing surface for the Workplace AI concept, on the light
 * "Aurora" theme. Server component: the only interactions are anchor scroll and
 * links into the console demo. Copy and figures are illustrative sample data.
 */
const DASH = "/app/atrium/dashboard";

const navLinks = [
  { label: "Modules", href: "#modules" },
  { label: "How it works", href: "#how" },
  { label: "Stack", href: "#stack" },
];

export default function AtriumLanding() {
  return (
    <div className="relative">
      {/* nav */}
      <header className="sticky top-12 z-20 border-b border-[var(--atr-border)] bg-[var(--atr-bg)]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-7 text-[13px] text-[var(--atr-muted)] md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--atr-ink)]">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={DASH} className="hidden text-[13px] text-[var(--atr-muted)] transition-colors hover:text-[var(--atr-ink)] sm:block">
              Log in
            </Link>
            <Link
              href={DASH}
              className="rounded-full px-4 py-2 text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(91,74,255,0.5)] transition-all hover:brightness-[1.06]"
              style={{ backgroundImage: ATR_GRADIENT }}
            >
              Open Workplace AI
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--atr-accent)]/25 bg-[var(--atr-accent-wash)] px-3 py-1 text-[12px] font-medium text-[var(--atr-accent)]">
            <Icon name="sparkles" size={13} /> The employee workspace, reimagined
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--atr-ink)] sm:text-[56px]">
            Your whole workday.
            <br />
            <GradientText>One calm place.</GradientText>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--atr-ink-2)] sm:text-base">
            Corporate software is a junk drawer of disconnected portals. Workplace AI unifies
            your apps, IT, legal, and HR behind one workspace, then lets AI quietly
            automate the busywork. You handle what is left: only what actually needs you.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={DASH}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(91,74,255,0.55)] transition-all hover:brightness-[1.06]"
              style={{ backgroundImage: ATR_GRADIENT }}
            >
              Open the workspace <Icon name="arrowRight" size={16} />
            </Link>
            <a href="#modules" className="inline-flex items-center gap-2 rounded-full border border-[var(--atr-border-strong)] bg-[var(--atr-card)] px-6 py-3 text-[14px] font-medium text-[var(--atr-ink)] transition-colors hover:bg-[var(--atr-surface-2)]">
              Explore modules
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-4 gap-4">
            {ATRIUM_FACTS.map((f) => (
              <div key={f.label}>
                <div className="font-mono text-xl font-semibold tabular-nums text-[var(--atr-ink)] sm:text-2xl">{f.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--atr-faint)]">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <HeroPreview />
      </section>

      {/* pain points */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-[var(--atr-ink)] sm:text-3xl">
          Work has too many tabs, too many logins, and too much busywork.
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {ATRIUM_PAINS.map((p) => (
            <GlassCard key={p.title} className="p-6">
              <h3 className="text-[15px] font-semibold text-[var(--atr-ink)]">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--atr-muted)]">{p.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* modules */}
      <section id="modules" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--atr-accent)]">The workspace</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--atr-ink)] sm:text-3xl">
          Everything in one place. <GradientText>Nothing in your way.</GradientText>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ATRIUM_MODULES.map((m) => (
            <Link
              key={m.id}
              href={`${DASH}?module=${m.id}`}
              className="group rounded-[16px] border border-[var(--atr-glass-border)] bg-[var(--atr-glass)] p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(91,74,255,0.28)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: ATR_GRADIENT }}>
                <Icon name={m.icon} size={18} />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold text-[var(--atr-ink)]">{m.name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--atr-muted)]">{m.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--atr-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                Open <Icon name="arrowRight" size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--atr-ink)] sm:text-3xl">From a dozen portals to one workspace.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {ATRIUM_STEPS.map((s) => (
            <GlassCard key={s.n} className="p-6">
              <span className="font-mono text-[13px] font-semibold text-[var(--atr-accent)]">0{s.n}</span>
              <h3 className="mt-2.5 text-[15px] font-semibold text-[var(--atr-ink)]">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--atr-muted)]">{s.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* stack */}
      <section id="stack" className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--atr-muted)]">
            <Icon name="layers" size={14} /> Built with
          </div>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[var(--atr-muted)]">
            A modern, type-safe stack: a Next.js front end, an AI layer on Anthropic Claude with
            tool use and RAG over company policies, and SSO-based provisioning across every tool.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ATRIUM_STACK.map((g) => (
              <div key={g.group}>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--atr-ink)]">{g.group}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-[12.5px] leading-snug text-[var(--atr-muted)]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-[20px] p-10 text-center sm:p-14" style={{ backgroundImage: ATR_GRADIENT }}>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">See the workspace for yourself.</h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/80">
            Click into every module on sample data. Nothing here talks to a live server.
          </p>
          <Link
            href={DASH}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-[var(--atr-accent)] transition-transform hover:scale-[1.02]"
          >
            Open Workplace AI <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--atr-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <Wordmark size="sm" />
          <p className="text-[12px] text-[var(--atr-faint)]">Concept demo · sample data. {ATRIUM.product}.</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------ hero preview --- */

function HeroPreview() {
  return (
    <div className="justify-self-center">
      <GlassCard padded={false} className="w-full max-w-md overflow-hidden">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--atr-border)] bg-[var(--atr-recessed)]/70 px-3 py-2.5">
          <Wordmark size="sm" subtitle={false} />
          <span className="ml-auto flex items-center gap-1 rounded-full border border-[var(--atr-up)]/25 bg-[#ecfdf3] px-2 py-0.5 text-[10px] font-medium text-[var(--atr-up)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--atr-up)]" /> Synced
          </span>
        </div>
        <div className="space-y-3 p-4">
          {/* greeting */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--atr-faint)]">Monday, June 22</p>
            <p className="mt-0.5 text-[16px] font-bold text-[var(--atr-ink)]">Good morning, Maya.</p>
          </div>
          {/* handled-for-you */}
          <div className="relative overflow-hidden rounded-[12px] border border-[var(--atr-border)] bg-[var(--atr-card)] p-3">
            <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: ATR_GRADIENT }} />
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--atr-accent)]/25 bg-[var(--atr-accent-wash)] px-2 py-0.5 text-[10px] font-medium text-[var(--atr-accent)]">
                <Icon name="sparkles" size={10} /> Handled overnight
              </span>
              <span className="ml-auto font-mono text-[10px] text-[var(--atr-up)]">+80 min saved</span>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--atr-ink-2)]">
              Closed your VPN ticket, provisioned a Figma seat, and filed your Lisbon expenses.
            </p>
          </div>
          {/* pending */}
          <div className="flex items-center gap-3 rounded-[12px] border border-[var(--atr-border)] px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--atr-accent-wash)] text-[var(--atr-accent)]">
              <Icon name="fileText" size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold text-[var(--atr-ink)]">Sign the contractor offer letter</div>
              <div className="truncate text-[11px] text-[var(--atr-muted)]">Needs you</div>
            </div>
            <span className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold text-white" style={{ backgroundImage: ATR_GRADIENT }}>Sign</span>
          </div>
          {/* quick apps */}
          <div className="flex items-center gap-2">
            {[
              { i: "S", c: "#4A154B" },
              { i: "F", c: "#A259FF" },
              { i: "N", c: "#111111" },
              { i: "L", c: "#5E6AD2" },
            ].map((a, idx) => (
              <span key={idx} className="flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-semibold text-white" style={{ background: a.c }}>
                {a.i}
              </span>
            ))}
            <Avatar initials="MC" size={32} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
