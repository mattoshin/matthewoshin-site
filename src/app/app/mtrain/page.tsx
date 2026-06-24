import type { Metadata } from "next";
import MtrainScope from "@/components/demos/mtrain/MtrainScope";
import MtrainLanding from "@/components/demos/mtrain/MtrainLanding";

export const metadata: Metadata = {
  title: "mTrain studio admin (demo)",
  description:
    "A clickable recreation of the back-office dashboard Matthew Oshin built for mTrain, a strength-and-wellness studio in Westport, CT: schedule, leads, and members over a Mindbody-style data layer. Sample data; nothing talks to a live server.",
};

export default function MtrainPage() {
  return (
    <MtrainScope>
      <MtrainLanding />
    </MtrainScope>
  );
}
