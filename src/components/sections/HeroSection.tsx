import Image from "next/image";
import { HERO, SITE } from "@/data/content";

/**
 * HeroSection - the SURFACE (0m) quick overview over the cartoon scene.
 *
 * Legibility: the text column sits over the DARK teal water (below the horizon),
 * so the type is LIGHT + bold with a crisp dark shadow (not the old dark-on-bright
 * white halo, which turned to fog on the water). Bright cyan accents + a bright
 * primary CTA pop against the sunset and the water. Socials live right here.
 */

const STATEMENT = "I'm a builder. That's the one word that survives every chapter.";

// Tasteful, public proof points only (no private figures, per content-review.md).
const PROOF: readonly string[] = [
  "5 ventures, 2 acquired",
  "CAIO at BrachyClip",
  "SaaS developer",
  "Hedge fund equity research",
  "Community builder",
  "Hospitality operator",
];

// Crisp dark legibility shadow for light type over the variable surface.
const SHADOW =
  "[text-shadow:0_2px_10px_rgba(2,6,11,0.9),0_1px_3px_rgba(2,6,11,0.95)]";

export default function HeroSection() {
  const calendlyReady =
    SITE.calendlyUrl !== "CALENDLY_URL" && SITE.calendlyUrl.startsWith("http");

  return (
    <section
      id="surface"
      className="relative z-10 flex min-h-screen items-center justify-center px-5 py-20"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:gap-12">
        {/* Portrait - kept; soft frame so it sits in the scene. */}
        <div className="shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/45 shadow-[0_24px_60px_-18px_rgba(4,34,46,0.6)]">
          <Image
            src="/matthew.jpg"
            alt="Matthew Oshin"
            width={933}
            height={1400}
            priority
            className="h-72 w-auto sm:h-80 md:h-[26rem]"
          />
        </div>

        {/* Text - LIGHT + bold + dark shadow so it pops on the dark water. */}
        <div className="min-w-0 text-center md:text-left">
          <p
            className={`inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-bio-cyan ${SHADOW}`}
          >
            <span
              aria-hidden="true"
              className="glow-cyan h-1.5 w-1.5 rounded-full bg-bio-cyan"
            />
            {HERO.positioning}
          </p>

          <h1
            className={`mt-4 font-display text-5xl font-bold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl ${SHADOW}`}
          >
            {HERO.name}
          </h1>

          <p
            className={`mx-auto mt-4 max-w-md text-balance text-lg font-semibold leading-snug text-ink-heading sm:text-xl md:mx-0 ${SHADOW}`}
          >
            {STATEMENT}
          </p>

          {/* Proof chips - dark glass + light type so they read on the water. */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {PROOF.map((item) => (
              <li
                key={item}
                className="rounded-full border border-bio-cyan/40 bg-abyss-void/55 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-heading backdrop-blur-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs - bright primary pops on the water. */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {calendlyReady ? (
              <a
                href={SITE.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-bio-cyan px-6 py-3 text-sm font-bold text-abyss-void shadow-[0_8px_24px_-8px_rgba(65,224,230,0.6)] transition-transform hover:scale-[1.03]"
              >
                Book a time
              </a>
            ) : null}
            <a
              href="#projects"
              className="rounded-full border border-bio-cyan/50 bg-abyss-void/40 px-6 py-3 text-sm font-semibold text-ink-heading backdrop-blur-sm transition-colors hover:bg-bio-cyan/15"
            >
              See the work
            </a>
          </div>

          {/* Socials - right here in the hero. */}
          <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
            <SocialLink
              href={SITE.linkedin}
              label="LinkedIn"
              external
            >
              <LinkedInIcon />
            </SocialLink>
            <SocialLink href={SITE.github} label="GitHub" external>
              <GitHubIcon />
            </SocialLink>
            <SocialLink href={SITE.instagram} label="Instagram" external>
              <InstagramIcon />
            </SocialLink>
            <SocialLink href={SITE.x} label="X (Twitter)" external>
              <XIcon />
            </SocialLink>
            <SocialLink href={`mailto:${SITE.email}`} label="Email Matthew">
              <MailIcon />
            </SocialLink>
          </div>

          <p
            className={`mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ink-muted ${SHADOW}`}
          >
            {HERO.scrollHint}
            <span aria-hidden="true" className="ml-2">
              &darr;
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- socials -------------------------------- */

function SocialLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-abyss-void/55 text-ink-heading backdrop-blur-sm transition-colors hover:border-bio-cyan/60 hover:text-bio-cyan"
    >
      {children}
    </a>
  );
}

function LinkedInIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49.99.1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12 12 0 0 0 12 .3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
