import type { Metadata } from "next";
import AtriumScope from "@/components/demos/atrium/AtriumScope";
import AtriumConsole from "@/components/demos/atrium/AtriumConsole";

export const metadata: Metadata = {
  title: "Workplace AI workspace (concept demo)",
  description:
    "The Workplace AI console: a unified employee workspace with Home, an internal App Hub, Automations, an IT Hub, Legal, People & HR, and an AI assistant that acts across every tool. Fully clickable on sample data.",
};

export default function AtriumDashboardPage() {
  return (
    <AtriumScope>
      <AtriumConsole />
    </AtriumScope>
  );
}
