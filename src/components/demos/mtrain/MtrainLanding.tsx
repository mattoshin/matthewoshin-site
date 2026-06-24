import Link from "next/link";
import {
  MTRAIN,
  MTRAIN_MODULES,
  MTRAIN_PAINS,
  MTRAIN_STEPS,
  MTRAIN_FACTS,
  MTRAIN_STACK,
} from "@/data/mtrain-demo";
import { Wordmark, Icon, Card, CapacityBar, MT_SERIF, cx } from "./MtrainKit";

/**
 * MtrainLanding - the intro surface for the mTrain studio-admin demo, on the warm
 * "Studio" theme. Server component: the only interactions are anchor scroll and
 * links into the dashboard. Copy and figures are illustrative sample data.
 */
const DASH = "/app/fitness-os/dashboard";

const navLinks = [
  { label: "The dashboard", href: "#modules" },
  { label: "How it works", href: "#how" },
  { label: "Built with", href: "#stack" },
];

export default function MtrainLanding() {
  return (
    <div className="relative">
      {/* nav */}
      <header className="sticky top-12 z-20 border-b border-[var(--mt-border)] bg-[var(--mt-bg)]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-7 text-[13px] text-[var(--mt-muted)] md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[var(--mt-ink)]">
                {l.label}
              </a>
            ))}
          </nav>
          <Link
            href={DASH}
            className="rounded-full bg-[var(--mt-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--mt-accent-700)]"
          >
            Open the dashboard
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mt-accent)]/20 bg-[var(--mt-accent-wash)] px-3 py-1 text-[12px] font-medium text-[var(--mt-accent)]">
            <Icon name="dumbbell" size={13} /> Gym &amp; studio operations
          </div>
          <h1 className={cx("mt-5 text-4xl font-semibold leading-[1.06] tracking-tight text-[var(--mt-ink)] sm:text-[54px]", MT_SERIF)}>
            One calm place to run
            <br />
            <span className="text-[var(--mt-accent)] italic">the whole studio.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--mt-ink-2)] sm:text-base">
            A growing studio runs on five tabs: a booking tool, a spreadsheet for leads, Instagram
            DMs, email, and a notebook at the front desk. Fitness OS pulls the back office into one
            dashboard, so the schedule, the lead pipeline, and every member live in one place.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={DASH}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--mt-accent)] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--mt-accent-700)]"
            >
              Open the dashboard <Icon name="arrowRight" size={16} />
            </Link>
            <a
              href="#modules"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--mt-border-strong)] bg-[var(--mt-card)] px-6 py-3 text-[14px] font-medium text-[var(--mt-ink)] transition-colors hover:bg-[var(--mt-surface-2)]"
            >
              See what's inside
            </a>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-4 gap-4">
            {MTRAIN_FACTS.map((f) => (
              <div key={f.label}>
                <div className={cx("text-xl font-semibold text-[var(--mt-ink)] sm:text-2xl", MT_SERIF)}>{f.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--mt-faint)]">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <HeroPreview />
      </section>

      {/* pain points */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className={cx("max-w-2xl text-2xl font-semibold tracking-tight text-[var(--mt-ink)] sm:text-3xl", MT_SERIF)}>
          A growing studio, run out of five disconnected tabs.
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {MTRAIN_PAINS.map((p) => (
            <Card key={p.title} className="p-6">
              <h3 className="text-[15px] font-semibold text-[var(--mt-ink)]">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--mt-muted)]">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* modules */}
      <section id="modules" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--mt-accent)]">The dashboard</p>
        <h2 className={cx("mt-3 text-2xl font-semibold tracking-tight text-[var(--mt-ink)] sm:text-3xl", MT_SERIF)}>
          Four screens, the whole back office.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MTRAIN_MODULES.map((m) => (
            <Link
              key={m.id}
              href={`${DASH}?module=${m.id}`}
              className="group rounded-[16px] border border-[var(--mt-border)] bg-[var(--mt-card)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-16px_rgba(31,61,52,0.26)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--mt-accent)] text-white">
                <Icon name={m.icon} size={18} />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold text-[var(--mt-ink)]">{m.name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--mt-muted)]">{m.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--mt-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                Open <Icon name="arrowRight" size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className={cx("text-2xl font-semibold tracking-tight text-[var(--mt-ink)] sm:text-3xl", MT_SERIF)}>
          From five tabs to one back office.
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {MTRAIN_STEPS.map((s) => (
            <Card key={s.n} className="p-6">
              <span className="font-mono text-[13px] font-semibold text-[var(--mt-accent)]">0{s.n}</span>
              <h3 className="mt-2.5 text-[15px] font-semibold text-[var(--mt-ink)]">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--mt-muted)]">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* stack */}
      <section id="stack" className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--mt-muted)]">
            <Icon name="settings" size={14} /> Built with
          </div>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-[var(--mt-muted)]">
            A modern, conversion-first build over the studio's real Mindbody data: a Next.js front
            end, Supabase auth, and lead capture wired to Resend so qualified inbound reaches the
            owner.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {MTRAIN_STACK.map((g) => (
              <div key={g.group}>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--mt-ink)]">{g.group}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-[12.5px] leading-snug text-[var(--mt-muted)]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-[20px] bg-[var(--mt-accent)] p-10 text-center sm:p-14">
          <h2 className={cx("text-2xl font-semibold tracking-tight text-white sm:text-3xl", MT_SERIF)}>
            Step behind the front desk.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/75">
            Click into every screen on sample data. Nothing here talks to a live server.
          </p>
          <Link
            href={DASH}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold text-[var(--mt-accent)] transition-transform hover:scale-[1.02]"
          >
            Open the dashboard <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[var(--mt-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <Wordmark subtitle={false} />
          <p className="text-[12px] text-[var(--mt-faint)]">Demo · sample data. {MTRAIN.product}.</p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------ hero preview --- */

function HeroPreview() {
  return (
    <div className="justify-self-center">
      <Card padded={false} className="w-full max-w-md overflow-hidden shadow-[0_24px_60px_-28px_rgba(31,61,52,0.32)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--mt-border)] bg-[var(--mt-recessed)] px-3 py-2.5">
          <Wordmark subtitle={false} />
          <span className="ml-auto flex items-center gap-1 rounded-full border border-[var(--mt-up)]/25 bg-[#ecf6ef] px-2 py-0.5 text-[10px] font-medium text-[var(--mt-up)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mt-up)]" /> Live
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--mt-faint)]">Monday, Jun 16</p>
            <p className={cx("mt-0.5 text-[16px] font-semibold text-[var(--mt-ink)]", MT_SERIF)}>Good morning, Jess.</p>
          </div>
          {/* mini KPIs */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Bookings", value: "284" },
              { label: "New leads", value: "23" },
            ].map((k) => (
              <div key={k.label} className="rounded-[12px] border border-[var(--mt-border)] bg-[var(--mt-card)] p-3">
                <div className="text-[10px] uppercase tracking-wide text-[var(--mt-faint)]">{k.label}</div>
                <div className={cx("mt-1 text-[20px] font-semibold leading-none text-[var(--mt-ink)]", MT_SERIF)}>{k.value}</div>
              </div>
            ))}
          </div>
          {/* a class row */}
          <div className="rounded-[12px] border border-[var(--mt-border)] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[var(--mt-ink)]">Power Strength</span>
              <span className="font-mono text-[11px] text-[var(--mt-muted)]">06:00</span>
            </div>
            <div className="mt-2">
              <CapacityBar booked={14} capacity={16} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
