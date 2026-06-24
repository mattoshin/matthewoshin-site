import type { Metadata } from "next";
import MtrainScope from "@/components/demos/mtrain/MtrainScope";
import MtrainConsole from "@/components/demos/mtrain/MtrainConsole";

export const metadata: Metadata = {
  title: "Fitness OS dashboard (demo)",
  description:
    "The Fitness OS console: an Overview of bookings, members, leads, and revenue; a class Schedule with live capacity; a Leads pipeline; and the Members roster. Fully clickable on sample data.",
};

export default function MtrainDashboardPage() {
  return (
    <MtrainScope>
      <MtrainConsole />
    </MtrainScope>
  );
}
