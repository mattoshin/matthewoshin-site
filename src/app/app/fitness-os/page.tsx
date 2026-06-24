import type { Metadata } from "next";
import MtrainScope from "@/components/demos/mtrain/MtrainScope";
import MtrainLanding from "@/components/demos/mtrain/MtrainLanding";

export const metadata: Metadata = {
  title: "Fitness OS - gym & studio operation software (demo)",
  description:
    "A clickable demo of Fitness OS, gym and studio operation software by Matthew Oshin: the class schedule, lead pipeline, and member roster in one back office over a Mindbody-style data layer. Drawn from a real studio engagement; sample data, nothing talks to a live server.",
};

export default function MtrainPage() {
  return (
    <MtrainScope>
      <MtrainLanding />
    </MtrainScope>
  );
}
