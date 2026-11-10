document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
  } else {
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

  document.querySelectorAll(".more").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Read less" : "Read more";
      panel.hidden = !open;
      if (open) mountVideo(panel);
      else panel.querySelector(".work-video")?.remove();
    });
  });

  animateFloor(reduceMotion);
});

function mountVideo(panel) {
  const id = panel.dataset.video;
  if (!id || panel.querySelector(".work-video")) return;
  const holder = document.createElement("div");
  holder.className = "work-video";
  const frame = document.createElement("iframe");
  frame.src = `https://www.youtube.com/embed/${id}?rel=0`;
  frame.title = "Project demo video";
  frame.allow = "fullscreen; picture-in-picture";
  frame.allowFullscreen = true;
  frame.loading = "lazy";
  holder.appendChild(frame);
  panel.prepend(holder);
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
