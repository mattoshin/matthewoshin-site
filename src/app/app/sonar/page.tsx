import type { Metadata } from "next";
import SonarScope from "@/components/demos/sonar/SonarScope";
import SonarLanding from "@/components/demos/sonar/SonarLanding";

export const metadata: Metadata = {
  title: "Sonar demo",
  description:
    "Interactive recreation of Sonar, a real-time media-monitoring platform for investor-relations and communications teams. Describe a monitor in plain English, dry-run it against the last 48 hours, and get pinged the moment it matters. Sample data, fully clickable.",
};

export default function SonarDemoPage() {
  return (
    <SonarScope>
      <SonarLanding />
    </SonarScope>
  );
}
