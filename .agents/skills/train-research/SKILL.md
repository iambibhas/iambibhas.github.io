---
name: train-research
description: Verify Indian train names, numbers, routes, and Vistadome coach presence against etrain.info before editing this site's train-map data.
---

# Research train details for the map

Use this skill when adding or correcting services in `static/train-to-take/`, especially when checking whether a train actually carries a Vistadome coach.

## Source and lookup workflow

1. Prefer etrain.info as the verification source. DuckDuckGo Lite may be used to discover relevant etrain.info pages when requested, but it can show a bot challenge. Do not try to solve a challenge; use etrain.info's own lookup directly instead.
2. The etrain.info site may be branded Tripozo while still serving train data. Fetch `https://etrain.info/` and inspect its current `js_v` value before calling its autocomplete endpoint; don't assume the version stays fixed.
3. Search train names or route terms with the site's train autocomplete endpoint:
   `https://etrain.info/ajax.php?q=trnsuggst&v=<current-js_v>&term=<URL-encoded-query>`
   URL-encode spaces and punctuation. Search using both train names and station/route terms; autocomplete results may be limited, so try narrower terms.
4. Open the candidate's schedule page using the returned train number and name-derived slug, for example:
   `https://etrain.info/train/Ypr-Majn-Exp-16539/schedule`
   Follow any canonical URL shown by the page. Confirm the displayed train number, name, direction, and origin/destination. Check the reverse-direction service separately: return trains do not always use a consecutive number.
5. On schedule pages, inspect the rake/coach listing as well as the schedule. Coach labels such as `EV1` or `EV2` are evidence of Vistadome coaches. Do not infer Vistadome status from a scenic route, a heritage-train label, or the existing map entry alone. If etrain.info provides no rake or coach evidence, record the result as unverified rather than claiming it is a confirmed Vistadome.
6. Keep direct source URLs and distinguish clearly between confirmed, contradicted, and unavailable evidence. If a service is contradicted or its listed number does not resolve, correct or remove it only after checking the route-matching candidate; if it remains ambiguous, surface that uncertainty instead of guessing.

## Editing this repository

- Vistadome entries are in `static/train-to-take/trains-vistadome.js`; station names and approximate coordinates are in `static/train-to-take/stations.js`.
- Preserve the existing `TRAINS.push(...)` data shape and station-code conventions. Keep both direction numbers when they represent a paired service.
- Verify that the train's endpoint station code matches etrain.info. `MAQ` (Mangaluru Central) and `MAJN` (Mangaluru Junction) are different stations. If a needed station code is absent, add it to `stations.js` with a checked, approximate coordinate rather than reusing a nearby but distinct station.
- Before editing, inspect the working-tree diff and preserve unrelated or pre-existing user changes.
- After edits, run `node tools/train-to-take/smoke-test.mjs`, check diagnostics for changed files, and run `git diff --check`.
- In the final response, summarize the records changed, link the relevant etrain.info pages, and state any lookup limitations. Do not say a service was verified if its page or coach data could not be checked.
