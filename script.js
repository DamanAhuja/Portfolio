document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
      });
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 120;
    let activeId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) activeId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });

  setupTabs({
    list: document.querySelector(".case-list"),
    onSelect: (tab) => {
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      document.querySelectorAll(".case").forEach((panelNode) => {
        const active = panelNode === panel;
        panelNode.classList.toggle("is-active", active);
        panelNode.hidden = !active;
      });
      mountMedia(panel);
    }
  });

  const lab = document.querySelector("[data-lab]");
  if (lab) {
    const stage = lab.querySelector(".lab-stage");
    const frame = stage.querySelector("iframe");
    setupTabs({
      list: lab.querySelector(".lab-tabs"),
      onSelect: (tab) => {
        const title = tab.dataset.title || "Lab demo";
        if (tab.dataset.still) {
          frame.removeAttribute("src");
          frame.hidden = true;
          let still = stage.querySelector("img");
          if (!still) {
            still = document.createElement("img");
            stage.appendChild(still);
          }
          still.hidden = false;
          still.src = tab.dataset.still;
          still.alt = title;
          return;
        }
        const still = stage.querySelector("img");
        if (still) still.hidden = true;
        frame.hidden = false;
        frame.title = title;
        if (frame.dataset.loaded !== tab.dataset.src) {
          frame.src = tab.dataset.src;
          frame.dataset.loaded = tab.dataset.src;
        }
      }
    });
    const firstLab = lab.querySelector('[aria-selected="true"]');
    if (firstLab) {
      frame.src = firstLab.dataset.src;
      frame.dataset.loaded = firstLab.dataset.src;
    }
  }

  animateFloor(reduceMotion);
});

function setupTabs({ list, onSelect }) {
  if (!list) return;
  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));

  const select = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    onSelect(tab);
    const panelId = tab.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (panel && window.matchMedia("(max-width: 980px)").matches) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => select(tab));
  });

  list.addEventListener("keydown", (event) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    const horizontal = list.getAttribute("aria-orientation") !== "vertical";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
    let target = null;
    if (event.key === nextKey) target = tabs[(current + 1) % tabs.length];
    if (event.key === prevKey) target = tabs[(current - 1 + tabs.length) % tabs.length];
    if (event.key === "Home") target = tabs[0];
    if (event.key === "End") target = tabs[tabs.length - 1];
    if (!target) return;
    event.preventDefault();
    target.focus();
    select(target);
  });
}

function mountMedia(panel) {
  if (!panel) return;
  const frame = panel.querySelector("iframe[data-src]");
  if (frame && !frame.getAttribute("src")) frame.src = frame.dataset.src;
}

function animateFloor(reduceMotion) {
  const buggies = Array.from(document.querySelectorAll(".buggy"));
  if (!buggies.length) return;

  const routes = new Map();
  buggies.forEach((buggy) => {
    const path = document.getElementById(buggy.dataset.route);
    if (!path) return;
    routes.set(buggy, { path, length: path.getTotalLength() });
    place(buggy, Number(buggy.dataset.start || 0));
  });

  if (reduceMotion) return;

  const started = performance.now();
  const frame = (now) => {
    const elapsed = now - started;
    buggies.forEach((buggy) => {
      const speed = Number(buggy.dataset.speed || 0.0001);
      const start = Number(buggy.dataset.start || 0);
      place(buggy, (start + elapsed * speed) % 1);
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  function place(buggy, progress) {
    const route = routes.get(buggy);
    if (!route) return;
    const point = route.path.getPointAtLength(progress * route.length);
    buggy.setAttribute("cx", point.x);
    buggy.setAttribute("cy", point.y);
  }
}