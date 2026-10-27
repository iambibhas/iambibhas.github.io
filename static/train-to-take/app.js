const COLORS = { VB: "#1565c0", VD: "#ef6c00" };
const LABEL = { VB: "Vande Bharat", VD: "Vistadome" };

const map = L.map("map").setView([22.5, 79], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18, attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// share links (same behaviour as the puja map)
const mapUrl = window.location.href;
const shareLabel = "Explore India's Vande Bharat and Vistadome train routes";
const shareText = `${shareLabel}: ${mapUrl}`;
const shareStatus = document.getElementById("share-status");
document.getElementById("whatsapp-share").href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
document.getElementById("twitter-share").href =
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareLabel)}&url=${encodeURIComponent(mapUrl)}`;

async function copyMapLink() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(mapUrl);
    } else {
      const input = document.createElement("textarea");
      input.value = mapUrl;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      if (!copied) throw new Error("Clipboard unavailable");
    }
    shareStatus.textContent = "Map link copied. Paste it into an Instagram post or message.";
  } catch (error) {
    shareStatus.textContent = `Copy this link to share: ${mapUrl}`;
  }
}

document.getElementById("instagram-share").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text: shareLabel, url: mapUrl });
      shareStatus.textContent = "Choose Instagram in your device's share menu.";
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyMapLink();
});

const content = document.getElementById("content");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c));

// station code -> trains stopping there
const trainsAt = {};
TRAINS.forEach((t, i) => {
  t.id = i;
  t.stops.forEach(code => (trainsAt[code] = trainsAt[code] || []).push(t));
});
const ll = code => [STATIONS[code][1], STATIONS[code][2]];

const lineLayers = {}, stationMarkers = {};
const groups = { VB: L.layerGroup().addTo(map), VD: L.layerGroup().addTo(map) };
let selectedTrain = null;

// Real track path for a train: stitch per-segment OSM geometry (geometry.js),
// falling back to a straight line for any segment that has no geometry.
const GEO = typeof ROUTE_GEOMETRY !== "undefined" ? ROUTE_GEOMETRY : {};
function trainPath(t) {
  const pts = [];
  for (let i = 0; i < t.stops.length - 1; i++) {
    const a = t.stops[i], b = t.stops[i + 1];
    const flip = a > b;
    const seg = GEO[(flip ? b + "|" + a : a + "|" + b)];
    let part = seg ? (flip ? seg.slice().reverse() : seg) : [ll(a), ll(b)];
    if (pts.length) part = part.slice(1); // avoid duplicating the joint
    pts.push(...part);
  }
  return pts;
}

// Approximate total journey durations from timings.js.
const TIM = typeof TIMINGS !== "undefined" ? TIMINGS : {};
const STATION_ALIAS = { SBC: "KSR", UBL: "SSS" };
const stationKey = code => STATION_ALIAS[code] || code;
function timingFor(t) {
  const nums = (t.number || "").split("/").map(s => s.trim()).filter(Boolean);
  const infos = nums.map(n => TIM[n]).filter(Boolean);
  if (!infos.length) return null;
  const routeOrigin = stationKey(t.stops[0]);
  const base = infos.find(i => stationKey(i.origin) === routeOrigin) || infos[0];
  return base.journey ? { journey: base.journey } : null;
}

TRAINS.forEach(t => {
  const line = L.polyline(trainPath(t), { color: COLORS[t.type], weight: 3, opacity: 0.75 })
    .bindTooltip(esc([t.number, t.name, (timingFor(t) || {}).journey].filter(Boolean).join(" · ")), { sticky: true })
    .on("click", () => showTrain(t.id))
    .addTo(groups[t.type]);
  lineLayers[t.id] = line;
});

Object.keys(trainsAt).forEach(code => {
  const hasVB = trainsAt[code].some(t => t.type === "VB");
  const m = L.circleMarker(ll(code), {
    radius: 5, color: "#333", weight: 1.5, fillColor: hasVB ? "#fff" : "#ffd9b0", fillOpacity: 1
  }).bindTooltip(STATIONS[code][0]).on("click", () => showStation(code)).addTo(map);
  stationMarkers[code] = m;
});

function trainLink(t) {
  const num = t.number ? `<small class="train-no">${esc(t.number)}</small> ` : "";
  return `${num}<button class="link" data-train="${t.id}">${esc(t.name)}</button>`;
}

function showHome() {
  selectedTrain = null;
  restyle();
  const vb = TRAINS.filter(t => t.type === "VB").length, vd = TRAINS.length - vb;
  content.innerHTML = `<p class="hint">Click a <b>station</b> on the map to see the Vande Bharat trains connecting there,
    then click a train name to see its route and stations.<br><br>
    Showing ${vb} Vande Bharat and ${vd} Vistadome trains.</p>
    <p class="note">Approximate total journey durations are shown where available. Temporary festival specials are excluded.
    Intermediate stop lists are curated and may not match the latest timetable; routes use OpenStreetMap geometry
    where available and straight lines otherwise.</p>`;
}

function showStation(code) {
  const [name] = STATIONS[code];
  const list = trainsAt[code] || [];
  const vb = list.filter(t => t.type === "VB"), vd = list.filter(t => t.type === "VD");
  const items = arr => arr.length
    ? `<ul class="list">${arr.map(t => `<li>${trainLink(t)}</li>`).join("")}</ul>` : `<p class="hint">None</p>`;
  content.innerHTML = `<button class="link back" data-home>← All trains</button>
    <h2>${esc(name)} <small>(${code})</small></h2>
    <h3>Vande Bharat trains (${vb.length})</h3>${items(vb)}
    ${vd.length ? `<h3>Vistadome trains (${vd.length})</h3>${items(vd)}` : ""}`;
  map.panTo(ll(code));
}

function showTrain(id) {
  const t = TRAINS[id];
  const tm = timingFor(t);
  selectedTrain = id;
  restyle();
  map.fitBounds(lineLayers[id].getBounds(), { padding: [60, 60] });
  content.innerHTML = `<button class="link back" data-home>← All trains</button>
    <h2>${esc(t.name)} <span class="tag ${t.type}">${LABEL[t.type]}</span></h2>
    ${t.number ? `<p class="train-numbers">Train no. <b>${esc(t.number)}</b> <small>(use on IRCTC)</small></p>` : ""}
    ${tm && tm.journey ? `<p class="journey">Total travel time: <b>${esc(tm.journey)}</b> <small>(approx.)</small></p>` : ""}
    <p class="hint">${t.stops.length} named stations: ${esc(STATIONS[t.stops[0]][0])} → ${esc(STATIONS[t.stops[t.stops.length - 1]][0])}</p>
    <ul class="stops" style="--c:${COLORS[t.type]}">
      ${t.stops.map(c => `<li><button class="link" data-station="${c}">${esc(STATIONS[c][0])}</button> <small>${c}</small></li>`).join("")}
    </ul>`;
}

// Highlight the selected train without hiding anything else: every route and station
// stays visible, and the selected route gets a white halo + thicker coloured line on top.
let highlight = null;
function restyle() {
  if (highlight) { highlight.forEach(l => map.removeLayer(l)); highlight = null; }
  if (selectedTrain !== null) {
    const t = TRAINS[selectedTrain], pts = lineLayers[selectedTrain].getLatLngs();
    highlight = [
      L.polyline(pts, { color: "#fff", weight: 10, opacity: 0.95, interactive: false }),
      L.polyline(pts, { color: COLORS[t.type], weight: 6, opacity: 1, interactive: false })
    ];
    highlight.forEach(l => l.addTo(map));
  }
  // keep station dots above the lines, and the selected train's stops above the rest
  Object.keys(stationMarkers).forEach(code => stationMarkers[code].bringToFront());
  if (selectedTrain !== null) TRAINS[selectedTrain].stops.forEach(c => stationMarkers[c].bringToFront());
}

// layer toggles
["VB", "VD"].forEach(type => {
  document.getElementById("toggle-" + type).addEventListener("change", e => {
    e.target.checked ? groups[type].addTo(map) : map.removeLayer(groups[type]);
    Object.keys(stationMarkers).forEach(code => {
      const visible = trainsAt[code].some(t => document.getElementById("toggle-" + t.type).checked);
      visible ? stationMarkers[code].addTo(map) : map.removeLayer(stationMarkers[code]);
    });
  });
});

// search
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) return showHome();
  const trains = TRAINS.filter(t => t.name.toLowerCase().includes(q) || (t.number || "").includes(q));
  const stations = Object.keys(trainsAt).filter(c => STATIONS[c][0].toLowerCase().includes(q) || c.toLowerCase() === q);
  content.innerHTML = `<h3>Trains</h3><ul class="list">${trains.map(t => `<li>${trainLink(t)}</li>`).join("") || "<li class='hint'>No match</li>"}</ul>
    <h3>Stations</h3><ul class="list">${stations.map(c => `<li><button class="link" data-station="${c}">${esc(STATIONS[c][0])}</button> <small>${c}</small></li>`).join("") || "<li class='hint'>No match</li>"}</ul>`;
});

// delegated clicks in side panel
content.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.train !== undefined) showTrain(+b.dataset.train);
  else if (b.dataset.station) showStation(b.dataset.station);
  else if ("home" in b.dataset) { document.getElementById("search").value = ""; showHome(); }
});

showHome();
