# Heritage Map

Single-page map of **visitable** heritage places built **before 1950** across Indian cities (Bengaluru, Kolkata, and more later). All cities share one map: switching cities flies the camera; zooming out keeps every marker visible.

Published at `/heritage-map`. Legacy URL `/blr-heritage-map` redirects via Hugo content (`content/blr-heritage-map/`) to `/heritage-map/?city=blr`.

## View locally

```bash
cd static/heritage-map
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/) (not `/heritage-map/` — that path is only on the deployed site).

- `?city=all` — overview of every city (default)
- `?city=blr` — fly to Bengaluru
- `?city=kol` — fly to Kolkata

## Shared eras

Filters use one era scheme for all cities:

1. Ancient & medieval (pre-16th c.)
2. Early modern (16th–18th c.)
3. High colonial (19th c.)
4. Late colonial (to 1947)

## Add a city

1. Add an entry to `city-config.js` (`label`, `mapCenter`, `mapZoom`, aliases).
2. Add `sites-<id>.js` with a `SITES_<ID>` array using the shared era keys above.
3. Register the array in `sites.js` under `HERITAGE_BY_CITY`.
4. Load the script in `index.html`.

## Stack

- [Leaflet](https://leafletjs.com/) + OpenStreetMap (CDN)
