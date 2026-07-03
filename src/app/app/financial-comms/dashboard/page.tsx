import type { Metadata } from "next";
import FcScope from "@/components/demos/fincomms/FcScope";
import FcConsole from "@/components/demos/fincomms/FcConsole";

export const metadata: Metadata = {
  title: "Financial Comms console demo",
  description:
    "The Financial Comms console: a 12-module AI workspace for investor relations, earnings hub, investor and peer intelligence, crisis command, governance, IPO readiness, and on-voice comms. Fully clickable on sample data.",
};

export default function FinancialCommsDashboardPage() {
  return (
    <FcScope>
      <FcConsole />
    </FcScope>
  );
}
