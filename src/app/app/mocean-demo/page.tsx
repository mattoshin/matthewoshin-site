import type { Metadata } from "next";
import MoceanScope from "@/components/demos/mocean/MoceanScope";
import MoceanLanding from "@/components/demos/mocean/MoceanLanding";

export const metadata: Metadata = {
  title: "Mocean demo",
  description:
    "Interactive recreation of Mocean, the Discord-native B2B research SaaS Matthew Oshin founded and sold. Sample data, fully clickable.",
};

export default function MoceanDemoPage() {
  return (
    <MoceanScope>
      <MoceanLanding />
    </MoceanScope>
  );
}
