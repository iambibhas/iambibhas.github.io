"use strict";

const map = L.map("map", { scrollWheelZoom: true });
map.createPane("metro");
map.getPane("metro").style.zIndex = "350";
const venueLayer = L.featureGroup().addTo(map);
const venueList = document.querySelector("#venue-list");
const searchInput = document.querySelector("#venue-search");
const resultCount = document.querySelector("#result-count");
const venueRecords = [];
let activeVenueId = null;

const mapUrl = window.location.href;
const shareText = `Explore Bengaluru's Durga Puja 2026 venues: ${mapUrl}`;
const whatsappShare = document.querySelector("#whatsapp-share");
const instagramShare = document.querySelector("#instagram-share");
const shareStatus = document.querySelector("#share-status");
whatsappShare.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

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

instagramShare.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text: "Explore Bengaluru's Durga Puja 2026 venues", url: mapUrl });
      shareStatus.textContent = "Choose Instagram in your device's share menu.";
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyMapLink();
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

function parseCsvRows(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const text = csv.replace(/^\uFEFF/, "");

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted && character === '"' && text[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function makePopup(venue) {
  const content = document.createElement("div");
  const title = document.createElement("h2");
  title.className = "popup-title";
  title.textContent = venue.name;
  content.append(title);

  const warning = document.createElement("p");
  warning.className = "popup-warning";
  warning.textContent = venue.hasCurrentCoordinates
    ? "2026 location from the listed source."
    : venue.status2026 === "unverified"
      ? "This marker uses 2023 KML coordinates; the 2026 location is unverified."
      : "This marker is the original 2023 KML coordinate; use Navigate for the current destination.";
  content.append(warning);

  if (venue.venue2026 || venue.address2026) {
    const address = document.createElement("p");
    address.className = "popup-address";
    address.textContent = formatCurrentVenue(venue);
    content.append(address);
  }

  appendVenueLinks(content, venue);
  return content;
}

function navigateUrl(venue) {
  if (!Number.isFinite(venue.lat) || !Number.isFinite(venue.lon)) return "";
  return `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lon}`;
}

function googleMapsAppUrl(venue) {
  if (!Number.isFinite(venue.lat) || !Number.isFinite(venue.lon)) return "";
  return `comgooglemaps://?q=${venue.lat},${venue.lon}`;
}

function appendVenueLinks(container, venue) {
  const links = document.createElement("div");
  links.className = "venue-links";
  appendVenueLink(links, navigateUrl(venue), "Navigate");
  appendVenueLink(links, googleMapsAppUrl(venue), "Google Maps app");
  appendVenueLink(links, venue.organizerUrl2026 || venue.sourceUrl, "Organizer");
  appendVenueLink(links, venue.locationSource2026, "Source");
  if (links.childElementCount) container.append(links);
}

function appendVenueLink(container, href, label) {
  if (!href) return;
  const link = document.createElement("a");
  link.className = "venue-link";
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  container.append(link);
}

function formatCurrentVenue(venue) {
  if (!venue.venue2026) return venue.address2026;
  if (!venue.address2026) return venue.venue2026;
  if (venue.address2026.toLocaleLowerCase().startsWith(venue.venue2026.toLocaleLowerCase())) {
    return venue.address2026;
  }
  return `${venue.venue2026} — ${venue.address2026}`;
}

function focusVenue(venue) {
  activeVenueId = venue.id;
  if (venue.marker) {
    map.flyTo([venue.lat, venue.lon], Math.max(map.getZoom(), 14));
    venue.marker.openPopup();
  } else if (venue.hasCurrentCoordinates) {
    map.flyTo([venue.lat, venue.lon], Math.max(map.getZoom(), 14));
  }
  renderVenues();
}

function renderVenues() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matches = venueRecords.filter((venue) => venue.name.toLocaleLowerCase().includes(query));
  venueList.replaceChildren();

  for (const venue of matches) {
    const item = document.createElement("li");
    const card = document.createElement("article");
    card.className = "venue-card";
    card.setAttribute("aria-current", String(venue.id === activeVenueId));

    const button = document.createElement("button");
    button.className = "venue-card-main";
    button.type = "button";

    const name = document.createElement("span");
    name.className = "venue-name";
    name.textContent = venue.name;
    const meta = document.createElement("span");
    meta.className = "venue-meta";
    meta.textContent = venue.status2026 === "official"
      ? "2026 location · official source"
      : venue.status2026 === "third-party"
        ? "2026 location · third-party source"
        : venue.marker
          ? "2023 KML pin · 2026 location unverified"
          : "2026 listing · unverified";
    button.append(name, meta);
    if (venue.address2026 || venue.venue2026) {
      const address = document.createElement("span");
      address.className = "venue-address";
      address.textContent = formatCurrentVenue(venue);
      button.append(address);
    }
    button.addEventListener("click", () => focusVenue(venue));
    card.append(button);
    appendVenueLinks(card, venue);
    item.append(card);
    venueList.append(item);
  }

  resultCount.textContent = `${matches.length} of ${venueRecords.length} locations`;
}

function parseLocationsCsv(csv) {
  const rows = parseCsvRows(csv);
  const headers = rows.shift();
  if (!headers) {
    throw new Error("The locations CSV is empty.");
  }

  const records = rows.map((values) => Object.fromEntries(
    headers.map((header, index) => [header, values[index] ?? ""])
  ));

  for (const [index, record] of records.entries()) {
    const historicalLat = record.Latitude2023 ? Number(record.Latitude2023) : NaN;
    const historicalLon = record.Longitude2023 ? Number(record.Longitude2023) : NaN;
    const currentLat = record.Latitude2026 ? Number(record.Latitude2026) : NaN;
    const currentLon = record.Longitude2026 ? Number(record.Longitude2026) : NaN;
    const hasCurrentCoordinates = Number.isFinite(currentLat) && Number.isFinite(currentLon);
    const hasHistoricalCoordinates = Number.isFinite(historicalLat) && Number.isFinite(historicalLon);
    const hasCoordinates = hasCurrentCoordinates || hasHistoricalCoordinates;
    if (!record.Name || (!hasCoordinates && !record.MapUrl2026)) {
      console.warn(`Skipping CSV row ${index + 2}: missing name and map location.`);
      continue;
    }

    const venue = {
      id: `venue-${index}`,
      name: record.Name,
      lat: hasCurrentCoordinates ? currentLat : historicalLat,
      lon: hasCurrentCoordinates ? currentLon : historicalLon,
      hasCurrentCoordinates,
      status2026: record.Status2026 || "unverified",
      venue2026: record.Venue2026,
      address2026: record.Address2026,
      mapUrl2026: record.MapUrl2026,
      organizerUrl2026: record.OrganizerUrl2026,
      locationSource2026: record.LocationSource2026,
      sourceUrl: record.Source2023
    };

    if (hasCoordinates) {
      venue.marker = L.circleMarker([venue.lat, venue.lon], {
        radius: 7,
        color: hasCurrentCoordinates ? "#9a3412" : "#8a7d70",
        weight: 2,
        fillColor: hasCurrentCoordinates ? "#d97706" : "#c4b8a8",
        fillOpacity: hasCurrentCoordinates ? 0.9 : 0.55
      }).bindPopup(makePopup(venue)).addTo(venueLayer);
      venue.marker.on("click", () => {
        activeVenueId = venue.id;
        renderVenues();
      });
    }
    venueRecords.push(venue);
  }

  if (venueRecords.length === 0) {
    throw new Error("No valid locations were found in the CSV.");
  }

  renderVenues();
  if (venueLayer.getLayers().length > 0) {
    map.fitBounds(venueLayer.getBounds(), { padding: [24, 24] });
  }
}

async function loadLocations() {
  if (window.location.protocol === "file:") {
    throw new Error("Open this static site from a local web server or hosted URL; browsers block loading the KML directly from a file.");
  }
  const response = await fetch("puja-locations.csv");
  if (!response.ok) {
    throw new Error(`Could not load the locations CSV (HTTP ${response.status}).`);
  }
  parseLocationsCsv(await response.text());
}

function metroStationPopup(name, lineNames) {
  const content = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = name;
  const lines = document.createElement("div");
  lines.textContent = lineNames.length === 1
    ? `${lineNames[0]} Line`
    : `${lineNames.join(" & ")} lines`;
  content.append(title, lines);
  return content;
}

function drawMetroLines(geojson) {
  const lines = {
    type: "FeatureCollection",
    features: geojson.features.filter((feature) => feature.geometry.type === "LineString")
  };
  const lineOptions = { pane: "metro", interactive: false };
  L.geoJSON(lines, {
    ...lineOptions,
    style: { color: "#fffaf5", weight: 7, opacity: 0.92, lineCap: "round", lineJoin: "round" }
  }).addTo(map);
  L.geoJSON(lines, {
    ...lineOptions,
    style: (feature) => ({
      color: feature.properties.color,
      weight: 4,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round"
    })
  }).addTo(map);

  for (const feature of geojson.features) {
    if (feature.geometry.type !== "Point") continue;
    const [lon, lat] = feature.geometry.coordinates;
    const lineNames = feature.properties.lines;
    const interchange = lineNames.length > 1;
    L.circleMarker([lat, lon], {
      radius: interchange ? 6 : 4,
      color: "#fffaf5",
      weight: 2,
      fillColor: interchange ? "#2e2524" : feature.properties.color,
      fillOpacity: 1
    }).bindPopup(metroStationPopup(feature.properties.name, lineNames)).addTo(map);
  }
  venueLayer.bringToFront();
}

async function loadMetroLines() {
  const response = await fetch("metro-lines.geojson");
  if (!response.ok) {
    throw new Error(`Could not load metro lines (HTTP ${response.status}).`);
  }
  drawMetroLines(await response.json());
}

searchInput.addEventListener("input", renderVenues);
map.setView([12.9716, 77.5946], 11);
loadLocations().catch((error) => {
  console.error(error);
});
loadMetroLines().catch((error) => {
  console.error(error);
});
