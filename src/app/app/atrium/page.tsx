import type { Metadata } from "next";
import AtriumScope from "@/components/demos/atrium/AtriumScope";
import AtriumLanding from "@/components/demos/atrium/AtriumLanding";

export const metadata: Metadata = {
  title: "Atrium - the AI employee workspace (concept demo)",
  description:
    "Atrium is a concept by Matthew Oshin: a redesign of the corporate employee workspace that puts every internal tool (app hub, IT, legal, HR) in one place and lets AI automate the busywork. A fully clickable demo on sample data.",
};

export default function AtriumPage() {
  return (
    <AtriumScope>
      <AtriumLanding />
    </AtriumScope>
  );
}
