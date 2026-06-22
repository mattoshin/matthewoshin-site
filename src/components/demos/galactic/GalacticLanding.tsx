import Link from "next/link";
import {
  GALACTIC,
  GALACTIC_PLATFORM,
  GALACTIC_CATEGORIES,
  GALACTIC_PAIN_POINTS,
  GALACTIC_STEPS,
  GALACTIC_PLANS,
  GALACTIC_ALERTS,
  GALACTIC_FACTS,
  DELIVERY_CHANNELS,
} from "@/data/galactic-demo";
import { ADMIN_STACK } from "@/data/galactic-admin-demo";
import { Wordmark, EmbedCard, Icon } from "./GalacticKit";
import { GalacticShips } from "./GalacticShips";

/**
 * GalacticLanding - a faithful recreation of the Galactic Signals marketing site,
 * rebuilt in this stack with Galactic's own dark cosmic brand (Space Grotesk on
 * #0B1120, teal + Discord-blurple accents). Server component: the only
 * interactions are anchor scroll and the link into the dashboard demo. Copy and
 * facts align to the public /projects/galactic-signals case study; usage figures
 * are illustrative sample data.
 */

const DASH = "/app/galactic-signals/dashboard";

const navLinks = [
  { label: "Feeds", href: "#feeds" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

export default function GalacticLanding() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated cosmic background ported from the real galacticsignals.com:
          drifting starships, planets, and lasers on a fixed full-viewport canvas
          (z-0), sitting behind all the z-10 content sections below. */}
      <GalacticShips />

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-8 text-sm text-[var(--g-muted)] md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href={DASH} className="hidden text-sm text-[var(--g-muted)] transition-colors hover:text-white sm:block">
            Log in
          </Link>
          <Link
            href={DASH}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#04140f] transition-transform hover:scale-[1.03]"
            style={{ background: "var(--g-teal)", boxShadow: "0 12px 36px rgba(29,209,161,0.28)" }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: "rgba(29,209,161,0.3)", background: "rgba(29,209,161,0.08)", color: "var(--g-teal)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: "var(--g-teal)", animation: "g-pulse-ring 1.6s ease-out infinite" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--g-teal)" }} />
            </span>
            Now in early access
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-[1.08] text-white sm:text-6xl">
            Financial Alpha for the{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(100deg, #1DD1A1, #22D3EE 55%, #5865F2)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Investors of Tomorrow
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--g-text)] sm:text-lg">
            Cross-asset market intelligence for retail investors, institutions, and AI
            agents, delivered wherever you already work. Activate the feeds you want,
            paste a webhook, and branded real-time alerts start flowing in about 30 seconds.
          </p>

          {/* delivery channel pills */}
          <div className="mt-7 flex flex-wrap gap-2">
            {DELIVERY_CHANNELS.map((c) => (
              <span key={c} className="rounded-full border px-3 py-1 text-xs text-[var(--g-muted)]" style={{ borderColor: "var(--g-border)" }}>
                {c}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={DASH}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-[#04140f] transition-transform hover:scale-[1.03]"
              style={{ background: "var(--g-teal)", boxShadow: "0 16px 44px rgba(29,209,161,0.28)" }}
            >
              Open the dashboard <Icon name="chevron" size={16} />
            </Link>
            <a
              href="#feeds"
              className="rounded-lg border px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--g-border)" }}
            >
              Browse feeds
            </a>
          </div>

          {/* facts row */}
          <div className="mt-10 grid max-w-lg grid-cols-4 gap-4">
            {GALACTIC_FACTS.map((f) => (
              <div key={f.label}>
                <div className="text-xl font-bold text-white sm:text-2xl">{f.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--g-faint)]">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* hero card: a faux Discord channel receiving live alerts */}
        <div className="justify-self-center" style={{ animation: "g-float 6s ease-in-out infinite" }}>
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border shadow-2xl" style={{ borderColor: "var(--g-border)", background: "#313338" }}>
            <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "#26282c", background: "#2b2d31" }}>
              <span className="text-[var(--g-muted)]">#</span>
              <span className="text-sm font-semibold text-white">alpha-signals</span>
              <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(29,209,161,0.15)", color: "var(--g-teal)" }}>
                LIVE
              </span>
            </div>
            <div className="space-y-3 p-3">
              {GALACTIC_ALERTS.slice(0, 3).map((a) => (
                <EmbedCard key={a.id} alert={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* social proof band */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4" style={{ borderColor: "var(--g-border)", background: "var(--g-border)" }}>
          {[
            { v: `${GALACTIC_PLATFORM.communities.toLocaleString()}+`, l: "Communities" },
            { v: `${GALACTIC_PLATFORM.traders.toLocaleString()}+`, l: "Active traders" },
            { v: `${(GALACTIC_PLATFORM.alertsLifetime / 1_000_000).toFixed(1)}M+`, l: "Alerts delivered" },
            { v: `${GALACTIC_PLATFORM.countriesReached}`, l: "Countries" },
          ].map((s) => (
            <div key={s.l} className="px-6 py-7 text-center" style={{ background: "var(--g-panel-2)" }}>
              <div className="text-2xl font-bold text-white sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--g-faint)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* pain points */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          Cross-asset alpha is fragmented, expensive, and always a step ahead of you.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {GALACTIC_PAIN_POINTS.map((p) => (
            <div key={p.title} className="rounded-2xl border p-6" style={{ borderColor: "var(--g-border)", background: "var(--g-panel)" }}>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* feeds / categories */}
      <section id="feeds" className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--g-teal)]">The store</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">79 feeds across 10 verticals</h2>
          </div>
          <Link href={DASH} className="hidden shrink-0 items-center gap-1 text-sm text-[var(--g-teal)] hover:underline sm:flex">
            Open the store <Icon name="chevron" size={15} />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALACTIC_CATEGORIES.map((c) => (
            <div key={c.id} className="rounded-2xl border p-5 transition-colors hover:border-[var(--g-teal)]/40" style={{ borderColor: "var(--g-border)", background: "var(--g-panel)" }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: "var(--g-panel-2)" }}>{c.emoji}</span>
                <h3 className="text-base font-semibold text-white">{c.name}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--g-muted)]">{c.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Live in about 30 seconds</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {GALACTIC_STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border p-6" style={{ borderColor: "var(--g-border)", background: "var(--g-panel)" }}>
              <span className="text-sm font-bold" style={{ color: "var(--g-teal)" }}>0{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* alert showcase */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--g-teal)]">Branded delivery</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Every alert looks like yours.</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--g-muted)]">
              Galactic renders branded embeds and fans them out behind a token-bucket
              rate limiter tuned to each platform&apos;s limits. Discord, Telegram, Slack,
              email, or any endpoint you point at it.
            </p>
            <ul className="mt-6 space-y-2.5">
              {["Your server name, logo, and accent color", "Market-hours gating + per-feed circuit breakers", "Sub-second fan-out across channels"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-[var(--g-text)]">
                  <span style={{ color: "var(--g-teal)" }}><Icon name="check" size={16} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: "var(--g-border)", background: "#313338" }}>
            {GALACTIC_ALERTS.slice(3, 7).map((a) => (
              <EmbedCard key={a.id} alert={a} />
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Start free. Scale when you do.</h2>
          <p className="mt-3 text-[var(--g-muted)]">Used by {GALACTIC_PLATFORM.communities.toLocaleString()}+ communities worldwide.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {GALACTIC_PLANS.map((p) => (
            <div
              key={p.name}
              className="relative flex flex-col rounded-2xl border p-6"
              style={{
                borderColor: p.popular ? "var(--g-teal)" : "var(--g-border)",
                background: "var(--g-panel)",
                boxShadow: p.popular ? "0 20px 60px -20px rgba(29,209,161,0.35)" : undefined,
              }}
            >
              {p.popular && (
                <span className="absolute -top-3 left-6 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#04140f]" style={{ background: "var(--g-teal)" }}>
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-[var(--g-muted)]">{p.blurb}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold text-white">${p.price}</span>
                <span className="pb-1 text-sm text-[var(--g-faint)]">/mo</span>
              </div>
              <p className="mt-1 text-xs text-[var(--g-faint)]">{p.subscribers.toLocaleString()} subscribers</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--g-text)]">
                    <span className="mt-0.5 shrink-0" style={{ color: "var(--g-teal)" }}><Icon name="check" size={15} /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={DASH}
                className="mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-transform hover:scale-[1.02]"
                style={p.popular ? { background: "var(--g-teal)", color: "#04140f" } : { border: "1px solid var(--g-border)", color: "var(--g-teal)" }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* MCP roadmap teaser */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <div
          className="overflow-hidden rounded-3xl border p-8 sm:p-12"
          style={{
            borderColor: "rgba(88,101,242,0.35)",
            background: "linear-gradient(135deg, var(--g-panel), var(--g-panel-2) 60%), radial-gradient(420px 220px at 85% 0%, rgba(88,101,242,0.2), transparent)",
          }}
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em]" style={{ color: "var(--g-cyan)" }}>
            <Icon name="bolt" size={14} /> On the roadmap
          </div>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            The AI-agent data layer underneath it all.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--g-text)]">
            An MCP server turns every Galactic feed into a structured stream any agent on
            Claude, ChatGPT, or a custom stack can natively consume. The monitoring tool is
            the consumer wedge; the &ldquo;Plaid for alternative data&rdquo; layer is the bet.
          </p>
        </div>
      </section>

      {/* final CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="rounded-3xl border p-10 text-center sm:p-14" style={{ borderColor: "var(--g-border)", background: "var(--g-panel)" }}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Get started. It&apos;s free.</h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--g-muted)]">
            Activate your first feeds and wire a webhook in under a minute.
          </p>
          <Link
            href={DASH}
            className="mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-[#04140f] transition-transform hover:scale-[1.03]"
            style={{ background: "var(--g-teal)", boxShadow: "0 16px 44px rgba(29,209,161,0.3)" }}
          >
            Open the dashboard <Icon name="chevron" size={16} />
          </Link>
        </div>
      </section>

      {/* built with / stack */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: "var(--g-border)", background: "var(--g-panel)" }}>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "var(--g-cyan)" }}>
            <Icon name="layers" size={14} /> Built with
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--g-muted)]">
            A polyglot, self-hosted stack: a type-safe TypeScript front end, a Node API layer, and an async
            Python worker fleet sharing one Postgres brain.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ADMIN_STACK.map((g) => (
              <div key={g.group}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">{g.group}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it} className="text-xs leading-snug text-[var(--g-muted)]">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t" style={{ borderColor: "var(--g-border)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <Wordmark size="sm" />
          <p className="text-xs text-[var(--g-faint)]">
            Recreated demo · sample data. {GALACTIC.tagline}.
          </p>
        </div>
      </footer>
    </div>
  );
}
