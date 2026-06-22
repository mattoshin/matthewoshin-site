import type { Metadata } from "next";
import BeaconScope from "@/components/demos/icr/BeaconScope";
import BeaconLanding from "@/components/demos/icr/BeaconLanding";

export const metadata: Metadata = {
  title: "ICR Intelligence Platform (Beacon) demo",
  description:
    "A faithful, clickable recreation of Beacon, the AI investor-relations intelligence platform Matthew Oshin built at ICR: earnings prep, peer and investor intelligence, crisis command, and on-voice drafting. Rebuilt on sample data.",
};

export default function IcrIntelligencePage() {
  return (
    <BeaconScope>
      <BeaconLanding />
    </BeaconScope>
  );
}
