import Section from "./Section";
import { EDUCATION, EDUCATION_META } from "@/data/content";

/**
 * WritingSection / Abyss = EDUCATION (zone id stays "writing").
 *
 * The old "dispatches from the deep" placeholder is gone. This zone now holds
 * education: school + detail, simple and clean.
 */
export default function WritingSection() {
  return (
    <Section id="writing">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        {EDUCATION_META.heading}
      </h2>

      <ul className="mt-10 space-y-4">
        {EDUCATION.map((e) => (
          <li
            key={e.school}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
          >
            <h3 className="font-display text-xl font-semibold text-ink-heading sm:text-2xl">
              {e.school}
            </h3>
            {e.detail ? (
              <p className="mt-1 text-base text-ink-body">{e.detail}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
