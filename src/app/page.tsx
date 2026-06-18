import ZoneSetter from "@/components/page/ZoneSetter";
import HeroSection from "@/components/sections/HeroSection";

/**
 * Home / launchpad - the SURFACE (0m).
 *
 * The signature mechanic is multi-page: the ocean is one persistent WebGL canvas
 * in the root layout, and depth is route-driven. This page declares the surface
 * zone (ZoneSetter), so on landing here the camera rises to the open surface; the
 * six bucket cards in the hero each link to their own page, and clicking one
 * DIVES the camera down through the water to that page's depth.
 *
 * Server component (SEO + a11y). Only ZoneSetter is client.
 */
export default function HomePage() {
  return (
    <>
      <ZoneSetter zone="surface" />
      <HeroSection />
    </>
  );
}
