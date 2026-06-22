import type { Metadata } from "next";
import BeaconScope from "@/components/demos/icr/BeaconScope";
import BeaconConsole from "@/components/demos/icr/BeaconConsole";

export const metadata: Metadata = {
  title: "Beacon console demo",
  description:
    "The Beacon console: a 12-module AI workspace for investor relations, earnings hub, investor and peer intelligence, crisis command, governance, IPO readiness, and on-voice comms. Fully clickable on sample data.",
};

export default function IcrDashboardPage() {
  return (
    <BeaconScope>
      <BeaconConsole />
    </BeaconScope>
  );
}
