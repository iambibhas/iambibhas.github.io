# Heritage Map

Single-page map of **visitable** heritage places built **before 1950**, with a city selector (Bengaluru, Kolkata, and more later).

Published at `/heritage-map`. Legacy URL `/blr-heritage-map` redirects via Hugo content (`content/blr-heritage-map/`) to `/heritage-map/?city=blr`.

## View locally

```bash
cd static/heritage-map
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/) (not `/heritage-map/` — that path is only on the deployed site). Use `?city=kol` for Kolkata.

## Add a city

1. Add an entry to `city-config.js` (`eraLabels`, `eraColors`, map center).
2. Add `sites-<id>.js` with a `SITES_<ID>` array.
3. Register the array in `sites.js` under `HERITAGE_BY_CITY`.
4. Load the script in `index.html`.

## Stack

- [Leaflet](https://leafletjs.com/) + OpenStreetMap (CDN)
