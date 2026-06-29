import type { Metadata } from "next";
import BeaconScope from "@/components/demos/fincomms/BeaconScope";
import BeaconConsole from "@/components/demos/fincomms/BeaconConsole";

export const metadata: Metadata = {
  title: "Financial Comms console demo",
  description:
    "The Financial Comms console: a 12-module AI workspace for investor relations, earnings hub, investor and peer intelligence, crisis command, governance, IPO readiness, and on-voice comms. Fully clickable on sample data.",
};

export default function IcrDashboardPage() {
  return (
    <BeaconScope>
      <BeaconConsole />
    </BeaconScope>
  );
}
