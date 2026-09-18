# Bengaluru Heritage Map

Single-page map of **visitable** heritage places in and around Bengaluru built **before 1950**.

No Node or npm required—plain HTML, CSS, and JavaScript.

## View locally

Browsers block map tiles on `file://` URLs, so serve the folder once:

```bash
cd /Users/bdebnath/projects/blr-heritage-map
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

(`php -S localhost:8080` or any static file server works the same way.)

## Deploy

Upload these files to any static host (GitHub Pages, Netlify, S3, etc.):

- `index.html`
- `styles.css`
- `sites.js`
- `app.js`

## Add places

Edit `sites.js`. Each entry needs coordinates, `builtYear` before 1950, visit notes, and at least one source URL (Wikipedia, [INTACH Bengaluru](https://www.intachblr.org/), ASI, etc.).

Chola-era temples cross-check: [List of Chola temples in Bengaluru](https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore).

## Stack

- [Leaflet](https://leafletjs.com/) + OpenStreetMap (loaded from CDN)

## Disclaimer

Curated starter set, not an official ASI listing. Confirm hours and etiquette at religious sites before visiting.
