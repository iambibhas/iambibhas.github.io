const CUTOFF_YEAR = 1950;

const state = {
  city: cityFromLocation(),
  query: "",
  eras: new Set(Object.keys(ERA_LABELS)),
};

let map;
let markersLayer;
let selectedId = null;
const markersById = new Map();

function allHeritageSites() {
  return Object.entries(HERITAGE_BY_CITY).flatMap(([city, sites]) =>
    sites.map((s) => ({ ...s, city })),
  );
}

function siteById(id) {
  return allHeritageSites().find((s) => s.id === id);
}

function syncCityInUrl() {
  history.replaceState(null, "", heritageMapUrl(state.city));
}

function isMobileView() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function refreshMapSize() {
  map?.invalidateSize();
}

function openMobileSitePanel(site) {
  const panel = document.getElementById("mobile-site-panel");
  const content = document.getElementById("mobile-site-content");
  if (!panel || !content || !site) return;
  selectedId = site.id;
  content.innerHTML = renderSiteCard(site, true, { showFocusBtn: false });
  panel.hidden = false;
  panel.removeAttribute("hidden");
  refreshMarkerSelection();
}

function closeMobileSitePanel() {
  const panel = document.getElementById("mobile-site-panel");
  if (!panel) return;
  panel.hidden = true;
  selectedId = null;
  refreshMarkerSelection();
}

function siteMatches(site, filters) {
  if (site.builtYear >= CUTOFF_YEAR) return false;
  if (filters.eras.size > 0 && !filters.eras.has(site.era)) return false;
  const q = filters.query.trim().toLowerCase();
  if (!q) return true;
  const cityLabel = CITIES[site.city]?.label || "";
  return (
    site.name.toLowerCase().includes(q) ||
    site.summary.toLowerCase().includes(q) ||
    KIND_LABELS[site.kind].toLowerCase().includes(q) ||
    cityLabel.toLowerCase().includes(q)
  );
}

function filteredSites() {
  return allHeritageSites().filter((s) => siteMatches(s, state));
}

function markerIcon(site, selected = false) {
  const color = ERA_COLORS[site.era];
  const size = selected ? 36 : 24;
  const anchor = size / 2;
  return L.divIcon({
    className: "heritage-marker-wrap",
    html: `<span class="heritage-marker${selected ? " is-selected" : ""}" style="--marker:${color}" title="${site.name}"></span>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
}

function refreshMarkerSelection() {
  for (const [id, marker] of markersById) {
    const site = siteById(id);
    if (!site) continue;
    const selected = id === selectedId;
    marker.setIcon(markerIcon(site, selected));
    marker.setZIndexOffset(selected ? 1000 : 0);
  }
}

function closeAllMarkerPopups() {
  map?.closePopup();
}

function openMarkerPopup(id) {
  if (isMobileView()) return;
  closeAllMarkerPopups();
  markersById.get(id)?.openPopup();
}

function centerMapOnSite(site, onDone) {
  const zoom = Math.max(map.getZoom(), 14);
  const target = L.latLng(site.lat, site.lng);
  const unchanged =
    map.getZoom() === zoom && map.getCenter().distanceTo(target) < 2;
  map.setView(target, zoom, { animate: !unchanged });
  if (!onDone) return;
  if (unchanged) onDone();
  else map.once("moveend", onDone);
}

function flyToCityView(cityId) {
  const view = viewForCity(cityId);
  if (cityId === "all") {
    fitMapToFilteredSites({ maxZoom: OVERVIEW.mapZoom + 1 });
    return;
  }
  map.setView(view.mapCenter, view.mapZoom, { animate: true });
}

function googleMapsUrl(site) {
  const q = `${site.lat},${site.lng}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}`;
}

function renderSiteCard(site, active, opts = {}) {
  const { showFocusBtn = true } = opts;
  const sources = site.sources
    .map(
      (s) =>
        `<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`,
    )
    .join("");
  const wiki = site.wikipedia
    ? `<p class="wiki"><a href="${site.wikipedia}" target="_blank" rel="noopener noreferrer">Wikipedia</a></p>`
    : "";
  const cityLabel = CITIES[site.city]?.label || site.city;

  return `
    <article class="site-card ${active ? "is-active" : ""}" data-id="${site.id}">
      <header>
        <h3>${site.name}</h3>
        <span class="era-badge">${ERA_LABELS[site.era]}</span>
      </header>
      <p class="meta">${cityLabel} · ${KIND_LABELS[site.kind]} · c. ${site.builtYear}</p>
      <p>${site.summary}</p>
      <p class="visit"><strong>Visit:</strong> ${site.visitNotes}</p>
      <ul class="sources">${sources}</ul>
      ${wiki}
      <p class="maps-link"><a href="${googleMapsUrl(site)}" target="_blank" rel="noopener noreferrer">Google Maps</a></p>
      ${
        showFocusBtn
          ? `<button type="button" class="focus-map" data-focus="${site.id}">Show on map</button>`
          : ""
      }
    </article>
  `;
}

function renderList() {
  const listEl = document.getElementById("site-list");
  const countEl = document.getElementById("site-count");
  if (!listEl || !countEl) return;

  const sites = filteredSites().sort((a, b) => {
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    return a.builtYear - b.builtYear;
  });
  countEl.textContent = `${sites.length} place${sites.length === 1 ? "" : "s"}`;

  if (sites.length === 0) {
    listEl.innerHTML =
      '<p class="empty">No sites match these filters. Try clearing search or selecting more eras.</p>';
    return;
  }

  listEl.innerHTML = sites.map((s) => renderSiteCard(s, s.id === selectedId)).join("");
}

function fitMapToFilteredSites(opts = {}) {
  const sites = filteredSites();
  if (sites.length === 0) return;
  const bounds = sites.map((s) => [s.lat, s.lng]);
  map.fitBounds(L.latLngBounds(bounds), {
    padding: [40, 40],
    maxZoom: opts.maxZoom ?? 12,
  });
}

function resetMapView() {
  selectedId = null;
  closeMobileSitePanel();
  state.city = "all";
  updateCityChrome();
  syncCityInUrl();
  renderList();
  fitMapToFilteredSites({ maxZoom: OVERVIEW.mapZoom + 1 });
  refreshMarkerSelection();
  closeAllMarkerPopups();
}

function renderMarkers() {
  markersLayer.clearLayers();
  markersById.clear();
  const sites = filteredSites();

  for (const site of sites) {
    const marker = L.marker([site.lat, site.lng], {
      icon: markerIcon(site, site.id === selectedId),
    });
    markersById.set(site.id, marker);
    if (!isMobileView()) {
      const cityLabel = CITIES[site.city]?.label || site.city;
      marker.bindPopup(
        `<strong>${site.name}</strong><br/><span class="popup-era">${cityLabel} · ${ERA_LABELS[site.era]}</span><br/>c. ${site.builtYear}`,
        { autoPan: false },
      );
    }
    marker.on("click", () => {
      if (isMobileView()) {
        openMobileSitePanel(site);
        centerMapOnSite(site);
        return;
      }
      selectSite(site.id, { pan: false, openPopup: false });
    });
    marker.addTo(markersLayer);
  }
}

function selectSite(id, opts = { pan: true, openPopup: true }) {
  selectedId = id;
  const site = siteById(id);
  if (!site) return;

  renderList();
  refreshMarkerSelection();

  const showPopup = () => {
    if (opts.openPopup !== false) openMarkerPopup(id);
  };

  if (opts.pan !== false) centerMapOnSite(site, showPopup);
  else showPopup();

  const card = document.querySelector(`.site-card[data-id="${id}"]`);
  card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function eraFilterMarkup() {
  return Object.keys(ERA_LABELS)
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
}

function legendMarkup() {
  return Object.keys(ERA_LABELS)
    .map(
      (era) =>
        `<span><i style="background:${ERA_COLORS[era]}"></i>${ERA_LABELS[era]}</span>`,
    )
    .join("");
}

function cityOptionsMarkup() {
  const opts = [
    `<option value="all"${state.city === "all" ? " selected" : ""}>${OVERVIEW.label}</option>`,
    ...Object.entries(CITIES).map(
      ([id, city]) =>
        `<option value="${id}"${id === state.city ? " selected" : ""}>${city.label}</option>`,
    ),
  ];
  return opts.join("");
}

function updateCityChrome() {
  const view = viewForCity(state.city);
  document.title =
    state.city === "all"
      ? "Heritage Map"
      : `${view.label} Heritage Map`;
  const eyebrow = document.getElementById("city-eyebrow");
  const lede = document.getElementById("city-lede");
  const select = document.getElementById("city-select");
  const mobileSelect = document.getElementById("city-select-mobile");
  if (eyebrow) {
    eyebrow.textContent =
      state.city === "all"
        ? `India · ${view.eyebrow}`
        : `${view.label} · ${view.eyebrow}`;
  }
  if (lede) lede.textContent = view.lede;
  if (select) select.value = state.city;
  if (mobileSelect) mobileSelect.value = state.city;
}

function buildShell() {
  const app = document.getElementById("app");
  if (!app) return;
  const view = viewForCity(state.city);
  const eyebrowText =
    state.city === "all"
      ? `India · ${view.eyebrow}`
      : `${view.label} · ${view.eyebrow}`;

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <div class="brand-row">
          <h1>Heritage Map</h1>
          <label class="city-select">
            <span class="sr-only">City</span>
            <select id="city-select" aria-label="City">${cityOptionsMarkup()}</select>
          </label>
        </div>
        <p class="eyebrow" id="city-eyebrow">${eyebrowText}</p>
        <p class="lede" id="city-lede">${view.lede}</p>
      </div>
    </header>
    <nav class="filter-bar" aria-label="Map filters">
      <label class="search">
        <span class="sr-only">Search</span>
        <input id="search" type="search" placeholder="Search…" autocomplete="off" />
      </label>
      <div class="era-filters" role="group" aria-label="Era">
        <span class="filter-label">Era</span>
        ${eraFilterMarkup()}
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
        <label class="map-city-select city-select">
          <span class="sr-only">City</span>
          <select id="city-select-mobile" aria-label="City">${cityOptionsMarkup()}</select>
        </label>
        <button type="button" id="reset-map" class="map-reset">
          Show all on map
        </button>
        <div class="map-legend">${legendMarkup()}</div>
        <div id="mobile-site-panel" class="mobile-site-panel" hidden>
          <button type="button" class="mobile-site-panel__backdrop" aria-label="Close details"></button>
          <div class="mobile-site-panel__sheet" role="dialog" aria-modal="true" aria-label="Heritage site details">
            <button type="button" class="mobile-site-panel__close" aria-label="Close">×</button>
            <div id="mobile-site-content"></div>
          </div>
        </div>
      </main>
    </div>
    <footer class="footer">
      <p>
        Curated, not exhaustive. Map tiles ©
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>.
        Verify hours before visiting religious sites.
      </p>
      <p class="built-by">Built by <a href="https://bibhasdn.com/" rel="noopener noreferrer">Bibhas</a></p>
    </footer>
  `;
}

function wireEraFilters() {
  document.querySelectorAll('input[name="era"]').forEach((el) => {
    el.addEventListener("change", () => {
      state.eras = new Set(
        [...document.querySelectorAll('input[name="era"]:checked')].map((c) => c.value),
      );
      selectedId = null;
      renderList();
      renderMarkers();
    });
  });
}

function switchCity(nextCity) {
  const resolved = resolveCityId(nextCity);
  if (!CITIES[resolved] && resolved !== "all") return;
  state.city = resolved;
  selectedId = null;
  closeMobileSitePanel();
  closeAllMarkerPopups();

  updateCityChrome();
  syncCityInUrl();
  renderList();
  // Markers stay across cities; city switch only moves the camera
  flyToCityView(state.city);
  refreshMarkerSelection();
}

function wireEvents() {
  const onCityPick = (e) => switchCity(e.target.value);
  document.getElementById("city-select")?.addEventListener("change", onCityPick);
  document.getElementById("city-select-mobile")?.addEventListener("change", onCityPick);

  document.getElementById("search")?.addEventListener("input", (e) => {
    state.query = e.target.value;
    selectedId = null;
    renderList();
    renderMarkers();
  });

  document.getElementById("reset-map")?.addEventListener("click", resetMapView);

  document
    .querySelector(".mobile-site-panel__close")
    ?.addEventListener("click", closeMobileSitePanel);
  document
    .querySelector(".mobile-site-panel__backdrop")
    ?.addEventListener("click", closeMobileSitePanel);

  window.addEventListener("resize", () => {
    refreshMapSize();
    if (!isMobileView()) closeMobileSitePanel();
  });

  wireEraFilters();

  document.getElementById("site-list")?.addEventListener("click", (e) => {
    const focusBtn = e.target.closest(".focus-map");
    if (focusBtn?.dataset.focus) {
      selectSite(focusBtn.dataset.focus);
      return;
    }
    const card = e.target.closest(".site-card");
    if (card?.dataset.id) selectSite(card.dataset.id);
  });

  window.addEventListener("popstate", () => {
    const next = cityFromLocation();
    if (next !== state.city) switchCity(next);
  });
}

function initMap() {
  const view = viewForCity(state.city);
  map = L.map("map", { scrollWheelZoom: true }).setView(view.mapCenter, view.mapZoom);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

function init() {
  normalizeStartupUrl();
  buildShell();
  initMap();
  wireEvents();
  syncCityInUrl();
  renderList();
  renderMarkers();
  if (state.city === "all") {
    fitMapToFilteredSites({ maxZoom: OVERVIEW.mapZoom + 1 });
  }
  requestAnimationFrame(refreshMapSize);
  setTimeout(refreshMapSize, 250);
}

init();
