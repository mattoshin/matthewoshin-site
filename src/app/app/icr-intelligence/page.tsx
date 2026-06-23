import type { Metadata } from "next";
import BeaconScope from "@/components/demos/icr/BeaconScope";
import BeaconLanding from "@/components/demos/icr/BeaconLanding";

export const metadata: Metadata = {
  title: "Financial Communications Platform demo",
  description:
    "A faithful, clickable recreation of Financial Comms, the AI investor-relations intelligence platform Matthew Oshin built in-house: earnings prep, peer and investor intelligence, crisis command, and on-voice drafting. Rebuilt on sample data.",
};

export default function IcrIntelligencePage() {
  return (
    <BeaconScope>
      <BeaconLanding />
    </BeaconScope>
  );
}
