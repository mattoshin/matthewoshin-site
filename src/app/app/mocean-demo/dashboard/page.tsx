import type { Metadata } from "next";
import MoceanScope from "@/components/demos/mocean/MoceanScope";
import MoceanDashboard from "@/components/demos/mocean/MoceanDashboard";

export const metadata: Metadata = {
  title: "Mocean demo · Dashboard",
  description:
    "The Mocean customer dashboard, recreated and clickable: manage monitors, products, invoices, and account, all with sample data.",
};

export default function MoceanDashboardPage() {
  return (
    <MoceanScope>
      <MoceanDashboard />
    </MoceanScope>
  );
}
