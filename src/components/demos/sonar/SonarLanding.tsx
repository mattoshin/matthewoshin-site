import Link from "next/link";
import {
  SONAR,
  SONAR_PLATFORM,
  SONAR_PAIN_POINTS,
  SONAR_STEPS,
  SONAR_FEATURES,
  SONAR_ALERTS,
  SONAR_FACTS,
  SONAR_SOURCE_STRIP,
  SONAR_BUILDER_PRESETS,
  DELIVERY_CHANNELS,
} from "@/data/sonar-demo";
import { Wordmark, SonarSweep, GridField, Icon, SentimentChip, SeverityChip, type IconName } from "./SonarKit";

/**
 * SonarLanding - the marketing surface for the Sonar Media demo, in Sonar Media's own amber
 * "midnight command-center" brand (Inter on #0A0C10, signal-amber accent,
 * monospace metadata). Server component: the only interactions are anchor scroll
 * and the links into the console demo. Copy frames Sonar Media as a real-time media
 * intelligence product; all figures are illustrative sample data.
 */

const DASH = "/app/sonar/dashboard";

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Builder", href: "#builder" },
  { label: "Sources", href: "#sources" },
];

const heroPreview = SONAR_ALERTS.slice(0, 3);
const builderPreset = SONAR_BUILDER_PRESETS[0];

export default function SonarLanding() {
  return (
    <div className="relative overflow-hidden">
      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-8 text-sm text-[var(--s-muted)] md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href={DASH} className="hidden text-sm text-[var(--s-muted)] transition-colors hover:text-white sm:block">
            Log in
          </Link>
          <Link
            href={DASH}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#0A0C10] transition-transform hover:scale-[1.03]"
            style={{ background: "var(--s-amber)", boxShadow: "0 12px 36px rgba(255,178,36,0.22)" }}
          >
            Open the console
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
        <GridField />
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: "rgba(255,178,36,0.3)", background: "var(--s-amber-dim)", color: "var(--s-amber)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: "var(--s-amber)", animation: "s-ping 1.8s ease-out infinite" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--s-amber)" }} />
              </span>
              Now in early access
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
              Every signal that moves your company.{" "}
              <span style={{ color: "var(--s-amber)" }}>The moment it lands.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--s-text)] sm:text-lg">
              {SONAR.pitch} No boolean query builders, no saved-search archaeology. Describe it,
              dry-run it against the last 48 hours, and let it watch.
            </p>

            {/* delivery channel pills */}
            <div className="mt-7 flex flex-wrap gap-2">
              {DELIVERY_CHANNELS.map((c) => (
                <span key={c} className="rounded-full border px-3 py-1 text-xs text-[var(--s-muted)]" style={{ borderColor: "var(--s-border)" }}>
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={DASH}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-[#0A0C10] transition-transform hover:scale-[1.03]"
                style={{ background: "var(--s-amber)", boxShadow: "0 16px 44px rgba(255,178,36,0.24)" }}
              >
                Open the console <Icon name="chevron" size={16} />
              </Link>
              <a
                href="#builder"
                className="rounded-lg border px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--s-border)" }}
              >
                See it build a monitor
              </a>
            </div>

            {/* facts row */}
            <div className="mt-10 grid max-w-lg grid-cols-4 gap-4">
              {SONAR_FACTS.map((f) => (
                <div key={f.label}>
                  <div className="text-lg font-bold tracking-[-0.02em] text-white sm:text-2xl">{f.value}</div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--s-faint)]">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* hero visual: radar sweep with a captured-alert card floating in front */}
          <div className="relative mx-auto hidden w-full max-w-md items-center justify-center lg:flex">
            <SonarSweep size={400} />
            <div className="absolute bottom-2 right-0 w-72" style={{ animation: "s-pop .5s ease-out" }}>
              <div className="overflow-hidden rounded-xl border shadow-2xl" style={{ borderColor: "var(--s-border)", background: "var(--s-panel)" }}>
                <div className="flex items-center gap-2 border-b px-3.5 py-2.5" style={{ borderColor: "var(--s-border)", background: "var(--s-panel-2)" }}>
                  <Icon name="bell" size={13} className="text-[var(--s-amber)]" />
                  <span className="text-xs font-semibold text-white">Captured just now</span>
                  <span className="ml-auto"><SeverityChip severity="instant" /></span>
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-medium leading-snug text-white">{heroPreview[0].headline}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[var(--s-muted)]">{heroPreview[0].outlet}</span>
                    <span className="text-[var(--s-faint)]">·</span>
                    <SentimentChip sentiment={heroPreview[0].sentiment} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* source strip */}
      <section id="sources" className="relative z-10 mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--s-faint)]">
          Listening across {SONAR_PLATFORM.sourcesLive.toLocaleString()}+ sources
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {SONAR_SOURCE_STRIP.map((s) => (
            <span key={s} className="text-sm font-medium text-[var(--s-muted)]">{s}</span>
          ))}
        </div>
      </section>

      {/* social proof band */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4" style={{ borderColor: "var(--s-border)", background: "var(--s-border)" }}>
          {[
            { v: `${(SONAR_PLATFORM.mentionsScannedToday / 1000).toFixed(0)}K`, l: "Scanned today" },
            { v: SONAR_PLATFORM.alertsToday.toLocaleString(), l: "Alerts fired today" },
            { v: `${SONAR_PLATFORM.avgLatencySec}s`, l: "Median latency" },
            { v: `${SONAR_PLATFORM.precisionPct}%`, l: "Rated relevant" },
          ].map((s) => (
            <div key={s.l} className="px-6 py-7 text-center" style={{ background: "var(--s-panel-2)" }}>
              <div className="text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--s-faint)]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* pain points */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
          Monitoring is loud, slow, and built for analysts who like writing boolean queries.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SONAR_PAIN_POINTS.map((p) => (
            <div key={p.title} className="rounded-2xl border p-6" style={{ borderColor: "var(--s-border)", background: "var(--s-panel)" }}>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--s-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--s-amber)]">How it works</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Live in under a minute</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SONAR_STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border p-6" style={{ borderColor: "var(--s-border)", background: "var(--s-panel)" }}>
              <span className="font-mono text-sm font-bold" style={{ color: "var(--s-amber)" }}>0{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--s-muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* builder showcase: the signature plain-English flow */}
      <section id="builder" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--s-amber)]">The builder</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
              Talk to it. It writes the monitor.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--s-muted)]">
              Describe what you want in a sentence. Sonar Media resolves the entities, keywords, and
              sources into a validated spec, estimates the volume and cost, then replays the last
              48 hours so you see what it would have caught before you ever switch it on.
            </p>
            <ul className="mt-6 space-y-2.5">
              {["Plain English in, validated spec out", "Estimated items per day and cost per month", "A 48-hour dry run before a single alert fires"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-[var(--s-text)]">
                  <span style={{ color: "var(--s-amber)" }}><Icon name="check" size={16} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <Link href={DASH} className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--s-amber)] hover:underline">
              Try the builder <Icon name="chevron" size={15} />
            </Link>
          </div>

          {/* a static snapshot of the builder: prompt -> resolved spec */}
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--s-border)", background: "var(--s-panel)" }}>
            <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--s-border)", background: "var(--s-panel-2)" }}>
              <Icon name="sparkles" size={14} className="text-[var(--s-amber)]" />
              <span className="text-sm font-semibold text-white">New monitor</span>
            </div>
            <div className="space-y-3 p-4">
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-[#0A0C10]" style={{ background: "var(--s-amber)" }}>
                {builderPreset.prompt}
              </div>
              <div className="max-w-[92%] rounded-2xl rounded-bl-sm border px-3.5 py-2.5 text-sm leading-relaxed text-[var(--s-text)]" style={{ borderColor: "var(--s-border)", background: "var(--s-panel-2)" }}>
                {builderPreset.reply}
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--s-border)", background: "var(--s-panel-2)" }}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--s-faint)]">Resolved spec</p>
                <div className="mt-2 space-y-1.5 font-mono text-xs text-[var(--s-muted)]">
                  <div><span className="text-[var(--s-faint)]">entities</span> {builderPreset.spec.entities.join(", ")}</div>
                  <div><span className="text-[var(--s-faint)]">match</span> {builderPreset.spec.keywords.any.join(" / ")}</div>
                  <div><span className="text-[var(--s-faint)]">sources</span> {builderPreset.spec.sources.join(", ")}</div>
                  <div className="flex flex-wrap gap-x-4">
                    <span><span className="text-[var(--s-faint)]">~</span> {builderPreset.spec.estItemsPerDay}/day</span>
                    <span><span className="text-[var(--s-faint)]">~$</span>{builderPreset.spec.estCostPerMonth}/mo</span>
                    <span className="text-[var(--s-amber)]">{builderPreset.spec.severity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features grid */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SONAR_FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border p-5 transition-colors hover:border-[var(--s-amber)]/40" style={{ borderColor: "var(--s-border)", background: "var(--s-panel)" }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--s-amber-dim)", color: "var(--s-amber)" }}>
                <Icon name={f.icon as IconName} size={19} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--s-muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* alert showcase */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--s-amber)]">The feed</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Signal, with the context attached.</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--s-muted)]">
              Every match arrives tagged with the source, the matched terms, a sentiment read, and a
              one-line summary of why it matters, so the right person can act in seconds instead of
              reading the whole article first.
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: "var(--s-border)", background: "var(--s-panel)" }}>
            {heroPreview.map((a) => (
              <div key={a.id} className="rounded-xl border p-3.5" style={{ borderColor: "var(--s-border)", background: "var(--s-panel-2)" }}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium leading-snug text-white">{a.headline}</p>
                  {a.ticker && <span className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] text-[var(--s-muted)]" style={{ borderColor: "var(--s-border)" }}>{a.ticker}</span>}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--s-muted)]">{a.summary}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-[var(--s-faint)]">{a.outlet}</span>
                  <SentimentChip sentiment={a.sentiment} />
                  <SeverityChip severity={a.severity} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border p-10 text-center sm:p-14" style={{ borderColor: "rgba(255,178,36,0.3)", background: "linear-gradient(135deg, var(--s-panel), var(--s-panel-2) 60%), radial-gradient(420px 220px at 50% 0%, rgba(255,178,36,0.14), transparent)" }}>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Put the whole newsroom on watch.</h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--s-muted)]">
            Build your first monitor in plain English and dry-run it in under a minute.
          </p>
          <Link
            href={DASH}
            className="mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-[#0A0C10] transition-transform hover:scale-[1.03]"
            style={{ background: "var(--s-amber)", boxShadow: "0 16px 44px rgba(255,178,36,0.26)" }}
          >
            Open the console <Icon name="chevron" size={16} />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t" style={{ borderColor: "var(--s-border)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <Wordmark size="sm" />
          <p className="text-xs text-[var(--s-faint)]">
            Recreated demo · sample data. {SONAR.tagline}.
          </p>
        </div>
      </footer>
    </div>
  );
}
