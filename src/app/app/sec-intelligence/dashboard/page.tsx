import type { Metadata } from "next";
import SecScope from "@/components/demos/sec/SecScope";
import SecConsole from "@/components/demos/sec/SecConsole";

export const metadata: Metadata = {
  title: "SEC Intelligence console demo",
  description:
    "The SEC Intelligence console: a real-time filing feed with AI reads, insider and ownership surveillance, an AI analyst with a theme tracker, and a channel router that fans alerts to email, SMS, phone, and your agents. Flip between a wealth-manager and a trader view. Fully clickable on sample data.",
};

export default function SecDashboardPage() {
  return (
    <SecScope>
      <SecConsole />
    </SecScope>
  );
}
