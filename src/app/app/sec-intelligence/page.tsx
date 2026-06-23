import type { Metadata } from "next";
import SecScope from "@/components/demos/sec/SecScope";
import SecLanding from "@/components/demos/sec/SecLanding";

export const metadata: Metadata = {
  title: "SEC Intelligence demo",
  description:
    "A real-time SEC-filing intelligence terminal for financial professionals: every material filing the moment it hits EDGAR, an AI analyst that reads it for you, and alerts routed to email, phone, and your downstream agents. Rebuilt on sample data.",
};

export default function SecIntelligencePage() {
  return (
    <SecScope>
      <SecLanding />
    </SecScope>
  );
}
