import type { Metadata } from "next";
import VantageScope from "@/components/demos/vantage/VantageScope";
import VantageLanding from "@/components/demos/vantage/VantageLanding";

export const metadata: Metadata = {
  title: "Vantage - agentic security + IT operations command center demo",
  description:
    "A clickable concept demo of Vantage: a security and IT operations command center run by autonomous agents. Incident triage, threat intel, vulnerability management, identity, compliance, and an agent roster, all on sample data.",
};

export default function VantagePage() {
  return (
    <VantageScope>
      <VantageLanding />
    </VantageScope>
  );
}
