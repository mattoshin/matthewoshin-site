import Image from "../opengraph-image";

/**
 * The share card used to live at public/og.png. Cached HTML from earlier
 * deploys, old messages, and anything that hard-linked the image still ask
 * for that path, so it serves the current card instead of a 404. Same
 * renderer, prerendered once at build.
 */
export const dynamic = "force-static";

export async function GET() {
  return Image();
}
