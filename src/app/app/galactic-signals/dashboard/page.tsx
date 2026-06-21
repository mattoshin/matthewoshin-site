import type { Metadata } from "next";
import GalacticScope from "@/components/demos/galactic/GalacticScope";
import GalacticDashboard from "@/components/demos/galactic/GalacticDashboard";

export const metadata: Metadata = {
  title: "Galactic Signals dashboard demo",
  description:
    "The Galactic Signals dashboard: feed store, webhook delivery, monitors, branding, the monitor builder, and the agent-stream embed visualizer. Fully clickable on sample data.",
};

export default function GalacticDashboardPage() {
  return (
    <GalacticScope>
      <GalacticDashboard />
    </GalacticScope>
  );
}
