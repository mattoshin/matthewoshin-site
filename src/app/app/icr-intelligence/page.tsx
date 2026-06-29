import type { Metadata } from "next";
import BeaconScope from "@/components/demos/icr/BeaconScope";
import BeaconLanding from "@/components/demos/icr/BeaconLanding";

export const metadata: Metadata = {
  title: "Financial Communications Platform demo",
  description:
    "A faithful, clickable recreation of Financial Comms, the AI financial-communications platform Matthew Oshin built in-house: corporate comms and PR, media monitoring, earnings prep, investor targeting, crisis command, and a full Capital Markets engine suite. Rebuilt on sample data.",
};

export default function IcrIntelligencePage() {
  return (
    <BeaconScope>
      <BeaconLanding />
    </BeaconScope>
  );
}
