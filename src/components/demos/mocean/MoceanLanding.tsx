import Image from "next/image";
import Link from "next/link";
import {
  MOCEAN_STATS,
  MOCEAN_FEATURES,
  MOCEAN_REVIEWS,
} from "@/data/mocean-demo";

/**
 * MoceanLanding - a faithful recreation of Mocean's marketing landing page,
 * rebuilt in the site's stack with Mocean's own teal-on-navy brand. Copy is
 * taken from the original app (hero pitch, Info section, reviews). Server
 * component: the only interactions are anchor scroll + the link into the
 * dashboard demo.
 */

const TEAL = "#5ecdd1";
const navLinks = [
  { label: "Product", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Connect", href: "#connect" },
];

export default function MoceanLanding() {
  return (
    <div className="relative overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(600px 320px at 70% -5%, rgba(94,205,209,0.16), transparent 70%)",
        }}
      />

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Image
            src="/demos/mocean/logo.png"
            alt="Mocean"
            width={34}
            height={34}
            className="rounded"
          />
          <span className="text-lg font-semibold tracking-tight text-white">
            Mocean
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-[#c2c4d1] md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          href="/app/mocean-demo/dashboard"
          className="rounded-lg border border-[#2a545c] bg-[#0c222f] px-4 py-2 text-sm font-medium text-[#5ecdd1] transition-transform hover:scale-[1.03]"
        >
          Open dashboard
        </Link>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-2">
        <div>
          <div
            className="inline-block rounded-lg px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: TEAL, background: "rgba(94,205,209,0.08)" }}
          >
            Welcome to Mocean
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            Premier B2B
            <br />
            Information Services
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#c2c4d1]">
            Mocean provides the earliest alpha, the most thorough analysis, and
            the best release guides for your community. We curate it; you
            deliver it, branded as your own.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/app/mocean-demo/dashboard"
              className="rounded-lg px-5 py-3 text-sm font-semibold text-[#061427] transition-transform hover:scale-[1.03]"
              style={{ background: TEAL, boxShadow: "0 16px 40px rgba(94,205,209,0.25)" }}
            >
              Open the dashboard
            </Link>
            <a
              href="#about"
              className="rounded-lg border border-[#2a545c] px-5 py-3 text-sm font-medium text-[#5ecdd1] transition-colors hover:bg-[#0c222f]"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* browser-chrome card with the shark */}
        <div className="justify-self-center">
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border"
            style={{
              borderColor: "#2a545c",
              background: "#0a1b28",
              boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)",
            }}
          >
            <div className="flex items-center gap-2 border-b border-[#173040] bg-[#0c222f] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center justify-center px-8 py-12">
              <Image
                src="/demos/mocean/logo.png"
                alt="Mocean shark"
                width={240}
                height={240}
                className="drop-shadow-[0_10px_40px_rgba(94,205,209,0.25)]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#173040] bg-[#173040] sm:grid-cols-4">
          {MOCEAN_STATS.map((s) => (
            <div key={s.label} className="bg-[#0a1b28] px-6 py-7 text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[#8b97a8]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* info / features */}
      <section id="about" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          Unparalleled information curation and aggregation
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#c2c4d1]">
          The Mocean team is composed of 40+ full-time web3, crypto, and NFT
          analysts. They produce comprehensive release guides, investment
          analysis, news, macro trends, and educational content, so you never
          spend hours compiling sources. We surface only what matters, save your
          team time, and make your members more profit.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MOCEAN_FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[#173040] bg-[#0a1b28] p-6 transition-colors hover:border-[#2a545c]"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
                style={{ background: "rgba(94,205,209,0.1)", color: TEAL }}
              >
                {f.title.charAt(0)}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8b97a8]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* reviews */}
      <section id="reviews" className="relative z-10 mx-auto max-w-6xl px-5 pb-8 sm:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Reviews</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {MOCEAN_REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col rounded-2xl border border-[#173040] bg-[#0a1b28] p-6"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-[#c2c4d1]">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-[#061427]"
                  style={{ background: TEAL }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{r.name}</div>
                  <div className="text-xs text-[#8b97a8]">{r.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* connect CTA */}
      <section id="connect" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div
          className="overflow-hidden rounded-3xl border border-[#2a545c] p-10 sm:p-14"
          style={{
            background:
              "linear-gradient(135deg, #0c222f, #0a1b28 60%), radial-gradient(400px 200px at 80% 0%, rgba(94,205,209,0.18), transparent)",
          }}
        >
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                Plug Mocean into your server in 30 seconds.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#c2c4d1]">
                Pick the feeds your community needs, paste a Discord webhook, and
                branded alerts start flowing. No engineering required.
              </p>
              <Link
                href="/app/mocean-demo/dashboard"
                className="mt-8 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-[#061427] transition-transform hover:scale-[1.03]"
                style={{ background: TEAL }}
              >
                Explore the dashboard
              </Link>
            </div>
            <ol className="space-y-4">
              {[
                "Activate the data products you want.",
                "Paste a webhook URL for each Discord channel.",
                "Receive branded, real-time alerts automatically.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#061427]"
                    style={{ background: TEAL }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm text-[#c2c4d1]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-[#173040]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <div className="flex items-center gap-2.5">
            <Image src="/demos/mocean/logo.png" alt="Mocean" width={24} height={24} className="rounded" />
            <span className="text-sm font-semibold text-white">Mocean Technologies</span>
          </div>
          <p className="text-xs text-[#6c8696]">
            Recreated demo. Mocean was founded in 2021 and acquired in 2023.
          </p>
        </div>
      </footer>
    </div>
  );
}
