"use strict";

const map = L.map("map", { scrollWheelZoom: true });
const venueLayer = L.featureGroup().addTo(map);
const venueList = document.querySelector("#venue-list");
const searchInput = document.querySelector("#venue-search");
const resultCount = document.querySelector("#result-count");
const status = document.querySelector("#status");
const venueRecords = [];
let activeVenueId = null;

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
      : "This marker is the original 2023 KML coordinate; use the linked 2026 venue map for the current destination.";
  content.append(warning);

  if (venue.venue2026 || venue.address2026) {
    const address = document.createElement("p");
    address.className = "popup-address";
    address.textContent = formatCurrentVenue(venue);
    content.append(address);
  }

  const links = document.createElement("div");
  links.className = "popup-links";
  const mapUrl = venue.mapUrl2026;
  if (mapUrl) {
    const mapLink = document.createElement("a");
    mapLink.href = mapUrl;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    mapLink.textContent = "2026 venue map";
    links.append(mapLink);
  } else if (!venue.hasCurrentCoordinates) {
    const directions = document.createElement("a");
    directions.href = `https://www.openstreetmap.org/?mlat=${venue.lat}&mlon=${venue.lon}#map=17/${venue.lat}/${venue.lon}`;
    directions.target = "_blank";
    directions.rel = "noopener noreferrer";
    directions.textContent = "View 2023 KML pin";
    links.append(directions);
  }

  if (venue.organizerUrl2026 || venue.sourceUrl) {
    const source = document.createElement("a");
    source.href = venue.organizerUrl2026 || venue.sourceUrl;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = venue.organizerUrl2026 ? "2026 organizer source" : "Organizer link from KML";
    links.append(source);
  }

  if (venue.locationSource2026) {
    const source = document.createElement("a");
    source.href = venue.locationSource2026;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "Location evidence";
    links.append(source);
  }

  content.append(links);
  return content;
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
  } else if (venue.mapUrl2026) {
    window.open(venue.mapUrl2026, "_blank", "noopener,noreferrer");
  }
  renderVenues();
}

function renderVenues() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matches = venueRecords.filter((venue) => venue.name.toLocaleLowerCase().includes(query));
  venueList.replaceChildren();

  for (const venue of matches) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "venue-card";
    button.type = "button";
    button.setAttribute("aria-current", String(venue.id === activeVenueId));

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
    if (venue.mapUrl2026 && !venue.marker) {
      const mapLabel = document.createElement("span");
      mapLabel.className = "venue-map-hint";
      mapLabel.textContent = venue.status2026 === "unverified"
        ? "Search this venue on the map ↗"
        : "Open the 2026 venue map ↗";
      button.append(mapLabel);
    }
    button.addEventListener("click", () => focusVenue(venue));
    item.append(button);
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
        color: hasCurrentCoordinates ? "#76283a" : "#66716b",
        weight: 2,
        fillColor: hasCurrentCoordinates ? "#bd5966" : "#a9b2ad",
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
  const withCurrentLocations = venueRecords.filter((venue) => venue.status2026 !== "unverified").length;
  const withCurrentCoordinates = venueRecords.filter((venue) => venue.hasCurrentCoordinates).length;
  status.textContent = `${venueRecords.length} pujas loaded; ${withCurrentLocations} have 2026 venue details and ${withCurrentCoordinates} have 2026 map pins. Historic pins are clearly marked.`;
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

searchInput.addEventListener("input", renderVenues);
map.setView([12.9716, 77.5946], 11);
loadLocations().catch((error) => {
  console.error(error);
  status.textContent = error.message;
});
