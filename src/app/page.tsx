import DescentChrome from "@/components/chrome/DescentChrome";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import VenturesSection from "@/components/sections/VenturesSection";
import WritingSection from "@/components/sections/WritingSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";

/**
 * The descent. One tall scroll, seven depth zones, surface to seabed.
 *
 * Architecture:
 *  - This page is a Server Component. All seven sections are server-rendered DOM
 *    (SEO + a11y), readable top-to-bottom with zero spatial dependency.
 *  - DescentChrome (client) mounts the fixed background canvas BEHIND the DOM
 *    plus the scroll engine and overlay navigation.
 *  - The whole thing degrades to a static gradient ocean + flat content when
 *    reduced motion is requested or WebGL2 is unavailable.
 */
export default function HomePage() {
  return (
    <>
      {/* Skip link: first focusable element, jumps past the dive to content. */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only left-4 top-4 z-50 rounded-md bg-bio-cyan px-4 py-2 font-medium text-abyss-void"
      >
        Skip the dive, read content
      </a>

      <DescentChrome />

      {/* Content sits on top of the fixed background (z auto > -z-10). */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <VenturesSection />
        <WritingSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  );
}
