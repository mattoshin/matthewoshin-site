import type { Metadata } from "next";
import SonarScope from "@/components/demos/sonar/SonarScope";
import SonarDashboard from "@/components/demos/sonar/SonarDashboard";

export const metadata: Metadata = {
  title: "Sonar console demo",
  description:
    "The Sonar console: a live capture feed, an alert triage inbox, a monitor table, and a plain-English monitor builder with a 48-hour dry run. Plus analytics and source health. Fully clickable on sample data.",
};

export default function SonarDashboardPage() {
  return (
    <SonarScope>
      <SonarDashboard />
    </SonarScope>
  );
}
