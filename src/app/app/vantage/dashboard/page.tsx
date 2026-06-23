import type { Metadata } from "next";
import VantageScope from "@/components/demos/vantage/VantageScope";
import VantageConsole from "@/components/demos/vantage/VantageConsole";

export const metadata: Metadata = {
  title: "SecOps Command console demo",
  description:
    "The SecOps Command console: a 12-module agentic command center for security and IT operations. Command overview, incidents, detections, threat intel, assets, vulnerabilities, network, identity, compliance, and an autonomous-agent roster. Fully clickable on sample data.",
};

export default function VantageDashboardPage() {
  return (
    <VantageScope>
      <VantageConsole />
    </VantageScope>
  );
}
