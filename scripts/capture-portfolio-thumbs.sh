#!/bin/bash
# Capture portfolio card thumbnails from the live demos and sites.
#
# Output: public/portfolio/<slug>.webp, 1200x750 (16:10), quality 82.
# Source: production URLs, so the images never carry the dev indicator or a
# local build. Re-run after a demo or site changes; commit the results.
#
# Requires the gstack browse binary (Matthew's machine) and cwebp
# (`brew install webp`). Usage: scripts/capture-portfolio-thumbs.sh [slug ...]
#
# These files become public: look at every new capture before committing.
# The browser is the headless profile the browse binary launches, not a
# signed-in Chrome, and each capture is checked for a 200 and a final URL on
# the expected origin, so a redirect to a login or error page fails the run
# instead of shipping. After a replacement at the same path, Vercel's image
# optimizer can serve the old picture for up to its cache TTL (hours).
set -euo pipefail
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$HOME/.bun/bin:$PATH"
B="${BROWSE_BIN:-$HOME/.claude/skills/gstack/browse/dist/browse}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/portfolio"
# The browse binary only writes under /private/tmp or the repo. A fresh
# directory per run keeps concurrent runs apart and the raw PNGs are removed.
TMP="$(mktemp -d /private/tmp/portfolio-thumbs.XXXXXX)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

# slug|url. Internal demos are captured from production so the /app chrome is real.
SOURCES=(
  "mocean|https://matthewoshin.com/app/mocean-demo"
  "gtm-engineering|https://gotomarket.matthewoshin.com"
  "galactic-signals|https://matthewoshin.com/app/galactic-signals"
  "financial-comms|https://matthewoshin.com/app/financial-comms"
  "sec-intelligence|https://matthewoshin.com/app/sec-intelligence"
  "atrium|https://matthewoshin.com/app/atrium"
  "vantage|https://matthewoshin.com/app/vantage"
  "riptide|https://riptide.matthewoshin.com"
  "brachyclip|https://brachyclip.com"
  "mtrain|https://mtrainstudio.com"
  "dog-house|https://doghouseband.matthewoshin.com"
  "element-underground|https://elementunderground.com"
  "observly|https://observlymd.com"
)

wanted=("$@")
# Fail loudly: cwebp's -resize below does not preserve aspect ratio, so a
# capture at the wrong viewport would be silently squashed into 16:10.
"$B" viewport 1280x800 >/dev/null

for entry in "${SOURCES[@]}"; do
  slug="${entry%%|*}"; url="${entry##*|}"
  if [ ${#wanted[@]} -gt 0 ] && [[ ! " ${wanted[*]} " =~ " $slug " ]]; then continue; fi
  echo "== $slug  $url"
  nav=$("$B" goto "$url" 2>&1 | tail -1); echo "$nav"
  if [[ "$nav" != *"(200)"* ]]; then echo "   !! $slug did not load with 200" >&2; exit 1; fi
  # Let loaders, fonts and any entrance animation settle.
  sleep 4
  # The page we are about to capture must still be the page we asked for: a
  # redirect to a login, consent or error page on another origin is a failure.
  final=$("$B" js "location.origin + location.pathname" 2>&1 | tail -1 | tr -d '"')
  if [[ "$final" != "${url%/}"* ]]; then echo "   !! $slug ended at $final, expected $url" >&2; exit 1; fi
  # On this site's own /app demos, hide the demo strip so the capture is the
  # product, not the site chrome. Never run it on the external sites: a real
  # sticky header there would be deleted from the thumbnail without a trace.
  if [[ "$final" == https://matthewoshin.com/app/* ]]; then
    "$B" js "(() => { const bar = document.querySelector('div.sticky.top-0.z-50'); if (bar) bar.remove(); return 'ok'; })()" >/dev/null
  fi
  "$B" js "window.scrollTo(0, 0); 'ok'" >/dev/null
  sleep 1
  "$B" screenshot --viewport "$TMP/$slug.png" 2>&1 | tail -1
  # Guard the ratio before the non-preserving resize.
  dims=$(sips -g pixelWidth -g pixelHeight "$TMP/$slug.png" | awk '/pixel/ {printf "%s ", $2}')
  if [ "$dims" != "1280 800 " ]; then
    echo "   !! $slug captured at ${dims}not 1280 800, refusing to resize" >&2
    exit 1
  fi
  cwebp -quiet -q 82 -resize 1200 750 "$TMP/$slug.png" -o "$OUT/$slug.webp"
  printf "   -> %s (%s bytes)\n" "$OUT/$slug.webp" "$(stat -f %z "$OUT/$slug.webp")"
done

"$B" viewport 1280x720 >/dev/null 2>&1 || true  # best effort: restore the usual dev viewport
echo "done: $(ls "$OUT" | wc -l | tr -d ' ') thumbnails in public/portfolio"
