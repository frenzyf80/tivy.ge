/* tivy.ge — language toggle, mobile nav, scroll reveal, contact form, screen clock */
(function () {
  "use strict";

  const LANG_KEY = "tivy-lang";
  const html = document.documentElement;
  let current = "ka";

  /* ---- Language toggle (GE default, EN via data-en attributes) ---------- */
  function collect() {
    document.querySelectorAll("[data-en]").forEach((el) => { if (!("ge" in el.dataset)) el.dataset.ge = el.innerHTML; });
    document.querySelectorAll("[data-en-placeholder]").forEach((el) => { if (!("gePlaceholder" in el.dataset)) el.dataset.gePlaceholder = el.getAttribute("placeholder") || ""; });
  }

  function apply() {
    const en = current === "en";
    document.querySelectorAll("[data-en]").forEach((el) => { el.innerHTML = en ? el.dataset.en : el.dataset.ge; });
    document.querySelectorAll("[data-en-placeholder]").forEach((el) => { el.setAttribute("placeholder", en ? el.dataset.enPlaceholder : el.dataset.gePlaceholder); });
    html.setAttribute("lang", en ? "en" : "ka");
    document.querySelectorAll(".lang-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === current)));
    document.title = en ? "tivy.ge — Advertising on elevator screens" : "tivy.ge — შენი რეკლამა ლიფტის მონიტორზე";
  }

  function setLang(lang) {
    current = lang;
    collect(); apply();
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* private mode */ }
  }

  collect();
  document.querySelectorAll(".lang-switch button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  try { if (localStorage.getItem(LANG_KEY) === "en") setLang("en"); } catch (_) { /* ignore */ }
  // map.js adds list items after load
  document.addEventListener("tivy:translatables-added", () => { collect(); apply(); });

  /* ---- Mobile navigation ------------------------------------------------- */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---- Reveal on scroll -------------------------------------------------- */
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: 0.1 });
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Contact form (static site → mailto; swap for a real endpoint) ---- */
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const to = form.dataset.mailto || "info@tivy.ge";
      const subject = encodeURIComponent("tivy.ge — " + (data.get("role") || "") + " — " + (data.get("company") || data.get("name") || ""));
      const body = encodeURIComponent(Array.from(data.entries()).map(([k, v]) => k + ": " + v).join("\n"));
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      form.classList.add("sent");
    });
    // "Register building" buttons preselect the role
    document.querySelectorAll("[data-role]").forEach((a) => a.addEventListener("click", () => {
      const r = form.querySelector('input[name="role"][value="' + a.dataset.role + '"]');
      if (r) r.checked = true;
    }));
  }

  /* ---- Clock on the screen mock-up -------------------------------------- */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = () => { const d = new Date(); clock.textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };
    tick(); setInterval(tick, 15000);
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
