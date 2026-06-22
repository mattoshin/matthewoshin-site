import type { Metadata } from "next";
import GalacticScope from "@/components/demos/galactic/GalacticScope";
import GalacticConsole from "@/components/demos/galactic/GalacticConsole";

export const metadata: Metadata = {
  title: "Galactic Signals dashboard demo",
  description:
    "The Galactic Signals console: switch between the customer dashboard (feed store, webhook delivery, monitors, branding) and the full admin panel (system analytics, users, AI usage, and a live Claude-powered monitor builder). Fully clickable on sample data.",
};

export default function GalacticDashboardPage() {
  return (
    <GalacticScope>
      <GalacticConsole />
    </GalacticScope>
  );
}
