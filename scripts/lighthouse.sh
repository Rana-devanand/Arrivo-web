#!/usr/bin/env bash
# Usage: scripts/lighthouse.sh [path] [mobile|desktop]  (requires `npm run start -- -p 3100` running)
page="${1:-}"; mode="${2:-mobile}"
out="$(mktemp -t lhXXXX).json"
extra=(); [ "$mode" = "desktop" ] && extra=(--preset=desktop)
npx --yes lighthouse@12 "http://localhost:3100/$page" "${extra[@]}" --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$out" --quiet >/dev/null 2>&1
node -e '
const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
const c = r.categories, a = r.audits, m = a.metrics.details.items[0];
console.log(process.argv[2], Object.values(c).map((x) => x.id + ":" + Math.round(x.score * 100)).join(" "),
  "FCP", a["first-contentful-paint"].displayValue, "LCP", a["largest-contentful-paint"].displayValue, "SI", a["speed-index"].displayValue, "TBT", a["total-blocking-time"].displayValue, "CLS", a["cumulative-layout-shift"].displayValue,
  "| observed FCP", m.observedFirstContentfulPaint);
' "$out" "/$page ($mode)"
