import Section from "./Section";
import { CONTACT, SITE } from "@/data/content";

/**
 * ContactSection / The Floor (Beacon). The single warm bio-hot CTA per viewport
 * is the Calendly button. Email is the working secondary.
 *
 * Calendly URL is a placeholder (SITE.calendlyUrl === "CALENDLY_URL"). Until
 * Matthew fills it, the button is rendered disabled with a clear note rather
 * than linking to a broken URL.
 */
export default function ContactSection() {
  // SITE.calendlyUrl is a literal placeholder via `as const`; widen to string so
  // this guard is meaningful once Matthew swaps in a real URL.
  const calendlyUrl: string = SITE.calendlyUrl;
  const calendlyReady =
    calendlyUrl !== "CALENDLY_URL" && calendlyUrl.startsWith("http");

  return (
    <Section id="contact" className="text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-4xl font-semibold leading-tight text-ink-heading glow-cyan sm:text-6xl">
          {CONTACT.heading}
        </h2>
        <p className="measure mx-auto mt-6 text-base text-ink-body sm:text-lg">
          {CONTACT.blurb}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* The single hot CTA. */}
          {calendlyReady ? (
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-hot rounded-full bg-bio-hot px-7 py-3.5 text-base font-semibold text-abyss-void transition-transform hover:scale-[1.02]"
            >
              {CONTACT.primaryLabel}
            </a>
          ) : (
            <span
              className="glow-hot inline-flex flex-col items-center rounded-full bg-bio-hot/90 px-7 py-3 text-base font-semibold text-abyss-void"
              aria-disabled="true"
              title="Calendly link pending"
            >
              {CONTACT.primaryLabel}
              <span className="font-mono text-[10px] font-normal uppercase tracking-wider opacity-70">
                Calendly link coming soon
              </span>
            </span>
          )}

          <a
            href={`mailto:${SITE.email}`}
            className="rounded-full border border-bio-cyan/40 px-7 py-3.5 text-base font-medium text-bio-cyan transition-colors hover:bg-bio-cyan/10"
          >
            {CONTACT.secondaryLabel}
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-5 font-mono text-xs uppercase tracking-wider text-ink-muted">
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-bio-cyan">
            LinkedIn
          </a>
          <span aria-hidden="true" className="text-ink-faint">
            /
          </span>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-bio-cyan">
            GitHub
          </a>
          <span aria-hidden="true" className="text-ink-faint">
            /
          </span>
          <a href={`mailto:${SITE.email}`} className="hover:text-bio-cyan">
            {SITE.email}
          </a>
        </div>
      </div>
    </Section>
  );
}
