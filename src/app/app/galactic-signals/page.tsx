import type { Metadata } from "next";
import GalacticScope from "@/components/demos/galactic/GalacticScope";
import GalacticLanding from "@/components/demos/galactic/GalacticLanding";

export const metadata: Metadata = {
  title: "Galactic Signals demo",
  description:
    "Interactive recreation of Galactic Signals, the Discord-first cross-asset monitoring SaaS Matthew Oshin is building. Activate feeds, wire a webhook, receive branded alerts. Sample data, fully clickable.",
};

export default function GalacticDemoPage() {
  return (
    <GalacticScope>
      <GalacticLanding />
    </GalacticScope>
  );
}
