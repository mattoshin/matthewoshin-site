import type { Metadata } from "next";
import DemoBar from "@/components/demos/DemoBar";

/**
 * Layout for the /app demos section. The ocean chrome (DescentChrome + the site
 * footer) is gated off for /app/* in the root layout, so demos render full-bleed
 * as their own apps. This layout adds only the shared DemoBar on top.
 */
export const metadata: Metadata = {
  title: "App demos",
  description: "Interactive, clickable demos of products Matthew Oshin has built.",
};

export default function AppDemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#05080f]">
      <DemoBar />
      {children}
    </div>
  );
}
