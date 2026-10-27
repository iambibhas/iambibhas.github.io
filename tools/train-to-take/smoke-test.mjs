// Loads the map's data + app.js against a stubbed DOM/Leaflet and renders a few train panels.
// Usage: node tools/train-to-take/smoke-test.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../static/train-to-take");
const els = {};
const el = () => ({ addEventListener() {}, style: {}, checked: true, href: "", _h: "",
  set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h; } });
const chain = () => new Proxy(function () {}, { get: (_, k) => (k === "getBounds" ? () => ({}) : chain()), apply: () => chain() });
const ctx = {
  document: { getElementById: id => (els[id] = els[id] || el()), createElement: () => el(), body: { append() {} } },
  window: { location: { href: "https://example.com/train-to-take/" } },
  navigator: {}, console,
  L: {
    map: () => ({ setView() { return this; }, fitBounds() {}, panTo() {}, removeLayer() {} }),
    tileLayer: () => ({ addTo() {} }), layerGroup: () => ({ addTo() { return this; } }),
    polyline: () => chain(), circleMarker: () => chain()
  }
};
vm.createContext(ctx);
for (const f of ["stations.js", "trains-vande-bharat.js", "trains-vistadome.js", "geometry.js", "timings.js", "app.js"]) {
  // top-level const -> var so later scripts (and this test) can see them, like <script> tags do
  vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8").replace(/^const (\w+) =/gm, "var $1 ="), ctx, { filename: f });
}
const show = prefix => {
  const index = vm.runInContext(`TRAINS.findIndex(t => t.number && t.number.includes("${prefix}"))`, ctx);
  if (index < 0) throw new Error(`No train found for test number ${prefix}`);
  vm.runInContext(`showTrain(${index})`, ctx);
  console.log(`--- ${prefix}\n` + els.content.innerHTML.replace(/\s+/g, " ").trim().slice(0, 1100) + "\n");
};
["22225", "22439", "12123", "20678", "20830", "20642", "20977", "20645", "22229", "12051"].forEach(show);
console.log("OK: app.js ran without errors");
