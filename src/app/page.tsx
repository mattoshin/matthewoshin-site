import HeroSection from "@/components/sections/HeroSection";
import ZoneSetter from "@/components/page/ZoneSetter";

/**
 * Home - the SURFACE. Route-driven model: the home is the surface hero, and the
 * top nav dives to each section's own page at its own ocean depth. ZoneSetter
 * pins the persistent ocean at the surface here; navigating to a section sets a
 * deeper target so the camera DIVES down (the surface drifts up, that zone's sea
 * life comes into view). No long-scroll sections on the home anymore.
 */
export default function HomePage() {
  return (
    <>
      <ZoneSetter zone="surface" />
      <HeroSection />
    </>
  );
}
