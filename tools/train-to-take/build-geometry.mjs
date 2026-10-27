// Builds static/train-to-take/geometry.js: real rail track geometry for every
// consecutive stop pair used by TRAINS, snapped from OpenStreetMap data.
//
// Usage:  node tools/train-to-take/build-geometry.mjs
// Raw Overpass tiles are cached in tools/train-to-take/.cache so reruns are fast.
// Delete that folder to refresh from OSM.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../../static/train-to-take");
const cacheDir = path.join(here, ".cache");
fs.mkdirSync(cacheDir, { recursive: true });

const ENDPOINTS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass-api.de/api/interpreter"
];
const REQUEST_TIMEOUT_MS = 120000;
const TILE = 1;              // degrees
const SNAP_RADII_KM = [0.75, 1.5, 3, 6, 12]; // station -> track snap radii, tightest first
const SNAP_PENALTY = 4;      // off-track distance counts extra so we prefer the nearest track
const SIMPLIFY_DEG = 0.0004; // ~40 m Douglas-Peucker tolerance
const MAX_DETOUR = 3;        // path longer than this x straight distance => keep straight line

// ---------- load data files ----------
const src = ["stations.js", "trains-vande-bharat.js", "trains-vistadome.js"]
  .map(f => fs.readFileSync(path.join(dataDir, f), "utf8")).join("\n");
const { STATIONS, TRAINS } = vm.runInNewContext(src + "\n;({ STATIONS, TRAINS })");

const pairs = new Map(); // "A|B" (sorted) -> [A, B]
TRAINS.forEach(t => {
  for (let i = 0; i < t.stops.length - 1; i++) {
    const [a, b] = [t.stops[i], t.stops[i + 1]].sort();
    pairs.set(a + "|" + b, [a, b]);
  }
});
console.log(`${pairs.size} unique segments`);

// ---------- helpers ----------
const R = 6371;
const rad = Math.PI / 180;
function km(lat1, lon1, lat2, lon2) {
  const x = (lon2 - lon1) * rad * Math.cos(((lat1 + lat2) / 2) * rad), y = (lat2 - lat1) * rad;
  return Math.sqrt(x * x + y * y) * R;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------- decide which tiles are needed ----------
const tiles = new Set();
const tileKey = (la, lo) => `${Math.floor(la / TILE)}_${Math.floor(lo / TILE)}`;
for (const [a, b] of pairs.values()) {
  const [, la1, lo1] = STATIONS[a], [, la2, lo2] = STATIONS[b];
  const steps = Math.max(2, Math.ceil(km(la1, lo1, la2, lo2) / 25));
  for (let i = 0; i <= steps; i++) {
    const la = la1 + (la2 - la1) * i / steps, lo = lo1 + (lo2 - lo1) * i / steps;
    for (const dla of [-0.5, 0, 0.5]) for (const dlo of [-0.5, 0, 0.5]) tiles.add(tileKey(la + dla, lo + dlo));
  }
}
console.log(`${tiles.size} tiles to load`);

// ---------- fetch tiles (cached) ----------
async function loadTile(key) {
  const file = path.join(cacheDir, key + ".json");
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  const [r, c] = key.split("_").map(Number);
  const bbox = `${r * TILE},${c * TILE},${(r + 1) * TILE},${(c + 1) * TILE}`;
  const q = `[out:json][timeout:180];
way["railway"~"^(rail|narrow_gauge)$"][!"service"][usage!~"^(industrial|military)$"](${bbox});
out geom qt;`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = ENDPOINTS[attempt % ENDPOINTS.length];
    try {
      const res = await fetch(url, {
        method: "POST",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "train-to-take-geometry-builder" },
        body: "data=" + encodeURIComponent(q)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      const slim = json.elements.filter(e => e.type === "way" && e.nodes && e.geometry)
        .map(e => ({ id: e.id, nodes: e.nodes, geometry: e.geometry.map(p => p && [p.lat, p.lon]) }));
      fs.writeFileSync(file, JSON.stringify(slim));
      await sleep(1500); // be polite to the public API
      return slim;
    } catch (err) {
      console.warn(`\n  tile ${key} attempt ${attempt + 1} failed on ${url}: ${err.message}`);
      await sleep(2000 * (attempt + 1));
    }
  }
  throw new Error("Could not fetch tile " + key);
}

// ---------- build graph ----------
const idx = new Map();   // osm node id -> index
const lat = [], lon = [], adj = [];
const seenWays = new Set();
function nodeIndex(id, p) {
  let i = idx.get(id);
  if (i === undefined) { i = lat.length; idx.set(id, i); lat.push(p[0]); lon.push(p[1]); adj.push([]); }
  return i;
}
let n = 0;
for (const key of tiles) {
  process.stdout.write(`\rtile ${++n}/${tiles.size} (${key})      `);
  const ways = await loadTile(key);
  for (const w of ways) {
    if (seenWays.has(w.id)) continue;
    seenWays.add(w.id);
    let prev = -1;
    for (let k = 0; k < w.nodes.length; k++) {
      const p = w.geometry[k];
      if (!p) { prev = -1; continue; }
      const cur = nodeIndex(w.nodes[k], p);
      if (prev >= 0 && prev !== cur) {
        const d = km(lat[prev], lon[prev], lat[cur], lon[cur]);
        adj[prev].push(cur, d); adj[cur].push(prev, d);
      }
      prev = cur;
    }
  }
}
console.log(`\ngraph: ${lat.length} nodes, ${seenWays.size} ways`);

// ---------- binary heap ----------
class Heap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(d, v) {
    const a = this.a; let i = a.push([d, v]) - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last; let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

// ---------- station snapping ----------
const snapCache = {};
function nearNodes(code, radius) {
  const ck = code + "@" + radius;
  if (snapCache[ck]) return snapCache[ck];
  const [, la, lo] = STATIONS[code];
  const out = new Map();
  const deg = radius / 100;
  for (let i = 0; i < lat.length; i++) {
    if (Math.abs(lat[i] - la) > deg || Math.abs(lon[i] - lo) > deg) continue;
    const d = km(la, lo, lat[i], lon[i]);
    if (d <= radius) out.set(i, d * SNAP_PENALTY);
  }
  return (snapCache[ck] = out);
}

// Try the tightest snap radius first so the line follows the track actually at the
// station; widen only if that gives no path (or an absurd detour).
function route(a, b, maxKm) {
  for (const radius of SNAP_RADII_KM) {
    const r = routeWith(nearNodes(a, radius), nearNodes(b, radius));
    if (r && r.km <= maxKm) return r;
  }
  return null;
}

function routeWith(from, to) {
  if (!from.size || !to.size) return null;
  const dist = new Map(), prev = new Map(), heap = new Heap();
  for (const [i, d] of from) { dist.set(i, d); heap.push(d, i); }
  let best = Infinity, bestNode = -1;
  while (heap.size) {
    const [d, u] = heap.pop();
    if (d >= best) break;
    if (d > dist.get(u)) continue;
    if (to.has(u) && d + to.get(u) < best) { best = d + to.get(u); bestNode = u; }
    const e = adj[u];
    for (let k = 0; k < e.length; k += 2) {
      const v = e[k], nd = d + e[k + 1];
      if (nd < (dist.get(v) ?? Infinity)) { dist.set(v, nd); prev.set(v, u); heap.push(nd, v); }
    }
  }
  if (bestNode < 0) return null;
  const pts = [];
  for (let u = bestNode; u !== undefined; u = prev.get(u)) pts.push([lat[u], lon[u]]);
  return { pts: pts.reverse(), km: best };
}

// ---------- Douglas-Peucker ----------
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = 0, mi = -1;
    const [y1, x1] = pts[s], [y2, x2] = pts[e];
    const dx = x2 - x1, dy = y2 - y1, len2 = dx * dx + dy * dy;
    for (let i = s + 1; i < e; i++) {
      const [y, x] = pts[i];
      let t = len2 ? ((x - x1) * dx + (y - y1) * dy) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
      if (d > maxD) { maxD = d; mi = i; }
    }
    if (maxD > tol) { keep[mi] = 1; stack.push([s, mi], [mi, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}

// ---------- route every segment ----------
const result = {};
const fallback = [];
for (const [key, [a, b]] of pairs) {
  const straight = km(STATIONS[a][1], STATIONS[a][2], STATIONS[b][1], STATIONS[b][2]);
  const r = route(a, b, straight * MAX_DETOUR + 5);
  if (!r) { fallback.push(`${key} (no path within ${(straight * MAX_DETOUR + 5).toFixed(0)} km)`); continue; }
  // Start/end exactly on the station markers so the line meets the dots.
  const full = [[STATIONS[a][1], STATIONS[a][2]], ...r.pts, [STATIONS[b][1], STATIONS[b][2]]];
  result[key] = simplify(full, SIMPLIFY_DEG).map(p => [+p[0].toFixed(4), +p[1].toFixed(4)]);
}
console.log(`routed ${Object.keys(result).length}/${pairs.size} segments`);
if (fallback.length) console.log("kept as straight lines:\n  " + fallback.join("\n  "));

const lines = Object.keys(result).sort().map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(result[k])}`);
const out = `// GENERATED by tools/train-to-take/build-geometry.mjs from OpenStreetMap data (ODbL, © OpenStreetMap contributors).
// Do not edit by hand. Keys are "A|B" with station codes sorted alphabetically; values are [lat, lng] track points.
const ROUTE_GEOMETRY = {
${lines.join(",\n")}
};
`;
const outFile = path.join(dataDir, "geometry.js");
fs.writeFileSync(outFile, out);
console.log(`wrote ${outFile} (${(out.length / 1024).toFixed(0)} KB)`);

