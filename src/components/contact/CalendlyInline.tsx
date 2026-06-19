"use client";

import { useEffect } from "react";

/**
 * CalendlyInline - an inline Calendly scheduler, themed to the ocean palette so
 * it reads as part of the site rather than an obvious third-party popup. People
 * pick a time without leaving the page.
 *
 * Full white-label (removing the Calendly wordmark entirely) needs Calendly's
 * paid tier or a custom build against their API; this is the blended inline
 * embed with the GDPR banner hidden and the colors matched to the deep zone.
 */
export default function CalendlyInline({ url }: { url: string }) {
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const themed =
    `${url}?hide_gdpr_banner=1` +
    "&background_color=0a2532&text_color=eaf6fb&primary_color=3fe0e6";

  return (
    <div
      className="calendly-inline-widget overflow-hidden rounded-2xl border border-bio-cyan/15"
      data-url={themed}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
