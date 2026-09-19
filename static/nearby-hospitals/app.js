const RADIUS_M = 8000;
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const NOMINATIM_REVERSE =
  "https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1";

const DEFAULT_CENTER = [12.9716, 77.5946];

let map,
  markersLayer,
  userMarker,
  radiusCircle,
  userLatLng,
  hospitals = [],
  selectedId = null;
let stateAmbulance = null;

function refreshMapSize() {
  map?.invalidateSize();
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function telHref(num) {
  return num.replace(/\s+/g, "");
}

function normalizeWebsiteUrl(url) {
  if (!url) return null;
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function googleMapsSearchUrl(h) {
  const q = `${h.lat.toFixed(5)},${h.lng.toFixed(5)}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}`;
}

function googleMapsLink(h, label = "Google Maps") {
  const url = googleMapsSearchUrl(h);
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function markerPopupHtml(h) {
  const phone = h.phone
    ? `<br/>📞 <a href="tel:${telHref(h.phone.split(";")[0])}">${h.phone}</a>`
    : "";
  const loc = h.locality ? `${h.locality}<br/>` : "";
  return `<strong>${h.name}</strong><br/>${loc}${h.dist.toFixed(1)} km${phone}<br/>${googleMapsLink(h)}`;
}

function renderEmergencyBanner() {
  const el = document.getElementById("emergency-banner");
  if (!el) return;

  const stateLine = stateAmbulance
    ? `<span class="state-label">${stateAmbulance.stateLabel}:</span>`
    : `<span class="state-label">Ambulance:</span>`;

  const stateNums = (stateAmbulance?.numbers || [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
  ])
    .map(
      (x) =>
        `<a class="num" href="tel:${telHref(x.n)}" title="${x.label}">${x.n}</a>`,
    )
    .join("");

  const national = NATIONAL_EMERGENCY.map(
    (x) =>
      `<a class="num num-national" href="tel:${x.n}" title="${x.label}">${x.n}</a>`,
  ).join("");

  el.innerHTML = `
    ${stateLine}
    ${stateNums}
    <span class="banner-sep">·</span>
    <span class="state-label">National</span>
    ${national}
  `;
}

function buildShell() {
  document.getElementById("app").innerHTML = `
    <header class="topbar">
      <h1>Nearby Hospitals</h1>
      <div id="emergency-banner" class="emergency-banner" aria-label="Emergency numbers"></div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-head">
          <h2>Hospitals</h2>
          <span id="count" class="sidebar-count">—</span>
        </div>
        <div class="sidebar-scroll">
          <div id="hospital-list" class="hospital-list"></div>
          <footer class="footer">
            <p>
              Hospital data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>.
              Ambulance numbers by state (from your location once). NHM <a href="https://nhm.gov.in/index1.php?lang=1&level=2&lid=189&sublinkid=1217" target="_blank" rel="noopener">Dial 108/102</a> — verify locally.
              Hospital phone numbers come from OpenStreetMap when listed.
            </p>
          </footer>
        </div>
      </aside>
      <main class="map-panel">
        <div id="map"></div>
        <div class="map-controls">
          <button
            type="button"
            id="location-search-btn"
            class="map-control-btn"
            aria-label="Search location"
            title="Wrong location? Search a place"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
          </button>
          <button
            type="button"
            id="refresh-hospitals-btn"
            class="map-control-btn map-control-btn--text"
            title="Search nearby hospitals again"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08a5.99 5.99 0 0 1-5.65 4c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
            </svg>
            Nearby
          </button>
        </div>
        <div id="location-search-panel" class="location-search-panel" hidden>
          <form id="location-search-form" class="location-search-form">
            <label class="sr-only" for="location-search-input">Search location</label>
            <input
              id="location-search-input"
              type="search"
              placeholder="Address, area, or landmark…"
              autocomplete="off"
            />
            <button type="submit">Go</button>
          </form>
          <ul id="location-search-results" class="location-search-results"></ul>
        </div>
        <div id="status" class="status-overlay">
          <p>Requesting your location…</p>
        </div>
      </main>
    </div>
  `;
  renderEmergencyBanner();
}

/** One reverse lookup per page load to resolve state for ambulance helplines. */
async function reverseGeocodeStateOnce(lat, lng) {
  const url = `${NOMINATIM_REVERSE}&lat=${lat}&lon=${lng}`;
  const resp = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
    },
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  const addr = data.address;
  return addr?.state || addr?.region || addr?.state_district || null;
}

function osmLocality(tags) {
  const keys = [
    "addr:suburb",
    "addr:locality",
    "addr:place",
    "addr:neighbourhood",
    "addr:hamlet",
    "addr:city",
  ];
  for (const k of keys) {
    if (tags[k]) return tags[k].trim();
  }
  return null;
}

function initMap(lat, lng) {
  map = L.map("map", { scrollWheelZoom: true, zoomControl: false }).setView(
    [lat, lng],
    13,
  );
  L.control.zoom({ position: "topright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);

  const userIcon = L.divIcon({
    className: "user-marker-wrap",
    html: '<span class="user-marker"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 })
    .addTo(map)
    .bindPopup("<strong>Search center</strong>");

  radiusCircle = L.circle([lat, lng], {
    radius: RADIUS_M,
    color: "#1976d2",
    fillColor: "#1976d2",
    fillOpacity: 0.06,
    weight: 1.5,
  }).addTo(map);
}

function setUserLocation(lat, lng, { pan = true } = {}) {
  userLatLng = [lat, lng];
  if (!map) {
    initMap(lat, lng);
    return;
  }
  userMarker.setLatLng([lat, lng]);
  radiusCircle.setLatLng([lat, lng]);
  if (pan) {
    map.setView([lat, lng], Math.max(map.getZoom(), 13), { animate: true });
  }
}

async function loadHospitalsAt(lat, lng, { fitBounds = true } = {}) {
  showStatus("Finding nearby hospitals…");
  try {
    const [stateRaw, hospitalList] = await Promise.all([
      reverseGeocodeStateOnce(lat, lng).catch(() => null),
      fetchHospitals(lat, lng),
    ]);
    stateAmbulance = ambulanceForState(stateRaw);
    renderEmergencyBanner();
    hospitals = hospitalList;
    selectedId = null;
    hideStatus();
    renderList();
    renderMarkers(fitBounds);
    requestAnimationFrame(refreshMapSize);
  } catch (err) {
    showStatus(
      "Failed to fetch hospital data. Try again. " + err.message,
      true,
    );
  }
}

async function nominatimSearch(query) {
  const q = query.trim();
  if (!q) return [];
  const params = new URLSearchParams({
    format: "json",
    q,
    limit: "6",
    countrycodes: "in",
  });
  if (userLatLng) {
    const [lat, lng] = userLatLng;
    params.set(
      "viewbox",
      `${lng - 0.45},${lat - 0.45},${lng + 0.45},${lat + 0.45}`,
    );
  }
  const resp = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { Accept: "application/json", "Accept-Language": "en" } },
  );
  if (!resp.ok) throw new Error("Location search failed");
  return resp.json();
}

function closeLocationSearchPanel() {
  const panel = document.getElementById("location-search-panel");
  if (panel) panel.hidden = true;
}

function openLocationSearchPanel() {
  const panel = document.getElementById("location-search-panel");
  const input = document.getElementById("location-search-input");
  if (!panel || !input) return;
  panel.hidden = false;
  input.focus();
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function renderLocationSearchResults(results) {
  const list = document.getElementById("location-search-results");
  if (!list) return;
  if (!results.length) {
    list.innerHTML = '<li class="location-search-empty">No places found</li>';
    return;
  }
  list.innerHTML = results
    .map(
      (r) =>
        `<li><button type="button" data-lat="${r.lat}" data-lng="${r.lon}">${escapeHtml(r.display_name)}</button></li>`,
    )
    .join("");
}

async function applySearchedLocation(lat, lng) {
  closeLocationSearchPanel();
  setUserLocation(lat, lng);
  await loadHospitalsAt(lat, lng);
}

function osmPhone(t) {
  return (
    t["emergency:phone"] ||
    t.phone ||
    t["contact:phone"] ||
    t["contact:mobile"] ||
    null
  );
}

async function fetchHospitals(lat, lng) {
  const query = `[out:json][timeout:25];(nwr["amenity"="hospital"](around:${RADIUS_M},${lat},${lng});nwr["healthcare"="hospital"](around:${RADIUS_M},${lat},${lng}););out center tags;`;

  let lastError = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });
      if (!resp.ok) {
        throw new Error(`Overpass API error: ${resp.status}`);
      }
      const data = await resp.json();
      if (data.remark && (!data.elements || data.elements.length === 0)) {
        throw new Error(data.remark);
      }
      return parseHospitalElements(data, lat, lng);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Could not load hospitals from OpenStreetMap");
}

function parseHospitalElements(data, lat, lng) {
  return data.elements
    .map((el, i) => {
      const t = el.tags || {};
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      return {
        id: String(el.id ?? i),
        name: t.name || t["name:en"] || "Unnamed Hospital",
        phone: osmPhone(t),
        lat: elLat,
        lng: elLng,
        dist: haversineKm(lat, lng, elLat, elLng),
        beds: t.beds || null,
        emergency: t.emergency || null,
        website: t.website || t["contact:website"] || null,
        locality: osmLocality(t),
      };
    })
    .filter((h) => h.lat != null)
    .sort((a, b) => a.dist - b.dist);
}

function hospitalIcon() {
  return L.divIcon({
    className: "hospital-marker-wrap",
    html: '<span class="hospital-marker"></span>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function phoneBlock(h) {
  if (h.phone) {
    const display = h.phone.replace(/;/g, " · ");
    return `<p class="phone">📞 <a href="tel:${telHref(h.phone.split(";")[0])}">${display}</a></p>`;
  }
  return '<p class="phone phone-missing">No phone listed</p>';
}

function renderCard(h) {
  const active = h.id === selectedId ? "is-active" : "";
  const extras = [];
  if (h.emergency === "yes") extras.push("🚑 Emergency dept.");
  if (h.beds) extras.push(`🛏️ ${h.beds} beds`);
  const meta = [`${h.dist.toFixed(1)} km away`, ...extras].join(" · ");
  const website = h.website
    ? ` · <a href="${normalizeWebsiteUrl(h.website)}" target="_blank" rel="noopener">Website</a>`
    : "";
  const maps = ` · ${googleMapsLink(h)}`;
  const localityLine = h.locality
    ? `<p class="locality">${h.locality}</p>`
    : "";
  return `
    <article class="hospital-card ${active}" data-id="${h.id}">
      <h3>${h.name}</h3>
      ${localityLine}
      <p class="meta">${meta}${website}${maps}</p>
      ${phoneBlock(h)}
      <button type="button" class="focus-map" data-id="${h.id}">Show on map</button>
    </article>
  `;
}

function renderList() {
  const listEl = document.getElementById("hospital-list");
  const countEl = document.getElementById("count");
  countEl.textContent = `${hospitals.length} found`;
  if (hospitals.length === 0) {
    const km = RADIUS_M / 1000;
    listEl.innerHTML = `<p style="color:var(--muted)">No hospitals found within ${km} km.</p>`;
    return;
  }
  listEl.innerHTML = hospitals.map(renderCard).join("");
}

function renderMarkers(fitBounds = true) {
  markersLayer.clearLayers();
  const bounds = [userLatLng];
  for (const h of hospitals) {
    bounds.push([h.lat, h.lng]);
    const m = L.marker([h.lat, h.lng], { icon: hospitalIcon() });
    m.bindPopup(markerPopupHtml(h));
    m.on("click", () => selectHospital(h.id, false));
    m.addTo(markersLayer);
  }
  if (fitBounds) {
    map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 14 });
  }
}

function selectHospital(id, pan = true) {
  selectedId = String(id);
  const h = hospitals.find((x) => x.id === selectedId);
  if (!h) return;
  renderList();
  if (pan)
    map.setView([h.lat, h.lng], Math.max(map.getZoom(), 15), { animate: true });
  document
    .querySelector(`.hospital-card[data-id="${id}"]`)
    ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function wireEvents() {
  document.getElementById("hospital-list")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".focus-map");
    if (btn?.dataset.id) {
      selectHospital(btn.dataset.id);
      return;
    }
    const card = e.target.closest(".hospital-card");
    if (card?.dataset.id) selectHospital(card.dataset.id);
  });

  document
    .getElementById("location-search-btn")
    ?.addEventListener("click", () => {
      const panel = document.getElementById("location-search-panel");
      if (panel?.hidden) openLocationSearchPanel();
      else closeLocationSearchPanel();
    });

  document
    .getElementById("location-search-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("location-search-input");
      if (!input?.value.trim()) return;
      const list = document.getElementById("location-search-results");
      if (list) list.innerHTML = '<li class="location-search-empty">Searching…</li>';
      try {
        renderLocationSearchResults(await nominatimSearch(input.value));
      } catch {
        if (list) {
          list.innerHTML =
            '<li class="location-search-empty">Search failed. Try again.</li>';
        }
      }
    });

  document
    .getElementById("location-search-results")
    ?.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-lat][data-lng]");
      if (!btn) return;
      applySearchedLocation(+btn.dataset.lat, +btn.dataset.lng);
    });

  document
    .getElementById("refresh-hospitals-btn")
    ?.addEventListener("click", () => {
      if (!userLatLng) return;
      loadHospitalsAt(userLatLng[0], userLatLng[1]);
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLocationSearchPanel();
  });

  window.addEventListener("resize", refreshMapSize);
}

function showStatus(msg, isError) {
  const el = document.getElementById("status");
  if (!el) return;
  el.innerHTML = `<p class="${isError ? "error" : ""}">${msg}</p>`;
  el.style.display = "flex";
}

function hideStatus() {
  const el = document.getElementById("status");
  if (el) el.style.display = "none";
}

async function init() {
  buildShell();
  wireEvents();

  if (!navigator.geolocation) {
    showStatus("Geolocation is not supported by your browser.", true);
    return;
  }

  const [defaultLat, defaultLng] = DEFAULT_CENTER;

  showStatus("Requesting your location…");
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserLocation(lat, lng, { pan: false });
      userMarker.setPopupContent("<strong>You are here</strong>");
      await loadHospitalsAt(lat, lng);
      setTimeout(refreshMapSize, 300);
    },
    (err) => {
      const msgs = {
        1: "Location permission denied. Use the search icon on the map to pick a place.",
        2: "Could not determine your location. Use the search icon on the map.",
        3: "Location request timed out. Use the search icon on the map.",
      };
      setUserLocation(defaultLat, defaultLng, { pan: false });
      showStatus(msgs[err.code] || "Unknown location error.", true);
      setTimeout(refreshMapSize, 300);
    },
    { enableHighAccuracy: false, timeout: 15000 },
  );
}

init();
