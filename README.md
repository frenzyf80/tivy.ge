# tivy.ge — ლიფტ მედია

Static marketing site for **ტივი / tivy.ge**, an elevator-screen advertising network in Tbilisi.
The visual system is derived from the Terracon (ტერაკონი ხეივანი) brandbook, 2026-09-02 edition.

## Brand tokens (from the brochure)

| Token      | Hex       | Use                                  |
|------------|-----------|--------------------------------------|
| cream      | `#F2E6C8` | page ground, hero, cover             |
| terracotta | `#B45740` | primary CTA, pills, accents          |
| navy       | `#153144` | dark spreads, outlines, wordmark ink |
| olive      | `#898B61` | stats bar, icons, secondary slabs    |
| paper      | `#F1EFEA` | textured off-white content spreads   |

- **Headings:** Noto Sans Georgian 800, uppercase (Mtavruli caps, like the brochure)
- **Body:** FiraGO (same family terracon.ge ships; OFL-licensed, bundled in `assets/fonts/`)
- **Motifs:** diagonal colour slabs (`.slab` + `clip-path`), vertical tricolour stripe (`.stripe`),
  arch-shaped image frames (`.arch`), rounded outline cards with circular olive icons (`.card`),
  the olive stats bar (`.stats-bar`), pill badge under the wordmark (`.logo .tag`).

## Structure

```
index.html        single page, Georgian by default, English via data-en attributes
css/styles.css    design system + sections
js/main.js        language toggle, mobile nav, scroll reveal, form → mailto
js/locations.js   list of installed screens (lat/lng, address, status) → feeds the map
js/map.js         Leaflet map (OpenStreetMap tiles, brand-coloured pins)
assets/           logo mark, favicon, FiraGO woff2
```

## Adding a screen to the map

Open `js/locations.js` and append an object. Coordinates come from Google Maps
(right-click → the numbers at the top of the menu). `status` is `"active"` or `"soon"`.

## Run locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.

## Before going live

- Replace the placeholder phone number `+995 32 2 00 00 00` in `index.html` (appears 2×).
- Point the contact form at a real endpoint (Formspree / Netlify Forms / your API) instead of `mailto:` — see `js/main.js`.
- Packages/prices live in the `#packages` section of `index.html`; audience figures in `#audience`. Update both together if the model changes.
- Optionally replace the CSS screen mock-up in the hero with a real photo of the installed frame.
