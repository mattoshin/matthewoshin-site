import Link from "next/link";
import Section from "./Section";
import { WRITING } from "@/data/content";

/**
 * WritingSection / Abyss. Deferred for v1: a tasteful "log book coming from the
 * deep" placeholder with a link to /writing. No fabricated posts.
 */
export default function WritingSection() {
  return (
    <Section id="writing">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading glow-cyan sm:text-5xl">
        {WRITING.heading}
      </h2>
      <p className="measure mt-6 text-base text-ink-body sm:text-lg">
        {WRITING.blurb}
      </p>
      <Link
        href="/writing"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-bio-cyan/40 px-5 py-2.5 text-sm font-medium text-bio-cyan transition-colors hover:bg-bio-cyan/10"
      >
        {WRITING.cta}
        <span aria-hidden="true">-&gt;</span>
      </Link>
    </Section>
  );
}
