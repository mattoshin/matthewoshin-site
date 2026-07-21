import HomeScrollDepth from "@/components/home/HomeScrollDepth";
import HeroSection from "@/components/sections/HeroSection";
import HomeSection from "@/components/home/HomeSection";
import { BUCKETS } from "@/data/content";

/**
 * Home - the DIVE. One long scroll from the surface to the seabed: the hero, then
 * a short ABBREVIATED beat per depth zone, each linking out to its own bigger
 * page (the sleek subpages). HomeScrollDepth maps scroll to the ocean's depth, so
 * the surface drifts up and each zone's sea life comes into view as you sink.
 * The full content for each section lives on its route (/experience, etc.).
 */

// Story narration per section, keyed by bucket id. Read top to bottom, the dive
// is Matthew's journey in miniature.
const BEATS: Record<string, string> = {
  experience:
    "Every desk I've sat at taught the same lesson a different way: find the edge, then go build it.",
  projects:
    "I've always been a hustler. Flipping baseball cards, washing dishes, then a sneaker empire. And the ocean? That's just my last name. Oshin.",
  about:
    "The toolkit, the foundation, and a life outside the work, though most of it circles back to it.",
  contact: "That's the dive. If any of it resonates, let's build something.",
};

export default function HomePage() {
  return (
    <>
      <HomeScrollDepth />
      <main>
        <HeroSection />

        {BUCKETS.map((bucket) => (
          <HomeSection
            key={bucket.id}
            zone={bucket.zone}
            navLabel={bucket.label}
            heading={bucket.label}
            beat={BEATS[bucket.id]}
            href={bucket.href}
            cta={`Open ${bucket.label}`}
          >
            <p className="text-ink-body">{bucket.teaser}</p>
          </HomeSection>
        ))}
      </main>
    </>
  );
}
