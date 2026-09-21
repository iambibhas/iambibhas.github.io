const KIND_LABELS = {
  temple: "Temple",
  fort: "Fort / hill fort",
  palace: "Palace",
  mosque: "Mosque",
  church: "Church",
  monument: "Monument",
  heritage_building: "Heritage building",
};

const CITIES = {
  blr: {
    label: "Bengaluru",
    aliases: ["bengaluru", "bangalore", "blr"],
    eyebrow: "visitable heritage",
    lede: "Walkable monuments, temples, and colonial landmarks.",
    mapCenter: [12.97, 77.59],
    mapZoom: 11,
    eraLabels: {
      ancient_medieval: "Ancient & medieval (pre-16th c.)",
      vijayanagara_kempegowda: "Vijayanagara & Kempe Gowda",
      tipu_late_medieval: "Tipu & late Mysore",
      british: "British era (to 1947)",
    },
    eraColors: {
      ancient_medieval: "#8b4513",
      vijayanagara_kempegowda: "#b8860b",
      tipu_late_medieval: "#2d6a4f",
      british: "#4a5568",
    },
  },
  kol: {
    label: "Kolkata",
    aliases: ["kolkata", "calcutta", "kol"],
    eyebrow: "visitable heritage",
    lede:
      "Temples, Raj-era civic buildings, and Hooghly-side landmarks you can still walk into.",
    mapCenter: [22.57, 88.36],
    mapZoom: 11,
    eraLabels: {
      ancient_early: "Ancient & early (pre-1800)",
      nawabi_colonial: "Nawabi & early colonial",
      victorian: "Victorian Calcutta",
      late_colonial: "Late colonial (to 1947)",
    },
    eraColors: {
      ancient_early: "#6b4423",
      nawabi_colonial: "#9a3412",
      victorian: "#1d4e89",
      late_colonial: "#4a5568",
    },
  },
};

const DEFAULT_CITY = "blr";

function resolveCityId(raw) {
  if (!raw) return DEFAULT_CITY;
  const q = String(raw).trim().toLowerCase();
  if (CITIES[q]) return q;
  for (const [id, city] of Object.entries(CITIES)) {
    if (city.aliases.includes(q)) return id;
  }
  return DEFAULT_CITY;
}

function cityFromLocation() {
  return resolveCityId(new URLSearchParams(location.search).get("city"));
}

/** "" when served from static/heritage-map via python; "/heritage-map" on the live site. */
function appBasePath() {
  const el = document.querySelector('script[src$="app.js"]');
  if (!el?.src) return "";
  const dir = new URL(el.src).pathname.replace(/\/app\.js$/, "");
  return dir === "/heritage-map" ? dir : "";
}

function normalizeStartupUrl() {
  if (appBasePath()) return;
  if (!/^\/heritage-map(\/index\.html)?$/.test(location.pathname)) return;
  history.replaceState(null, "", `/${location.search}${location.hash}`);
}

function heritageMapUrl(cityId) {
  const base = appBasePath();
  const path = base ? `${base}/` : "/";
  const qs = new URLSearchParams({ city: cityId });
  return `${path}?${qs}`;
}
