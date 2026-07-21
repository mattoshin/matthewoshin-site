import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Nav consolidation (8 -> 5 items): the old section routes live on as
    // permanent redirects so shared/indexed links never break.
    // /education/[slug] detail pages still exist; only the exact /education
    // index matches here.
    return [
      { source: "/portfolio", destination: "/projects", permanent: true },
      { source: "/entrepreneurship", destination: "/projects", permanent: true },
      { source: "/skills", destination: "/about#skills", permanent: true },
      { source: "/education", destination: "/about#education", permanent: true },
      { source: "/interests", destination: "/about#interests", permanent: true },
    ];
  },
};

export default nextConfig;
