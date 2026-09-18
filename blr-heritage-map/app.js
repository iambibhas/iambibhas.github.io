const CUTOFF_YEAR = 1950;

const state = {
  query: "",
  eras: new Set(Object.keys(ERA_LABELS)),
};

let map;
let markersLayer;
let selectedId = null;

function siteMatches(site, filters) {
  if (site.builtYear >= CUTOFF_YEAR) return false;
  if (filters.eras.size > 0 && !filters.eras.has(site.era)) return false;
  const q = filters.query.trim().toLowerCase();
  if (!q) return true;
  return (
    site.name.toLowerCase().includes(q) ||
    site.summary.toLowerCase().includes(q) ||
    KIND_LABELS[site.kind].toLowerCase().includes(q)
  );
}

function filteredSites() {
  return HERITAGE_SITES.filter((s) => siteMatches(s, state));
}

function markerIcon(site) {
  const color = ERA_COLORS[site.era];
  return L.divIcon({
    className: "heritage-marker-wrap",
    html: `<span class="heritage-marker" style="--marker:${color}" title="${site.name}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function renderSiteCard(site, active) {
  const sources = site.sources
    .map(
      (s) =>
        `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`,
    )
    .join("");
  const wiki = site.wikipedia
    ? `<p class="wiki"><a href="${site.wikipedia}" target="_blank" rel="noopener noreferrer">Wikipedia</a></p>`
    : "";

  return `
    <article class="site-card ${active ? "is-active" : ""}" data-id="${site.id}">
      <header>
        <h3>${site.name}</h3>
        <span class="era-badge">${ERA_LABELS[site.era]}</span>
      </header>
      <p class="meta">${KIND_LABELS[site.kind]} · c. ${site.builtYear}</p>
      <p>${site.summary}</p>
      <p class="visit"><strong>Visit:</strong> ${site.visitNotes}</p>
      <ul class="sources">${sources}</ul>
      ${wiki}
      <button type="button" class="focus-map" data-focus="${site.id}">Show on map</button>
    </article>
  `;
}

function renderList() {
  const listEl = document.getElementById("site-list");
  const countEl = document.getElementById("site-count");
  if (!listEl || !countEl) return;

  const sites = filteredSites().sort((a, b) => a.builtYear - b.builtYear);
  countEl.textContent = `${sites.length} place${sites.length === 1 ? "" : "s"}`;

  if (sites.length === 0) {
    listEl.innerHTML =
      '<p class="empty">No sites match these filters. Try clearing search or selecting more eras.</p>';
    return;
  }

  listEl.innerHTML = sites.map((s) => renderSiteCard(s, s.id === selectedId)).join("");
}

function fitMapToFilteredSites() {
  const sites = filteredSites();
  if (sites.length === 0) return;
  const bounds = sites.map((s) => [s.lat, s.lng]);
  map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 12 });
}

function updateResetMapButton() {
  const btn = document.getElementById("reset-map");
  if (btn) btn.hidden = selectedId === null;
}

function resetMapView() {
  selectedId = null;
  renderList();
  fitMapToFilteredSites();
  updateResetMapButton();
}

function renderMarkers() {
  markersLayer.clearLayers();
  const sites = filteredSites();
  const bounds = [];

  for (const site of sites) {
    bounds.push([site.lat, site.lng]);
    const marker = L.marker([site.lat, site.lng], { icon: markerIcon(site) });
    marker.bindPopup(
      `<strong>${site.name}</strong><br/><span class="popup-era">${ERA_LABELS[site.era]}</span><br/>c. ${site.builtYear}`,
    );
    marker.on("click", () => selectSite(site.id, { pan: false }));
    marker.addTo(markersLayer);
  }

  if (sites.length > 0 && !selectedId) {
    fitMapToFilteredSites();
  }
}

function selectSite(id, opts = { pan: true }) {
  selectedId = id;
  const site = HERITAGE_SITES.find((s) => s.id === id);
  if (!site) return;

  renderList();
  if (opts.pan !== false) {
    map.setView([site.lat, site.lng], Math.max(map.getZoom(), 14), { animate: true });
  }

  updateResetMapButton();

  const card = document.querySelector(`.site-card[data-id="${id}"]`);
  card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function buildShell() {
  const app = document.getElementById("app");
  if (!app) return;

  const eraChecks = Object.keys(ERA_LABELS)
    .map(
      (era) => `
      <label class="chip">
        <input type="checkbox" name="era" value="${era}" ${
          state.eras.has(era) ? "checked" : ""
        } />
        <span style="--chip:${ERA_COLORS[era]}">${ERA_LABELS[era]}</span>
      </label>`,
    )
    .join("");

  const legend = Object.keys(ERA_LABELS)
    .map(
      (era) =>
        `<span><i style="background:${ERA_COLORS[era]}"></i>${ERA_LABELS[era]}</span>`,
    )
    .join("");

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <p class="eyebrow">Bengaluru · visitable heritage</p>
        <h1>Bengaluru Heritage Map</h1>
        <p class="lede">
          Walkable monuments, temples, and colonial landmarks.
        </p>
      </div>
    </header>
    <nav class="filter-bar" aria-label="Map filters">
      <label class="search">
        <span class="sr-only">Search</span>
        <input id="search" type="search" placeholder="Search…" autocomplete="off" />
      </label>
      <div class="era-filters" role="group" aria-label="Era">
        <span class="filter-label">Era</span>
        ${eraChecks}
      </div>
    </nav>
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-head">
          <h2>Places</h2>
          <span id="site-count" class="sidebar-count">—</span>
        </div>
        <div id="site-list" class="site-list"></div>
      </aside>
      <main class="map-panel">
        <div id="map"></div>
        <button type="button" id="reset-map" class="map-reset" hidden>
          Show all on map
        </button>
        <div class="map-legend">${legend}</div>
      </main>
    </div>
    <footer class="footer">
      <p>
        Curated, not exhaustive. Map tiles ©
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>.
        Verify hours before visiting religious sites.
      </p>
    </footer>
  `;
}

function wireEvents() {
  document.getElementById("search")?.addEventListener("input", (e) => {
    state.query = e.target.value;
    selectedId = null;
    updateResetMapButton();
    renderList();
    renderMarkers();
  });

  document.getElementById("reset-map")?.addEventListener("click", resetMapView);

  document.querySelectorAll('input[name="era"]').forEach((el) => {
    el.addEventListener("change", () => {
      state.eras = new Set(
        [...document.querySelectorAll('input[name="era"]:checked')].map((c) => c.value),
      );
      selectedId = null;
      updateResetMapButton();
      renderList();
      renderMarkers();
    });
  });

  document.getElementById("site-list")?.addEventListener("click", (e) => {
    const focusBtn = e.target.closest(".focus-map");
    if (focusBtn?.dataset.focus) {
      selectSite(focusBtn.dataset.focus);
      return;
    }
    const card = e.target.closest(".site-card");
    if (card?.dataset.id) selectSite(card.dataset.id);
  });
}

function initMap() {
  map = L.map("map", { scrollWheelZoom: true }).setView([12.97, 77.59], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

function init() {
  buildShell();
  initMap();
  wireEvents();
  renderList();
  renderMarkers();
}

init();
