import Section from "./Section";
import { ABOUT } from "@/data/content";

/** AboutSection / Sunlit shallows. The narrative bio. */
export default function AboutSection() {
  return (
    <Section id="about">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink-heading sm:text-5xl">
        {ABOUT.heading}
      </h2>
      <div className="measure mt-8 space-y-5 text-base text-ink-body sm:text-lg">
        {ABOUT.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </Section>
  );
}
