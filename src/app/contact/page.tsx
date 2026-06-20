import type { Metadata } from "next";
import PageShell from "@/components/page/PageShell";
import { CONTACT, SITE } from "@/data/content";

/**
 * /contact - the floor (zone id "contact"), the deepest page.
 *
 * The single warm bio-hot CTA is the Calendly button; email is the working
 * secondary. The Calendly URL is a placeholder (SITE.calendlyUrl ===
 * "CALENDLY_URL"); until Matthew fills it, the button renders disabled with a
 * clear note rather than linking to a broken URL.
 */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Email matthewoshin@gmail.com, LinkedIn linkedin.com/in/mattoshin, GitHub mattoshin, or book a time.",
};

export default function ContactPage() {
  // SITE.calendlyUrl is a literal placeholder via `as const`; widen to string so
  // this guard is meaningful once Matthew swaps in a real URL.
  const calendlyUrl: string = SITE.calendlyUrl;
  const calendlyReady =
    calendlyUrl !== "CALENDLY_URL" && calendlyUrl.startsWith("http");

  return (
    <PageShell zone="contact" heading={CONTACT.heading} intro={CONTACT.blurb}>
      <div className="mt-10 flex flex-col items-start justify-start gap-4 sm:flex-row sm:items-center">
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

      <div className="mt-10 flex flex-wrap items-center gap-5 font-mono text-xs uppercase tracking-wider text-ink-muted">
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-bio-cyan"
        >
          LinkedIn
        </a>
        <span aria-hidden="true" className="text-ink-faint">
          /
        </span>
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-bio-cyan"
        >
          GitHub
        </a>
        <span aria-hidden="true" className="text-ink-faint">
          /
        </span>
        <a href={`mailto:${SITE.email}`} className="hover:text-bio-cyan">
          {SITE.email}
        </a>
      </div>
    </PageShell>
  );
}
