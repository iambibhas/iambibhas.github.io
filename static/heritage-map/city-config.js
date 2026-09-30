const KIND_LABELS = {
  temple: "Temple",
  fort: "Fort / hill fort",
  palace: "Palace",
  mosque: "Mosque",
  church: "Church",
  monument: "Monument",
  heritage_building: "Heritage building",
};

/** Shared across cities so filters stay valid with all markers visible. */
const ERA_LABELS = {
  ancient_medieval: "Ancient & medieval (pre-16th c.)",
  early_modern: "Early modern (16th–18th c.)",
  high_colonial: "High colonial (19th c.)",
  late_colonial: "Late colonial (to 1947)",
};

const ERA_COLORS = {
  ancient_medieval: "#b91c1c",
  early_modern: "#d97706",
  high_colonial: "#1d4ed8",
  late_colonial: "#0f766e",
};

const OVERVIEW = {
  id: "all",
  label: "All cities",
  eyebrow: "visitable heritage",
  lede: "Walkable monuments across Indian cities — zoom in, or pick a city to fly there.",
  mapCenter: [17.8, 83.0],
  mapZoom: 5,
};

const CITIES = {
  blr: {
    label: "Bengaluru",
    aliases: ["bengaluru", "bangalore", "blr"],
    eyebrow: "visitable heritage",
    lede: "Walkable monuments, temples, and colonial landmarks.",
    mapCenter: [12.97, 77.59],
    mapZoom: 11,
  },
  kol: {
    label: "Kolkata",
    aliases: ["kolkata", "calcutta", "kol"],
    eyebrow: "visitable heritage",
    lede:
      "Temples, Raj-era civic buildings, and Hooghly-side landmarks you can still walk into.",
    mapCenter: [22.57, 88.36],
    mapZoom: 11,
  },
};

const DEFAULT_CITY = "all";

function resolveCityId(raw) {
  if (!raw) return DEFAULT_CITY;
  const q = String(raw).trim().toLowerCase();
  if (q === "all" || q === "overview") return "all";
  if (CITIES[q]) return q;
  for (const [id, city] of Object.entries(CITIES)) {
    if (city.aliases.includes(q)) return id;
  }
  return DEFAULT_CITY;
}

function cityFromLocation() {
  return resolveCityId(new URLSearchParams(location.search).get("city"));
}

function viewForCity(cityId) {
  if (cityId === "all") return OVERVIEW;
  return CITIES[cityId] || OVERVIEW;
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
