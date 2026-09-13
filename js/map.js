/* Tbilisi screen map — Leaflet + CARTO light tiles, markers from js/locations.js */
(function () {
  "use strict";
  const el = document.getElementById("map");
  if (!el || typeof L === "undefined") return;

  const locations = window.TIVY_LOCATIONS || [];
  const isEn = () => document.documentElement.lang === "en";

  const map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true
  }).setView([41.7151, 44.8271], 11); // Tbilisi

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const pin = (status) => status === "soon" ? L.divIcon({
    className: "tivy-pin soon",
    html: '<svg viewBox="0 0 40 52" width="26" height="34"><path d="M20 51C20 51 4 31 4 18a16 16 0 0 1 32 0c0 13-16 33-16 33z" fill="currentColor"/><circle cx="20" cy="18" r="6" fill="#F2E6C8"/></svg>',
    iconSize: [26, 34],
    iconAnchor: [13, 33],
    popupAnchor: [0, -30]
  }) : L.divIcon({
    className: "tivy-pin " + status,
    html: '<svg viewBox="0 0 40 52" width="40" height="52"><path d="M20 51C20 51 4 31 4 18a16 16 0 0 1 32 0c0 13-16 33-16 33z" fill="currentColor"/><g fill="none" stroke="#F2E6C8" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" transform="translate(10 4) scale(.31)"><path d="M27 10 L49 38 L27 38 Z" fill="#F2E6C8" stroke="none"/><path d="M25 8v34"/><path d="M10 44h44" stroke-width="4"/><circle cx="14" cy="50.5" r="3.4"/><circle cx="32" cy="50.5" r="3.4"/><circle cx="50" cy="50.5" r="3.4"/></g></svg>',
    iconSize: [40, 52],
    iconAnchor: [20, 50],
    popupAnchor: [0, -46]
  });

  const markers = [];
  locations.forEach((loc) => {
    const m = L.marker([loc.lat, loc.lng], { icon: pin(loc.status) }).addTo(map);
    m.bindPopup(() => {
      const en = isEn();
      const title = en ? (loc.titleEn || loc.title) : loc.title;
      const district = en ? (loc.districtEn || loc.district) : loc.district;
      const status = loc.status === "active" ? (en ? "Active" : "აქტიური") : (en ? "Coming soon" : "მალე");
      const screens = loc.screens ? (en ? loc.screens + " screen" + (loc.screens > 1 ? "s" : "") : loc.screens + " მონიტორი") : "";
      return '<div class="tivy-popup"><strong>' + title + "</strong><span>" + district + (screens ? " · " + screens : "") + '</span><em class="' + loc.status + '">' + status + "</em>" +
        (loc.maps ? '<a href="' + loc.maps + '" target="_blank" rel="noopener">Google Maps ↗</a>' : "") + "</div>";
    });
    markers.push(m);
  });

  if (markers.length) {
    const group = L.featureGroup(markers);
    if (markers.length === 1) map.setView(group.getBounds().getCenter(), 13);
    else map.fitBounds(group.getBounds().pad(0.12));
  }

  // Location list next to the map: installed screens only
  const list = document.getElementById("location-list");
  if (list) {
    list.innerHTML = "";
    locations.filter((l) => l.status === "active").forEach((loc) => {
      const li = document.createElement("li");
      li.className = "loc active";
      li.innerHTML = "<strong>" + loc.title + "</strong><span>" + loc.district + "</span>";
      li.dataset.en = "<strong>" + (loc.titleEn || loc.title) + "</strong><span>" + (loc.districtEn || loc.district) + "</span>";
      li.addEventListener("click", () => {
        map.setView([loc.lat, loc.lng], 15, { animate: true });
        markers[locations.indexOf(loc)].openPopup();
      });
      list.appendChild(li);
    });
    document.dispatchEvent(new CustomEvent("tivy:translatables-added"));
  }
  const countActive = document.getElementById("count-active");
  const countSoon = document.getElementById("count-soon");
  if (countActive) countActive.textContent = String(locations.filter((l) => l.status === "active").reduce((n, l) => n + (l.screens || 1), 0));
  if (countSoon) countSoon.textContent = String(locations.filter((l) => l.status === "soon").length);

  // Leaflet needs a nudge if the container was hidden/animated on load
  setTimeout(() => map.invalidateSize(), 400);
  window.addEventListener("resize", () => map.invalidateSize());
})();
