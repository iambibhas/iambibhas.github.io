// Builds static/train-to-take/timings.js: journey time, distance, frequency and
// stop-by-stop timetable for each train number, from Wikipedia (CC BY-SA 4.0).
//
// Usage: node tools/train-to-take/fetch-timings.mjs
// Wikitext is cached in tools/train-to-take/.cache-wiki (delete to refresh).
// Timings are approximate and may not match the current official timetable.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../../static/train-to-take");
const cacheDir = path.join(here, ".cache-wiki");
fs.mkdirSync(cacheDir, { recursive: true });
const UA = { "User-Agent": "train-to-take-timings-builder/1.0 (personal project)" };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- which numbers do we need? ----
const src = ["stations.js", "trains-vande-bharat.js", "trains-vistadome.js"]
  .map(f => fs.readFileSync(path.join(dataDir, f), "utf8")).join("\n");
const { TRAINS } = vm.runInNewContext(src + "\n;({ TRAINS })");
const wanted = new Set(TRAINS.flatMap(t => (t.number || "").split("/").map(s => s.trim()).filter(Boolean)));
console.log(wanted.size, "train numbers wanted");

// ---- article titles: every service linked from the Vande Bharat page + Vistadome trains ----
async function api(params) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch("https://en.wikipedia.org/w/api.php?format=json&" + params, { headers: UA });
    const text = await res.text();
    try { return JSON.parse(text); } catch { await sleep(8000 * (attempt + 1)); }
  }
  throw new Error("Wikipedia API keeps rate limiting");
}
async function wikitext(title) {
  const file = path.join(cacheDir, title.replace(/[^\w-]+/g, "_") + ".txt");
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  await sleep(2500);
  const j = await api("action=query&prop=revisions&rvprop=content&rvslots=main&redirects=1&titles=" + encodeURIComponent(title));
  const p = Object.values(j.query.pages)[0];
  const w = p.revisions?.[0]?.slots?.main?.["*"] ?? "";
  fs.writeFileSync(file, w);
  return w;
}

const main = await wikitext("Vande Bharat Express");
const sec = main.slice(main.indexOf("== Services =="), main.indexOf("== Discontinued"));
const titles = [...new Set([...sec.matchAll(/^\|\[\[([^\]|]+)\|/gm)].map(m => m[1]))].filter(x => /Vande Bharat Express/.test(x));
titles.push(
  "Deccan Queen",
  "Mumbai CSMT\u2013Madgaon Jan Shatabdi Express",
  "Visakhapatnam\u2013Kirandul Express"
);
console.log(titles.length, "articles to read");

// ---- parsing helpers ----
const stripTpl = s => { let p; do { p = s; s = s.replace(/\{\{[^{}]*\}\}/g, ""); } while (s !== p); return s; };
const clean = s => stripTpl(s.replace(/<ref[\s\S]*?(<\/ref>|\/>)/g, "")).replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
  .replace(/<[^>]+>/g, " ").replace(/'''?/g, "").replace(/\s+/g, " ").trim();
const field = (w, n) => { const m = w.match(new RegExp("\\|\\s*" + n + "\\s*=\\s*([^\\n]*)", "i")); return m ? m[1] : ""; };

function journey(raw) {
  const s = clean(raw);
  const m = s.match(/(\d+)\s*(?:h|hrs?|hours?)\b\s*(?:(\d+)\s*(?:m|mins?|minutes?))?/i);
  if (m) return `${+m[1]}h${m[2] ? " " + String(+m[2]).padStart(2, "0") + "m" : ""}`;
  const n = s.match(/(\d+)\s*(?:m|mins?)\b/i);
  return n ? `${n[1]}m` : "";
}
function km(raw) {
  const m = raw.match(/convert\|\s*([\d,.]+)/i) || clean(raw).match(/([\d,.]+)\s*km/i) || clean(raw).match(/^([\d,.]+)/);
  return m ? Math.round(parseFloat(m[1].replace(/,/g, ""))) : null;
}
function freq(raw) {
  const s = clean(raw).replace(/\(.*$/, "").trim();
  return s.length && s.length < 60 ? s : "";
}

const out = {};
for (const title of titles) {
  const w = await wikitext(title);
  const numbers = (clean(field(w, "trainnumber")).match(/\d{5}/g) || []);
  const info = { journey: journey(field(w, "journeytime")), km: km(field(w, "distance")), freq: freq(field(w, "frequency")) };
  // timetable tables: caption "... (12345)" then rows of Station | Code | Arr | Dep | Halt | Km | Day
  const tables = {};
  for (const tm of w.matchAll(/\{\|[\s\S]*?\n\|\}/g)) {
    const t = tm[0];
    if (!/Arrival/i.test(t) || !/Departure/i.test(t)) continue;
    const cap = t.match(/\|\+([^\n]*)/);
    const num = cap && clean(cap[1]).match(/\((\d{5})\)/);
    if (!num) continue;
    const stops = [];
    for (const row of t.split(/\n\|-/).slice(1)) {
      const cells = row.split("\n").filter(l => /^\|(?![-+}])/.test(l)).flatMap(l => l.slice(1).split("||")).map(c => clean(c));
      if (cells.length < 4) continue;
      const time = c => (/^\d{1,2}:\d{2}$/.test(c) ? c : "");
      const code = /^[A-Z]{1,5}$/.test(cells[1]) ? cells[1] : "";
      if (!code) continue;
      stops.push({ c: code, a: time(cells[2]), d: time(cells[3]), k: parseFloat(cells[5]) || 0 });
    }
    if (stops.length >= 2) tables[num[1]] = stops;
  }
  for (const n of numbers) {
    if (!wanted.has(n)) continue;
    out[n] = { ...info, stops: tables[n] || [] };
  }
}

const missing = [...wanted].filter(n => !out[n]);
console.log(`found ${Object.keys(out).length}/${wanted.size} numbers; with timetable: ${Object.values(out).filter(x => x.stops.length).length}`);
if (missing.length) console.log("not found:", missing.join(", "));

const body = Object.keys(out).sort().map(n => `  "${n}": ${JSON.stringify(out[n])}`).join(",\n");
fs.writeFileSync(path.join(dataDir, "timings.js"),
`// GENERATED by tools/train-to-take/fetch-timings.mjs from Wikipedia (CC BY-SA 4.0). Do not edit by hand.
// Approximate: may not match the current official timetable. Per train number:
// journey (scheduled), km, freq, stops: [{ c: station code, a: arrival, d: departure, k: km from origin }]
const TIMINGS = {
${body}
};
`);
console.log("wrote timings.js");
