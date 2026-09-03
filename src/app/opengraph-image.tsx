import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/data/content";

/**
 * The share card: what iMessage, LinkedIn, and X show when someone pastes
 * matthewoshin.com. It replaces a static public/og.png that had a job title
 * painted into it. Same look (navy-to-teal water, cyan-ringed portrait, serif
 * name, tracked domain), but the copy comes from SITE.ogTagline so changing
 * the line is a one-string edit. Rendered once at build time by next/og.
 */
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonts are bundled TTFs (Google Fonts, OFL; licenses alongside them in
// assets/og) because the renderer needs raw font data and cannot use next/font.
// Fraunces for the name matches the card Matthew approved; Poppins is the site's
// body face. portrait.jpg is public/matthew.jpg pre-cropped to the circle so the
// render bundle stays well under next/og's 500KB ceiling.
async function readInputs() {
  const assets = join(process.cwd(), "assets/og");
  const [fraunces, poppins, portrait] = await Promise.all([
    readFile(join(assets, "fraunces-700.ttf")),
    readFile(join(assets, "poppins-500.ttf")),
    readFile(join(assets, "portrait.jpg")),
  ]);
  return { fraunces, poppins, portrait };
}

/**
 * Everything the pixels depend on, folded into the image URL. Next only
 * fingerprints this file's source, so without this a tagline edit in
 * content.ts would ship new pixels at the old URL, and crawlers that cache by
 * URL (LinkedIn, X, Slack) would keep serving the stale card for days.
 */
export async function cardVersion(): Promise<string> {
  const { fraunces, poppins, portrait } = await readInputs();
  return createHash("sha1")
    .update(SITE.name)
    .update("\n")
    .update(SITE.ogTagline)
    .update("\n")
    .update(fraunces)
    .update(poppins)
    .update(portrait)
    .digest("hex")
    .slice(0, 12);
}

export async function generateImageMetadata() {
  return [{ id: await cardVersion(), alt, size, contentType }];
}

const WATER = "linear-gradient(135deg, #0f4658 0%, #082633 48%, #071824 100%)";
const RING = "#38c6d9";
const NAME = "#eaf6fb";
const TAGLINE = "#b9d0da";

// The id prop only exists so Next can route /opengraph-image/<id>; the card
// itself has one version, so it is not read.
export default async function Image(_props?: { id?: Promise<string | number> }) {
  const { fraunces, poppins, portrait } = await readInputs();
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 96px",
          background: WATER,
          fontFamily: "Poppins",
          position: "relative",
        }}
      >
        {/* Portrait as a background image, not an <img>: the renderer does not
            clip a child to a rounded parent, but it does clip a background. */}
        <div
          style={{
            display: "flex",
            width: 300,
            height: 300,
            borderRadius: 150,
            border: `6px solid ${RING}`,
            flexShrink: 0,
            boxShadow: "0 0 0 12px rgba(56, 198, 217, 0.14)",
            backgroundImage: `url(${portraitSrc})`,
            backgroundSize: "300px 300px",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", marginLeft: 72 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Fraunces",
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1,
              color: NAME,
            }}
          >
            {SITE.name.split(" ").map((part) => (
              <div key={part}>{part}</div>
            ))}
          </div>
          <div
            style={{
              marginTop: 30,
              maxWidth: 620,
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.35,
              color: TAGLINE,
            }}
          >
            {SITE.ogTagline}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 96,
            bottom: 48,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 4,
            color: RING,
          }}
        >
          MATTHEWOSHIN.COM
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 700, style: "normal" },
        { name: "Poppins", data: poppins, weight: 500, style: "normal" },
      ],
    },
  );
}
