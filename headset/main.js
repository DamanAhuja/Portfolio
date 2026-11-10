import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

window.__headset = true;

const SIGNAL = 0xd6ff4a;
const SIGNAL_CSS = "#d6ff4a";
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

const PROJECTS = [
  {
    title: "Smart Buggy",
    org: "GMR Group · Terminal 3, IGI Airport",
    kind: "Airport systems",
    line: "Android apps for a buggy service that carries passengers with reduced mobility.",
    sketch: "buggy",
    body: [
      "Smart Buggy is four apps: a passenger kiosk, a driver tablet, a dispatch engine, and an admin portal. I build the kiosk and the driver tablet in Kotlin and Jetpack Compose.",
      "The tablet publishes indoor position, battery, and seats over MQTT every second. A buggy with a stale heartbeat, a low battery, or a charging state drops out of the pool. Riders headed to the same pier share a vehicle, up to five seats, before an idle buggy is called.",
      "I also built an ARCore proof of concept that checked the airport’s vendor-led AR wayfinding flow before rollout."
    ],
    stack: "Kotlin · Jetpack Compose · Node.js · MQTT · PostgreSQL · ARCore · Situm"
  },
  {
    title: "Carbon",
    org: "Tap4Technologies · remote",
    kind: "Integrations",
    line: "Bringing Mailchimp and Salesforce data into an AI business OS.",
    sketch: "bridge",
    body: [
      "Carbon is an AI business OS for smaller companies. I researched how Salesforce and Mailchimp model users, core objects, OAuth, and rate limits, and wrote that up across three pull requests.",
      "The first slice copies Mailchimp audiences into Carbon contacts, one object in one direction, and has to survive expired tokens, rate limits, and partial syncs."
    ],
    stack: "OAuth · REST · Salesforce · Mailchimp · Node.js"
  },
  {
    title: "XRchitect",
    org: "XRVisionLabs · on the Meta Store",
    kind: "Multiplayer VR",
    line: "Several people redesign the same room together, in VR.",
    video: "nA4qaKeVBL8",
    body: [
      "A collaborative VR interior design app. Several people edit the same room, and Photon keeps that shared state in sync. Used for client walkthroughs and for teaching."
    ],
    stack: "Meta XR SDK · Photon · Unity",
    links: [{ label: "View on the Meta Store", href: "https://www.meta.com/en-gb/experiences/xrchitect/8001533676569691/" }]
  },
  {
    title: "Combat-XR",
    org: "XRVisionLabs",
    kind: "VR training",
    line: "Defence drills turned into scenarios a team can rerun.",
    video: "hwM7kepj4RM",
    body: [
      "A tactical VR trainer that turns real defence drills into repeatable scenarios. AI handles scenario management, and the interaction layer is Unity’s XR Interaction Toolkit."
    ],
    stack: "Unity · XR Interaction Toolkit"
  },
  {
    title: "TeleTwin",
    org: "Telecom digital twin",
    kind: "Computer vision",
    line: "Inspect a telecom tower without climbing it.",
    video: "5XzGIZFhy10",
    body: [
      "A live twin of telecom tower assets. A YOLO pipeline watches the scene and a PostgreSQL stream keeps the operational record, so a remote team can inspect without a site visit."
    ],
    stack: "Python · YOLO · PostgreSQL"
  },
  {
    title: "AR Navigation",
    org: "Personal project",
    kind: "WebXR",
    line: "Point a phone, follow the path. No app to install.",
    sketch: "path",
    body: [
      "Marker-based wayfinding in the browser. The path is drawn over the physical room with WebXR, so a first-time visitor does not install anything."
    ],
    stack: "WebXR · SVG · JavaScript"
  },
  {
    title: "TopologyXR",
    org: "XRVisionLabs · on the Meta Store",
    kind: "VR / MR",
    line: "Plan a data center from scanned hardware.",
    video: "ejV5lLngW60",
    body: [
      "A data-center planning space built from scanned infrastructure. Layout generation is AI-assisted, and the assets are detailed enough to review a room in a headset."
    ],
    stack: "VR / MR · photogrammetry · AI-assisted layout",
    links: [{ label: "View on the Meta Store", href: "https://www.meta.com/en-gb/experiences/topologyxr/8754157244597877/" }]
  },
  {
    title: "Motion Tracking",
    org: "University of Delhi research",
    kind: "Research",
    line: "Azure Kinect skeletons driving full-body avatars at 30 fps.",
    image: "../Pose.jpeg",
    video: "DaCBIIq7UjI",
    body: [
      "Real-time pipelines for Azure Kinect skeletal data at 30 fps, with sensor fusion driving full-body avatars. Prototypes in Unity and Unreal, plus multi-Kinect capture for multi-angle holograms."
    ],
    stack: "Azure Kinect SDK · Unity · Unreal Engine"
  },
  {
    title: "TeleAttendance",
    org: "Personal project",
    kind: "Automation",
    line: "A Telegram bot that removed manual attendance entry.",
    image: "../teleattendance.jpg",
    body: [
      "An attendance pipeline with a Telegram bot in front, a REST API in the middle, and a database behind it. The manual entry step is gone, and logging happens as messages arrive."
    ],
    stack: "Node.js · Telegram Bot API · REST · SQL",
    links: [{ label: "Open the GitHub repo", href: "https://github.com/DamanAhuja/TeleBot" }]
  }
];

const AUDIENCES = {
  software: {
    resume: "Daman_Ahuja_Software_Developer.pdf",
    order: ["Smart Buggy", "Carbon", "TeleAttendance", "TeleTwin", "XRchitect", "TopologyXR", "AR Navigation", "Combat-XR", "Motion Tracking"]
  },
  xr: {
    resume: "Daman_Ahuja_AR_VR_Developer.pdf",
    order: ["XRchitect", "TopologyXR", "Combat-XR", "Motion Tracking", "AR Navigation", "TeleTwin", "Smart Buggy", "Carbon", "TeleAttendance"]
  },
  ai: {
    resume: "Daman_Ahuja_AI_ML.pdf",
    order: ["TeleTwin", "Motion Tracking", "Smart Buggy", "TopologyXR", "Combat-XR", "Carbon", "TeleAttendance", "AR Navigation", "XRchitect"]
  },
  product: {
    resume: "Daman_Ahuja_Product_Manager.pdf",
    order: ["Smart Buggy", "XRchitect", "TopologyXR", "Carbon", "TeleAttendance", "TeleTwin", "AR Navigation", "Combat-XR", "Motion Tracking"]
  }
};

const audience = (() => {
  const tag = new URLSearchParams(location.search).get("for");
  if (AUDIENCES[tag]) {
    sessionStorage.setItem("audience", tag);
    return AUDIENCES[tag];
  }
  return AUDIENCES[sessionStorage.getItem("audience")] || AUDIENCES.xr;
})();
PROJECTS.sort((a, b) => audience.order.indexOf(a.title) - audience.order.indexOf(b.title));
document.getElementById("resume-link").href = `../Resumes/${audience.resume}`;

const RECORD = [
  {
    time: "Jun 2026 — now",
    title: "AI and Automation Intern",
    org: "GMR Group, Smart Airport City",
    line: "Smart Buggy at Terminal 3, IGI Airport: the Android apps, the MQTT telemetry loop, and an ARCore wayfinding proof of concept.",
    exhibit: "buggy",
    pin: "GMR"
  },
  {
    time: "Sep 2026 — now",
    title: "Software Engineering Intern",
    org: "Tap4Technologies, remote",
    line: "Carbon: Salesforce and Mailchimp research, then the first sync from Mailchimp audiences into Carbon contacts.",
    exhibit: "bridge",
    pin: "Tap4"
  },
  {
    time: "Feb 2024 — May 2026",
    title: "VR Development Intern",
    org: "University of Delhi",
    line: "Azure Kinect tracking at 30 fps and full-body avatars. On the pedestal: a photogrammetry scan of a 310 server from the lab.",
    exhibit: "scan",
    pin: "DU"
  },
  {
    time: "Feb 2024 — Oct 2025",
    title: "Founding member and CTO",
    org: "XRVisionLabs",
    line: "A six-person team across two client projects and three releases, delivered on time.",
    exhibit: "headset",
    pin: "XRVL"
  },
  {
    time: "Jan 2024 — Aug 2025",
    title: "Game developer",
    org: "AltReality Labs",
    line: "Three physics simulations shipped in Unity: archery, bowling, and road crossing.",
    exhibit: "target",
    pin: "AltReality"
  },
  {
    time: "Aug 2023 — Jul 2024",
    title: "Data Management Head",
    org: "Placement Cell, University of Delhi",
    line: "The student and alumni databases behind placement and internship drives.",
    exhibit: "database",
    pin: "Placement"
  }
];

const FUN = {
  music: {
    kicker: "Off the clock · Music",
    title: "On repeat",
    intro: "What plays while the build runs.",
    artists: [
      { name: "Seedhe Maut", color: "#d6ff4a" },
      { name: "Nanku", color: "#ff8a5b" },
      { name: "Eminem", color: "#5ac8fa" }
    ]
  },
  games: {
    kicker: "Off the clock · Games & sports",
    title: "Games & sports",
    intro: "On the phone, on the pitch, or on the TV."
  },
  travel: {
    kicker: "Off the clock · Travel",
    title: "Anywhere works",
    intro: "No list of places. Just pick a kind of place and I’m in.",
    passes: [
      { name: "Mountains", code: "MTN", gate: "M1", seat: "Window, obviously" },
      { name: "Beaches", code: "BCH", gate: "B4", seat: "Closest to the sea" },
      { name: "Deserts", code: "DST", gate: "D7", seat: "Under the stars" }
    ]
  }
};

const P = {
  ringStart: 0.3,
  ringEnd: 0.69,
  labStart: 0.7,
  recStart: 0.715,
  recEnd: 0.835,
  labEnd: 0.84,
  roomSwitch: 0.24,
  exitSwitch: 0.877,
  funEnd: 0.955
};

const LAPTOP_LINES = [
  ["$ git commit -m \"one last thing\"", "build passing ✓"],
  ["$ ./run --demo", "works on my machine ✓"],
  ["$ git push --force", "just kidding. never on main."],
  ["$ sleep 8h", "command not found"],
  ["$ chai --refill", "productivity +40%"],
  ["$ git blame", "it was me. it's always me."]
];

const REC_RADIUS = 2.5;
const REC_SPACING = 0.95;

const DESK_TOP = 0.9;
const DESK_BOUNDS = { minX: -1.27, maxX: 1.27, minZ: -0.97, maxZ: 0.28 };
const DESK_OBSTACLES = [
  { x: 0.05, z: -0.15, r: 0.3 },
  { x: 0.85, z: -0.5, r: 0.3 },
  { x: 0.42, z: 0.16, r: 0.1 },
  { x: 0.98, z: 0.02, r: 0.14 },
  { x: -0.7, z: -0.28, r: 0.09 },
  { x: -0.32, z: 0.1, r: 0.055 },
  { x: -0.95, z: -0.55, r: 0.14 }
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const range = (p, a, b) => clamp((p - a) / (b - a));
const pad = (n) => String(n).padStart(2, "0");

function band(p, a, b, c, d) {
  if (p <= a || p >= d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p <= c) return 1;
  return 1 - (p - c) / (d - c);
}

const fontsReady = Promise.race([
  Promise.all([
    document.fonts.load('600 64px "Fraunces"'),
    document.fonts.load('400 26px "Outfit"'),
    document.fonts.load('500 22px "IBM Plex Mono"')
  ]),
  new Promise((resolve) => setTimeout(resolve, 3000))
]).catch(() => {});

const canvas = document.getElementById("scene");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (error) {
  showFallback("This browser has WebGL turned off.", "The headset scene needs WebGL. Turn on hardware acceleration, or write to me directly.");
  throw error;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarsePointer ? 1.5 : 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.01, 200);

const room = buildRoom();
const vr = buildVR();

const fade = document.getElementById("fade");
const vignette = document.getElementById("vignette");
const progressBar = document.getElementById("progress-bar");
const phaseLabel = document.getElementById("phase");
const beats = Array.from(document.querySelectorAll(".beat"));
const bootLines = Array.from(document.querySelectorAll("#boot li"));
const liftCaption = document.getElementById("lift-caption");
const hud = {
  index: document.getElementById("hud-index"),
  title: document.getElementById("hud-title"),
  org: document.getElementById("hud-org"),
  line: document.getElementById("hud-line"),
  open: document.getElementById("hud-open")
};

let target = 0;
let progress = 0;
let activeIndex = -1;
let hovered = null;
let lastPhase = "";
let hoveredProp = null;
const funTags = Array.from(document.querySelectorAll("[data-fun]"));
const pointer = new THREE.Vector2(-10, -10);
const raycaster = new THREE.Raycaster();
const clock = new THREE.Clock();

function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  target = max > 0 ? clamp(window.scrollY / max) : 0;
}

window.addEventListener("scroll", readScroll, { passive: true });
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  readScroll();
});

function jumpTo(p) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: p * max, behavior: "smooth" });
}

let autoScroll = 0;

function stopAutoScroll() {
  cancelAnimationFrame(autoScroll);
  autoScroll = 0;
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((type) => window.removeEventListener(type, stopAutoScroll));
}

function playTo(p, duration) {
  stopAutoScroll();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const from = window.scrollY;
  const to = p * max;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, from + (to - from) * eased);
    autoScroll = t < 1 ? requestAnimationFrame(step) : 0;
    if (!autoScroll) stopAutoScroll();
  };
  autoScroll = requestAnimationFrame(step);
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((type) => window.addEventListener(type, stopAutoScroll, { passive: true }));
}

let headsetPoke = -10;

document.querySelectorAll("[data-jump]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    jumpTo(Number(el.dataset.jump));
  });
});

function setPointer(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const inRingRange = (p) => p >= P.ringStart - 0.01 && p <= P.ringEnd + 0.004;
const propsActive = (p) => p < 0.04 || (p > P.exitSwitch + 0.02 && p < P.funEnd + 0.004);
const inVR = (p) => p >= P.roomSwitch && p < P.exitSwitch;

window.addEventListener("pointermove", setPointer);

canvas.addEventListener("click", (event) => {
  setPointer(event);
  raycaster.setFromCamera(pointer, camera);
  const p = progress;
  if (inVR(p)) {
    if (!inRingRange(p)) return;
    const hits = raycaster.intersectObjects(vr.panels.map((panel) => panel.front), false);
    if (hits.length) openProject(hits[0].object.userData.index);
    return;
  }
  if (!propsActive(p)) return;
  const hits = raycaster.intersectObjects(room.props.map((prop) => prop.hit), true);
  const key = hits.length ? hits[0].object.userData.prop : nearestProp(event.clientX, event.clientY, 44);
  if (!key) return;
  if (key === "lamp") toggleLamp();
  else if (key === "football" || key === "cricket") kickBall(key);
  else if (key === "laptop") room.props.find((prop) => prop.key === "laptop").group.userData.nextLine();
  else if (key === "headset") {
    if (p < P.roomSwitch) playTo(P.ringStart + 0.01, 5200);
    else headsetPoke = clock.elapsedTime;
  }
  else openFun(key);
});

funTags.forEach((tag) => {
  tag.addEventListener("click", () => openFun(tag.dataset.fun));
});

hud.open.addEventListener("click", () => {
  if (activeIndex >= 0) openProject(activeIndex);
});

readScroll();
progress = target;
setActive(0);
renderer.setAnimationLoop(frame);

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;
  progress += (target - progress) * (1 - Math.pow(0.002, dt));
  const p = progress;

  progressBar.style.width = `${(p * 100).toFixed(2)}%`;
  updateBeats(p);

  fade.style.opacity = Math.max(band(p, 0.19, 0.225, 0.255, 0.3), band(p, 0.85, 0.872, 0.882, 0.9)).toFixed(3);
  vignette.style.opacity = (range(p, 0.12, 0.2) * (p < P.roomSwitch ? 1 : 0)).toFixed(3);

  if (p < P.roomSwitch || p >= P.exitSwitch) {
    setFov(roomExitFov());
    hovered = null;
    updateRoom(p, time, dt);
    renderer.render(room.scene, camera);
    setPhase(p < P.roomSwitch ? (p < 0.09 ? "Desk" : "Putting it on") : p < P.funEnd + 0.005 ? "Off the clock" : "Contact");
    canvas.style.cursor = hoveredProp ? "pointer" : "";
  } else {
    hoveredProp = null;
    funTags.forEach((tag) => tag.classList.remove("is-hot"));
    setFov(window.innerWidth < window.innerHeight ? 72 : 55);
    updateVR(p, time, dt);
    renderer.render(vr.scene, camera);
  }
}

function roomExitFov() {
  const aspect = window.innerWidth / window.innerHeight;
  if (aspect >= 1.6) return 42;
  const halfH = Math.atan(Math.tan(THREE.MathUtils.degToRad(21)) * 1.6);
  return Math.round(Math.min(72, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(halfH) / aspect))));
}

function setFov(fov) {
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

function setPhase(label) {
  if (label === lastPhase) return;
  lastPhase = label;
  phaseLabel.textContent = label;
}

function updateBeats(p) {
  beats.forEach((beat) => {
    const from = Number(beat.dataset.from);
    const to = Number(beat.dataset.to);
    const edge = 0.012;
    const o = band(p, from - edge, from, to, to + edge);
    beat.style.opacity = o.toFixed(3);
    beat.classList.toggle("is-on", o > 0.02);
  });

  const lift = range(p, 0.09, 0.2);
  liftCaption.textContent = lift < 0.35 ? "Picking it up" : lift < 0.7 ? "Adjusting the straps" : "Lenses warming up";

  const boot = range(p, 0.225, 0.285);
  bootLines.forEach((line, i) => line.classList.toggle("shown", boot >= i / bootLines.length));
}

/* ---------- Room ---------- */

function buildRoom() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14110d);
  scene.fog = new THREE.Fog(0x14110d, 4, 11);

  scene.add(new THREE.HemisphereLight(0xffe9c7, 0x2a2016, 1.1));

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x2a241c, roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), new THREE.MeshStandardMaterial({ color: 0x3b3328, roughness: 1 }));
  wall.position.set(0, 5, -1.3);
  wall.receiveShadow = true;
  scene.add(wall);

  const wood = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.7 });
  const desk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 1.3), wood);
  desk.position.set(0, 0.87, -0.35);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);
  for (const [x, z] of [[-1.2, 0.2], [1.2, 0.2], [-1.2, -0.9], [1.2, -0.9]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.84, 0.06), wood);
    leg.position.set(x, 0.42, z);
    leg.castShadow = true;
    scene.add(leg);
  }

  const metal = new THREE.MeshStandardMaterial({ color: 0x1d1d1b, roughness: 0.4, metalness: 0.6 });
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.03, 32), metal);
  lampBase.position.set(-0.95, 0.915, -0.55);
  const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.62, 12), metal);
  lampArm.position.set(-0.88, 1.2, -0.5);
  lampArm.rotation.z = -0.25;
  const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.16, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x1d1d1b, roughness: 0.5, metalness: 0.5, side: THREE.DoubleSide }));
  lampHead.position.set(-0.78, 1.5, -0.45);
  lampHead.rotation.z = 0.9;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffe2b0 }));
  bulb.position.set(-0.74, 1.46, -0.43);
  scene.add(lampBase, lampArm, lampHead, bulb);

  const lamp = new THREE.SpotLight(0xffd59a, 28, 6, 0.85, 0.6, 1.6);
  lamp.position.set(-0.74, 1.46, -0.43);
  lamp.target.position.set(0.05, 0.9, -0.1);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.bias = -0.0004;
  scene.add(lamp, lamp.target);

  const fill = new THREE.PointLight(0xb8c8ff, 6, 9, 1.2);
  fill.position.set(2.2, 2.2, 2.5);
  scene.add(fill);

  const laptop = buildLaptop();
  laptop.position.set(0.85, 0.9, -0.5);
  laptop.rotation.y = -0.45;
  scene.add(laptop);

  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.11, 32), new THREE.MeshStandardMaterial({ color: 0xd6ff4a, roughness: 0.5 }));
  mug.position.set(-0.32, 0.955, 0.1);
  mug.castShadow = true;
  scene.add(mug);

  const headset = buildHeadset();
  scene.add(headset.group);

  const headphones = buildHeadphones();
  headphones.position.set(0.98, 0.9, 0.02);
  headphones.rotation.y = -0.55;
  const controller = buildController();
  controller.position.set(0.42, 0.9, 0.16);
  controller.rotation.y = 0.35;
  const globe = buildGlobe();
  globe.group.position.set(-0.7, 0.9, -0.28);
  scene.add(headphones, controller, globe.group);

  const balls = [
    buildBall("football", 0.055, -0.8, 0.12),
    buildBall("cricket", 0.036, -0.14, 0.2)
  ];
  balls.forEach((ball) => scene.add(ball.mesh));

  const lampHit = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
  lampHit.position.copy(lampHead.position);
  scene.add(lampHit);

  const props = [
    { key: "music", group: headphones, hit: headphones, anchor: new THREE.Vector3(0.98, 1.22, 0.02) },
    { key: "games", group: controller, hit: controller, anchor: new THREE.Vector3(0.42, 1.02, 0.16) },
    { key: "travel", group: globe.group, hit: globe.group, anchor: new THREE.Vector3(-0.7, 1.25, -0.28) },
    { key: "lamp", group: null, hit: lampHit, anchor: null },
    { key: "laptop", group: laptop, hit: laptop, anchor: null },
    { key: "headset", group: headset.group, hit: headset.group, anchor: null },
    ...balls.map((ball) => ({ key: ball.key, group: ball.mesh, hit: ball.mesh, anchor: null }))
  ];
  props.forEach((prop) => {
    prop.hit.traverse((obj) => { obj.userData.prop = prop.key; });
  });

  return { scene, headset, props, globe, balls, lamp, bulb, lampOn: true };
}

function buildBall(key, radius, x, z) {
  const ballCanvas = document.createElement("canvas");
  ballCanvas.width = 512;
  ballCanvas.height = 256;
  const ctx = ballCanvas.getContext("2d");
  if (key === "football") {
    ctx.fillStyle = "#f3efe4";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#1b1c19";
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        const cx = col * 86 + (row % 2) * 43 + 20;
        const cy = row * 64 + 32;
        ctx.beginPath();
        for (let k = 0; k < 5; k += 1) {
          const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
          ctx.lineTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 16);
        }
        ctx.fill();
      }
    }
  } else {
    ctx.fillStyle = "#8f1d1d";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#efe8d8";
    ctx.fillRect(0, 124, 512, 8);
    ctx.strokeStyle = "#efe8d8";
    ctx.lineWidth = 2;
    for (let sx = 4; sx < 512; sx += 12) {
      for (const sy of [114, 142]) {
        ctx.beginPath();
        ctx.moveTo(sx, sy - 4);
        ctx.lineTo(sx + 6, sy + 4);
        ctx.stroke();
      }
    }
  }
  const texture = new THREE.CanvasTexture(ballCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 20),
    new THREE.MeshStandardMaterial({ map: texture, roughness: key === "football" ? 0.6 : 0.35 })
  );
  mesh.position.set(x, DESK_TOP + radius, z);
  mesh.rotation.set(0.4, 0.8, 0.2);
  mesh.castShadow = true;
  return { key, mesh, r: radius, vel: new THREE.Vector3(), moving: false };
}

function kickBall(key) {
  const ball = room.balls.find((b) => b.key === key);
  if (!ball) return;
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.8 + Math.random() * 0.4;
  ball.vel.set(Math.cos(angle) * speed, 1.5 + Math.random() * 0.5, Math.sin(angle) * speed);
  ball.moving = true;
}

const rollAxis = new THREE.Vector3();

function updateBalls(dt) {
  room.balls.forEach((ball) => {
    if (!ball.moving) return;
    const { mesh, vel, r } = ball;
    const pos = mesh.position;
    vel.y -= 9.8 * dt;
    pos.addScaledVector(vel, dt);

    const floor = DESK_TOP + r;
    const grounded = pos.y <= floor;
    if (grounded) {
      pos.y = floor;
      if (vel.y < 0) vel.y = -vel.y * 0.55;
      if (vel.y < 0.2) vel.y = 0;
      const drag = Math.max(0, 1 - 1.6 * dt);
      vel.x *= drag;
      vel.z *= drag;
    }

    if (pos.x < DESK_BOUNDS.minX + r || pos.x > DESK_BOUNDS.maxX - r) {
      pos.x = clamp(pos.x, DESK_BOUNDS.minX + r, DESK_BOUNDS.maxX - r);
      vel.x *= -0.6;
    }
    if (pos.z < DESK_BOUNDS.minZ + r || pos.z > DESK_BOUNDS.maxZ - r) {
      pos.z = clamp(pos.z, DESK_BOUNDS.minZ + r, DESK_BOUNDS.maxZ - r);
      vel.z *= -0.6;
    }
    for (const o of DESK_OBSTACLES) {
      const dx = pos.x - o.x;
      const dz = pos.z - o.z;
      const d = Math.hypot(dx, dz);
      const min = o.r + r;
      if (d > 0 && d < min) {
        const nx = dx / d;
        const nz = dz / d;
        pos.x = o.x + nx * min;
        pos.z = o.z + nz * min;
        const vn = vel.x * nx + vel.z * nz;
        if (vn < 0) {
          vel.x -= 1.6 * vn * nx;
          vel.z -= 1.6 * vn * nz;
        }
      }
    }

    const flat = Math.hypot(vel.x, vel.z);
    if (flat > 0.001) {
      rollAxis.set(vel.z, 0, -vel.x).normalize();
      mesh.rotateOnWorldAxis(rollAxis, (flat * dt) / r);
    }
    if (grounded && vel.y === 0 && flat < 0.02) ball.moving = false;
  });
}

function buildHeadphones() {
  const group = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x1f2124, roughness: 0.45, metalness: 0.3 });
  const cushion = new THREE.MeshStandardMaterial({ color: 0x3a3b36, roughness: 1 });
  const accent = new THREE.MeshStandardMaterial({ color: SIGNAL, roughness: 0.4, emissive: SIGNAL, emissiveIntensity: 0.15 });

  const bandArc = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.013, 12, 48, Math.PI), shell);
  bandArc.position.y = 0.075;
  const padArc = new THREE.Mesh(new THREE.TorusGeometry(0.103, 0.01, 10, 32, Math.PI * 0.5), cushion);
  padArc.position.y = 0.075;
  padArc.rotation.z = Math.PI * 0.25;
  group.add(bandArc, padArc);

  for (const side of [-1, 1]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.035, 32), shell);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(side * 0.112, 0.05, 0);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.018, 32), cushion);
    pad.rotation.z = Math.PI / 2;
    pad.position.set(side * 0.088, 0.05, 0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.004, 8, 32), accent);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(side * 0.131, 0.05, 0);
    group.add(cup, pad, ring);
  }
  group.traverse((obj) => { if (obj.isMesh) obj.castShadow = true; });
  return group;
}

function buildController() {
  const group = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: 0xefe8d8, roughness: 0.5 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1d1e1b, roughness: 0.5 });

  const core = new THREE.Mesh(new RoundedBoxGeometry(0.17, 0.032, 0.085, 4, 0.014), body);
  core.position.y = 0.022;
  group.add(core);
  for (const side of [-1, 1]) {
    const grip = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.04, 6, 16), body);
    grip.rotation.x = Math.PI / 2;
    grip.rotation.y = side * 0.5;
    grip.position.set(side * 0.07, 0.02, 0.035);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.014, 20), dark);
    stick.position.set(side * 0.028, 0.044, 0.02);
    group.add(grip, stick);
  }
  const dpadA = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.006, 0.01), dark);
  const dpadB = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.006, 0.03), dark);
  dpadA.position.set(-0.058, 0.04, -0.012);
  dpadB.position.copy(dpadA.position);
  group.add(dpadA, dpadB);
  const colors = [SIGNAL, 0xff6b6b, 0x5ac8fa, 0xffd166];
  [[0.058, -0.024], [0.072, -0.01], [0.044, -0.01], [0.058, 0.004]].forEach(([x, z], i) => {
    const button = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0065, 0.0065, 0.006, 16),
      new THREE.MeshStandardMaterial({ color: colors[i], emissive: colors[i], emissiveIntensity: 0.25 })
    );
    button.position.set(x, 0.04, z);
    group.add(button);
  });
  group.traverse((obj) => { if (obj.isMesh) obj.castShadow = true; });
  return group;
}

function buildGlobe() {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x2a2b27, roughness: 0.4, metalness: 0.6 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.02, 32), metal);
  base.position.y = 0.01;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 12), metal);
  post.position.y = 0.055;
  group.add(base, post);

  const tilt = new THREE.Group();
  tilt.position.y = 0.2;
  tilt.rotation.z = 0.41;
  const meridian = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.005, 8, 64, Math.PI * 1.2), metal);
  meridian.rotation.z = -Math.PI * 0.1;
  tilt.add(meridian);

  const globeCanvas = document.createElement("canvas");
  globeCanvas.width = 1024;
  globeCanvas.height = 512;
  const ctx = globeCanvas.getContext("2d");
  ctx.fillStyle = "#10261f";
  ctx.fillRect(0, 0, 1024, 512);
  ctx.fillStyle = "#3b6b4f";
  for (const [x, y, rx, ry] of [[250, 170, 120, 80], [300, 330, 60, 110], [540, 150, 150, 70], [560, 300, 70, 100], [760, 180, 140, 90], [830, 370, 60, 40]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(214,255,74,0.35)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= 1024; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke(); }
  for (let y = 0; y <= 512; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke(); }
  ctx.fillStyle = SIGNAL_CSS;
  for (const [x, y] of [[730, 215], [745, 235], [560, 150], [280, 180], [820, 360]]) {
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(globeCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, 48, 32),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.55, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.15 })
  );
  tilt.add(sphere);
  group.add(tilt);
  group.traverse((obj) => { if (obj.isMesh) obj.castShadow = true; });
  return { group, sphere };
}

function toggleLamp() {
  room.lampOn = !room.lampOn;
  room.lamp.intensity = room.lampOn ? 28 : 0;
  room.bulb.material.color.set(room.lampOn ? 0xffe2b0 : 0x3a3428);
}

function buildLaptop() {
  const group = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x8a8d90, roughness: 0.35, metalness: 0.7 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.018, 0.34), shell);
  base.position.y = 0.009;
  base.castShadow = true;
  group.add(base);

  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 512;
  screenCanvas.height = 320;
  const ctx = screenCanvas.getContext("2d");
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  let line = 0;
  const drawScreen = () => {
    const [command, result] = LAPTOP_LINES[line % LAPTOP_LINES.length];
    ctx.fillStyle = "#10110e";
    ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = SIGNAL_CSS;
    ctx.fillRect(28, 32, 18, 18);
    ctx.fillStyle = "#f3efe4";
    ctx.font = "600 34px Georgia, serif";
    ctx.fillText("Daman Ahuja", 58, 50);
    ctx.fillStyle = "#b7b1a3";
    ctx.font = "20px monospace";
    ctx.fillText(command, 28, 110);
    ctx.fillStyle = SIGNAL_CSS;
    ctx.fillText(result, 28, 144);
    screenTex.needsUpdate = true;
  };
  drawScreen();
  group.userData.nextLine = () => {
    line += 1;
    drawScreen();
  };

  const lid = new THREE.Group();
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.012), shell);
  back.position.y = 0.16;
  back.castShadow = true;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.28), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  screen.position.set(0, 0.16, 0.007);
  lid.add(back, screen);
  lid.position.set(0, 0.018, -0.17);
  lid.rotation.x = -0.28;
  group.add(lid);
  return group;
}

function buildHeadset() {
  const group = new THREE.Group();
  const shellMat = new THREE.MeshPhysicalMaterial({ color: 0xefe8d8, roughness: 0.45, clearcoat: 0.35 });
  const shell = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.34, 0.28, 6, 0.09), shellMat);

  const visor = new THREE.Mesh(
    new RoundedBoxGeometry(0.56, 0.29, 0.05, 6, 0.04),
    new THREE.MeshPhysicalMaterial({ color: 0x090a08, roughness: 0.12, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.05 })
  );
  visor.position.z = 0.135;

  const sensorMat = new THREE.MeshStandardMaterial({ color: 0x2b2d2a, roughness: 0.3, metalness: 0.5 });
  for (const [x, y] of [[-0.21, 0.09], [0.21, 0.09], [-0.21, -0.09], [0.21, -0.09]]) {
    const sensor = new THREE.Mesh(new THREE.CircleGeometry(0.016, 24), sensorMat);
    sensor.position.set(x, y, 0.0265);
    visor.add(sensor);
  }

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, 0.01), new THREE.MeshBasicMaterial({ color: SIGNAL }));
  stripe.position.set(0, 0.155, 0.13);

  const foam = new THREE.Mesh(
    new RoundedBoxGeometry(0.54, 0.29, 0.09, 6, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x34352f, roughness: 1 })
  );
  foam.position.z = -0.16;

  const lensMat = new THREE.MeshStandardMaterial({ color: 0x050605, emissive: SIGNAL, emissiveIntensity: 0.08, roughness: 0.15, metalness: 0.2 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x111210, roughness: 0.6 });
  for (const x of [-0.085, 0.085]) {
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.064, 48), lensMat);
    lens.position.set(x, 0, -0.2065);
    lens.rotation.y = Math.PI;
    const rim = new THREE.Mesh(new THREE.RingGeometry(0.064, 0.08, 48), rimMat);
    rim.position.set(x, 0, -0.206);
    rim.rotation.y = Math.PI;
    group.add(lens, rim);
  }

  const strapMat = new THREE.MeshStandardMaterial({ color: 0x23241f, roughness: 0.8 });
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.018, 12, 48, Math.PI), strapMat);
  strap.rotation.x = -Math.PI / 2 - 0.75;
  strap.scale.set(1, 1.35, 1);
  strap.position.set(0, 0.04, -0.08);

  group.add(shell, visor, stripe, foam, strap);
  group.traverse((obj) => {
    if (obj.isMesh) obj.castShadow = true;
  });

  return { group, lensMat };
}

const H_REST = new THREE.Vector3(0.05, 1.075, -0.15);
const H_UP = new THREE.Vector3(0, 1.4, 0.75);
const CAM_START = new THREE.Vector3(1.15, 1.7, 2.9);
const CAM_END = new THREE.Vector3(0, 1.4, 0.75 + 0.206 + 0.2);
const CAM_EXIT = new THREE.Vector3(-0.35, 1.55, 2.4);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

const CAM_FUN = new THREE.Vector3(0.1, 1.62, 1.75);
const FUN_LOOK = new THREE.Vector3(0.18, 0.92, -0.25);
const EXIT_LOOK = new THREE.Vector3(0.2, 1.0, -0.3);
const tmpC = new THREE.Vector3();

function updateRoom(p, time, dt) {
  const { group, lensMat } = room.headset;
  if (hoveredProp === "travel") room.globe.sphere.rotation.y += dt * 1.4;
  else room.globe.sphere.rotation.y += dt * 0.25;
  updateBalls(dt);
  if (p < P.roomSwitch) {
    const lift = smooth(range(p, 0.03, 0.2));
    const turn = smooth(range(p, 0.05, 0.2));
    group.position.lerpVectors(H_REST, H_UP, lift);
    group.rotation.set(lerp(-0.04, 0, lift), lerp(0.6, Math.PI, turn), lerp(0.05, 0, lift));
    if (p < 0.03) group.position.y += Math.sin(time * 1.4) * 0.004;

    const approach = range(p, 0, 0.235);
    camera.position.lerpVectors(CAM_START, CAM_END, smooth(approach) * 0.35 + Math.pow(approach, 3) * 0.65);
    tmpA.copy(group.position);
    camera.lookAt(tmpA);
    lensMat.emissiveIntensity = lerp(0.08, 2.6, range(p, 0.14, 0.22));
    camera.updateMatrixWorld();
    updateProps(p, time);
  } else {
    group.position.copy(H_REST);
    group.rotation.set(-0.04, 0.6, 0.05);
    lensMat.emissiveIntensity = 0.1;
    const poke = (time - headsetPoke) / 0.9;
    if (poke >= 0 && poke < 1) {
      group.position.y += Math.sin(poke * Math.PI) * 0.12;
      group.rotation.y += smooth(poke) * Math.PI * 2;
      lensMat.emissiveIntensity = 0.1 + Math.sin(poke * Math.PI) * 2.4;
    }
    const drift = Math.sin(time * 0.3) * 0.06;
    const leave = smooth(range(p, P.funEnd, P.funEnd + 0.015));
    camera.position.lerpVectors(CAM_FUN, CAM_EXIT, leave);
    camera.position.x += drift;
    if (window.innerWidth < window.innerHeight) camera.position.add(tmpC.set(0.25, 0.35, 1.1).multiplyScalar(1 - leave));
    tmpC.lerpVectors(FUN_LOOK, EXIT_LOOK, leave);
    camera.lookAt(tmpC);
    camera.updateMatrixWorld();
    updateProps(p, time);
  }
}

const propPoint = new THREE.Vector3();

function nearestProp(x, y, radius) {
  let best = null;
  let bestDist = radius;
  room.props.forEach((prop) => {
    prop.hit.getWorldPosition(propPoint).project(camera);
    if (propPoint.z > 1) return;
    const sx = (propPoint.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-propPoint.y * 0.5 + 0.5) * window.innerHeight;
    const d = Math.hypot(sx - x, sy - y);
    if (d < bestDist) {
      bestDist = d;
      best = prop.key;
    }
  });
  return best;
}

function updateProps(p, time) {
  let hit = null;
  if (propsActive(p) && !coarsePointer) {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(room.props.map((prop) => prop.hit), true);
    if (hits.length) hit = hits[0].object.userData.prop || null;
  }
  hoveredProp = hit;

  const w = window.innerWidth;
  const h = window.innerHeight;
  room.props.forEach((prop, i) => {
    if (prop.group) {
      const s = prop.key === hit ? 1.12 : 1;
      prop.group.scale.lerp(tmpB.set(s, s, s), 0.15);
      if (prop.key === "games") prop.group.position.y = 0.9 + (hit === "games" ? 0.03 + Math.sin(time * 6) * 0.006 : 0);
    }
    if (!prop.anchor) return;
    const tag = funTags.find((el) => el.dataset.fun === prop.key);
    if (!tag) return;
    tmpC.copy(prop.anchor).project(camera);
    const x = clamp((tmpC.x * 0.5 + 0.5) * w, 56, w - 56);
    const y = (-tmpC.y * 0.5 + 0.5) * h;
    const bob = Math.sin(time * 1.6 + i) * 4;
    tag.style.transform = `translate(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px) translate(-50%, -100%)`;
    tag.classList.toggle("is-hot", prop.key === hit);
  });
}

/* ---------- VR space ---------- */

function buildVR() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070a);
  scene.fog = new THREE.FogExp2(0x05070a, 0.055);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x0a0d08, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 6, 4);
  scene.add(key);

  const grid = new THREE.GridHelper(80, 80, SIGNAL, 0x253010);
  grid.material.transparent = true;
  grid.material.opacity = 0.32;
  scene.add(grid);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.6, 3.64, 128),
    new THREE.MeshBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);

  const count = 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xefe8d8, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(dust);

  const RADIUS = 4.4;
  const step = (Math.PI * 2) / PROJECTS.length;
  const panels = PROJECTS.map((project, i) => {
    const group = new THREE.Group();
    const angle = i * step;
    group.position.set(Math.sin(angle) * RADIUS, 1.6, -Math.cos(angle) * RADIUS);
    group.lookAt(0, 1.6, 0);

    const texture = makePanelTexture(project, i);
    const front = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 1.5),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false })
    );
    front.userData.index = i;
    const back = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), new THREE.MeshBasicMaterial({ color: 0x0d1008 }));
    back.rotation.y = Math.PI;
    back.position.z = -0.005;
    group.add(front, back);
    scene.add(group);
    return { group, front, angle, baseY: 1.6 };
  });

  const ringEndAngle = (PROJECTS.length - 1) * step;
  const pedestals = RECORD.map((entry, i) => {
    const angle = ringEndAngle + (i + 1) * REC_SPACING;
    const pedestal = buildPedestal();
    pedestal.group.position.set(Math.sin(angle) * REC_RADIUS, -3, -Math.cos(angle) * REC_RADIUS);
    pedestal.group.rotation.y = -angle;
    const exhibit = buildExhibit(entry.exhibit, pedestal.exhibit);
    scene.add(pedestal.group);
    return { ...pedestal, angle, animate: exhibit.animate };
  });

  return { scene, panels, step, dust, pedestals };
}

function buildPedestal() {
  const group = new THREE.Group();
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.62, 0.3, 48),
    new THREE.MeshStandardMaterial({ color: 0x14170f, roughness: 0.6, metalness: 0.3 })
  );
  plinth.position.y = 0.15;
  const edge = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: SIGNAL }));
  edge.rotation.x = Math.PI / 2;
  edge.position.y = 0.3;
  const scanLine = new THREE.Mesh(
    new THREE.TorusGeometry(0.46, 0.005, 8, 96),
    new THREE.MeshBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.8 })
  );
  scanLine.rotation.x = Math.PI / 2;
  const exhibit = new THREE.Group();
  exhibit.position.y = 0.3;
  group.add(plinth, edge, scanLine, exhibit);
  return { group, exhibit, scanLine };
}

function fitModel(model, target) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  model.scale.setScalar(target / Math.max(size.x, size.y, size.z));
  const scaled = new THREE.Box3().setFromObject(model);
  const center = scaled.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -scaled.min.y, -center.z);
}

function buildExhibit(kind, holder) {
  const cream = new THREE.MeshStandardMaterial({ color: 0xefe8d8, roughness: 0.5 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1d1e1b, roughness: 0.6 });
  const glow = new THREE.MeshStandardMaterial({ color: SIGNAL, emissive: SIGNAL, emissiveIntensity: 0.6 });
  const spin = new THREE.Group();
  holder.add(spin);
  let animate = () => {};

  if (kind === "buggy") {
    const body = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.16, 0.34, 4, 0.05), cream);
    body.position.y = 0.17;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.025, 0.345), glow);
    stripe.position.y = 0.15;
    const roof = new THREE.Mesh(new RoundedBoxGeometry(0.58, 0.025, 0.36, 3, 0.01), cream);
    roof.position.y = 0.52;
    spin.add(body, stripe, roof);
    for (const [x, z] of [[-0.26, -0.15], [0.26, -0.15], [-0.26, 0.15], [0.26, 0.15]]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28, 8), dark);
      post.position.set(x, 0.38, z);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 20), dark);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x * 0.85, 0.07, z * 1.08);
      spin.add(post, wheel);
    }
    for (const x of [-0.12, 0.1]) {
      const seat = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.12, 0.28, 3, 0.03), dark);
      seat.position.set(x, 0.3, 0);
      spin.add(seat);
    }
  } else if (kind === "bridge") {
    const left = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.24, 0.24, 4, 0.05), cream);
    left.position.set(-0.3, 0.3, 0);
    const right = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.24, 0.24, 4, 0.05), glow);
    right.position.set(0.3, 0.3, 0);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 12), dark);
    tube.rotation.z = Math.PI / 2;
    tube.position.y = 0.3;
    const packet = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), glow);
    packet.position.y = 0.3;
    spin.add(left, right, tube, packet);
    animate = (time) => { packet.position.x = -0.18 + ((time * 0.45) % 1) * 0.36; };
  } else if (kind === "scan") {
    const placeholder = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 1), new THREE.MeshBasicMaterial({ color: SIGNAL, wireframe: true }));
    placeholder.position.y = 0.35;
    spin.add(placeholder);
    new GLTFLoader().load("../models/310.glb", (gltf) => {
      fitModel(gltf.scene, 0.85);
      spin.remove(placeholder);
      spin.add(gltf.scene);
    }, undefined, () => {});
  } else if (kind === "headset") {
    const mini = buildHeadset();
    mini.group.scale.setScalar(1.05);
    mini.group.position.y = 0.35;
    mini.lensMat.emissiveIntensity = 1.2;
    spin.add(mini.group);
    animate = (time) => { mini.group.position.y = 0.35 + Math.sin(time * 1.5) * 0.03; };
  } else if (kind === "target") {
    const face = new THREE.Group();
    [[0.3, 0xefe8d8], [0.24, 0x1d1e1b], [0.18, 0x3d7ea6], [0.12, 0xc0392b], [0.06, 0xf4d03f]].forEach(([r, color], i) => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.03 + i * 0.004, 48), new THREE.MeshStandardMaterial({ color, roughness: 0.7 }));
      face.add(ring);
    });
    face.rotation.x = Math.PI / 2;
    face.position.y = 0.42;
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 8), dark);
    legL.position.set(-0.14, 0.2, -0.06);
    legL.rotation.z = 0.25;
    const legR = legL.clone();
    legR.position.x = 0.14;
    legR.rotation.z = -0.25;
    const arrow = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.34, 8), cream);
    shaft.rotation.x = Math.PI / 2;
    const fletch = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.06, 4), glow);
    fletch.rotation.x = -Math.PI / 2;
    fletch.position.z = 0.17;
    arrow.add(shaft, fletch);
    arrow.position.set(0.03, 0.44, 0.17);
    arrow.rotation.set(0.12, 0.15, 0);
    spin.add(face, legL, legR, arrow);
  } else if (kind === "database") {
    for (let i = 0; i < 3; i += 1) {
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 40), i === 1 ? cream : dark);
      disk.position.y = 0.1 + i * 0.17;
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.222, 0.006, 8, 48), glow);
      band.rotation.x = Math.PI / 2;
      band.position.y = disk.position.y + 0.07;
      spin.add(disk, band);
    }
  }

  spin.traverse((obj) => { if (obj.isMesh) obj.castShadow = true; });
  return {
    animate: (time, dt) => {
      spin.rotation.y += dt * 0.35;
      animate(time, dt);
    }
  };
}

const LOOK = new THREE.Vector3();
const REC_CAM = new THREE.Vector3();
const REC_LOOK = new THREE.Vector3();
let recIndex = -1;
let yaw = 0;
let yawReady = false;

function updateVR(p, time, dt) {
  const n = PROJECTS.length;
  const ringT = range(p, P.ringStart, P.ringEnd);
  const x = ringT * (n - 1);
  const base = Math.floor(x);
  const eased = Math.min(n - 1, base + smooth(range(x - base, 0.3, 0.7)));
  const targetYaw = -eased * vr.step;
  if (!yawReady) {
    yaw = targetYaw;
    yawReady = true;
  } else {
    yaw += (targetYaw - yaw) * (1 - Math.pow(0.0005, dt));
  }

  const spawn = smooth(range(p, 0.24, 0.31));
  const eye = new THREE.Vector3(0, lerp(0.5, 1.6, spawn), 0);
  const pitch = lerp(0.35, 0, spawn);
  tmpA.set(-Math.sin(yaw), Math.sin(pitch), -Math.cos(yaw));

  const lab = smooth(range(p, P.labStart, P.recStart));
  const rn = RECORD.length;
  const rx = range(p, P.recStart, P.recEnd) * (rn - 1);
  const rBase = Math.floor(rx);
  const rEased = Math.min(rn - 1, rBase + smooth(range(rx - rBase, 0.3, 0.7)));
  const recAngle = vr.pedestals[0].angle + rEased * REC_SPACING;
  tmpC.set(Math.sin(recAngle), 0, -Math.cos(recAngle));
  REC_CAM.set(0, 1.35, 0).addScaledVector(tmpC, 0.5);
  REC_LOOK.set(0, window.innerWidth < window.innerHeight ? 0.05 : 0.6, 0).addScaledVector(tmpC, REC_RADIUS);
  if (p > P.labEnd) {
    const drift = range(p, P.labEnd, P.exitSwitch);
    REC_CAM.addScaledVector(tmpC, -drift * 1.2);
    REC_CAM.y += drift * 0.8;
  }

  camera.position.lerpVectors(eye, REC_CAM, lab);
  tmpB.copy(eye).addScaledVector(tmpA, 4);
  LOOK.lerpVectors(tmpB, REC_LOOK, lab);
  camera.lookAt(LOOK);

  const scan = Math.sin(time * 1.6) * 0.5 + 0.5;
  vr.pedestals.forEach((pedestal, i) => {
    const rise = smooth(range(p, P.labStart + i * 0.003, P.labStart + 0.014 + i * 0.003));
    pedestal.group.position.y = lerp(-3, 0, rise);
    if (rise > 0) pedestal.animate(time, dt);
    pedestal.scanLine.position.y = 0.32 + scan * 0.8;
  });
  vr.panels.forEach((panel) => { panel.front.material.opacity = 1 - lab * 0.7; });

  vr.dust.rotation.y += dt * 0.01;

  const inRing = inRingRange(p);
  let hit = null;
  if (inRing && !coarsePointer) {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(vr.panels.map((panel) => panel.front), false);
    if (hits.length) hit = hits[0].object.userData.index;
  }
  hovered = hit;
  canvas.style.cursor = hit !== null ? "pointer" : "";

  const current = Math.round(eased);
  vr.panels.forEach((panel, i) => {
    const focus = i === current && inRing ? 1 : 0;
    const hover = i === hit ? 1 : 0;
    const s = 1 + focus * 0.05 + hover * 0.05;
    panel.group.scale.lerp(tmpB.set(s, s, s), 0.12);
    panel.group.position.y = panel.baseY + Math.sin(time * 0.8 + i * 1.3) * 0.035;
  });

  if (p < P.ringStart) {
    setPhase("Booting");
  } else if (p <= P.ringEnd + 0.004) {
    setPhase(`Projects ${pad(current + 1)} / ${pad(n)}`);
    if (current !== activeIndex) setActive(current);
  } else {
    const r = Math.round(rEased);
    setPhase(`Record ${pad(r + 1)} / ${pad(rn)}`);
    if (r !== recIndex) setRecord(r);
  }
}

const recHud = {
  index: document.getElementById("rec-index"),
  time: document.getElementById("rec-time"),
  title: document.getElementById("rec-title"),
  org: document.getElementById("rec-org"),
  line: document.getElementById("rec-line"),
  pins: document.getElementById("rec-pins")
};

recHud.pins.replaceChildren(...RECORD.map((entry, i) => {
  const pin = document.createElement("button");
  pin.type = "button";
  pin.textContent = entry.pin;
  pin.setAttribute("aria-label", `${entry.title}, ${entry.org}`);
  pin.addEventListener("click", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const at = P.recStart + (i / (RECORD.length - 1)) * (P.recEnd - P.recStart);
    window.scrollTo({ top: at * max, behavior: "smooth" });
  });
  return pin;
}));

function setRecord(i) {
  recIndex = i;
  const entry = RECORD[i];
  recHud.index.textContent = `Record · ${pad(i + 1)} / ${pad(RECORD.length)}`;
  recHud.time.textContent = entry.time;
  recHud.title.textContent = entry.title;
  recHud.org.textContent = entry.org;
  recHud.line.textContent = entry.line;
  Array.from(recHud.pins.children).forEach((pin, k) => pin.classList.toggle("is-on", k === i));
}

setRecord(0);

function setActive(i) {
  activeIndex = i;
  const project = PROJECTS[i];
  hud.index.textContent = `${pad(i + 1)} / ${pad(PROJECTS.length)} · ${project.kind}`;
  hud.title.textContent = project.title;
  hud.org.textContent = project.org;
  hud.line.textContent = project.line;
}

/* ---------- Panel art ---------- */

function makePanelTexture(project, index) {
  const W = 1024;
  const H = 640;
  const panelCanvas = document.createElement("canvas");
  panelCanvas.width = W;
  panelCanvas.height = H;
  const ctx = panelCanvas.getContext("2d");
  const texture = new THREE.CanvasTexture(panelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  let image = null;
  const draw = () => {
    drawPanel(ctx, W, H, project, index, image);
    texture.needsUpdate = true;
  };
  draw();

  fontsReady.then(draw);
  loadPanelImage(project).then((bitmap) => {
    if (!bitmap) return;
    image = bitmap;
    draw();
  });
  return texture;
}

async function loadBitmap(url) {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return null;
    return await createImageBitmap(await response.blob());
  } catch {
    return null;
  }
}

async function loadPanelImage(project) {
  if (project.image) return loadBitmap(project.image);
  if (project.video) {
    return (await loadBitmap(`https://i.ytimg.com/vi/${project.video}/maxresdefault.jpg`))
      || (await loadBitmap(`https://i.ytimg.com/vi/${project.video}/hqdefault.jpg`));
  }
  return null;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawPanel(ctx, W, H, project, index, image) {
  ctx.clearRect(0, 0, W, H);
  roundRect(ctx, 4, 4, W - 8, H - 8, 30);
  ctx.fillStyle = "#0d1008";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(214, 255, 74, 0.75)";
  ctx.stroke();

  const mx = 30;
  const my = 30;
  const mw = W - 60;
  const mh = 350;
  ctx.save();
  roundRect(ctx, mx, my, mw, mh, 18);
  ctx.clip();
  ctx.fillStyle = "#05070a";
  ctx.fillRect(mx, my, mw, mh);
  if (image) {
    const tall = image.height > image.width;
    const s = tall ? Math.min(mw / image.width, mh / image.height) : Math.max(mw / image.width, mh / image.height);
    const iw = image.width * s;
    const ih = image.height * s;
    ctx.drawImage(image, mx + (mw - iw) / 2, my + (mh - ih) / 2, iw, ih);
  } else {
    drawSketch(ctx, project.sketch, mx, my, mw, mh);
  }
  const shade = ctx.createLinearGradient(0, my + mh - 90, 0, my + mh);
  shade.addColorStop(0, "rgba(13,16,8,0)");
  shade.addColorStop(1, "rgba(13,16,8,0.65)");
  ctx.fillStyle = shade;
  ctx.fillRect(mx, my, mw, mh);
  ctx.restore();

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = SIGNAL_CSS;
  ctx.font = '500 22px "IBM Plex Mono", monospace';
  ctx.textAlign = "left";
  ctx.fillText(`${pad(index + 1)} / ${pad(PROJECTS.length)} · ${project.kind.toUpperCase()}`, 40, 424);
  ctx.textAlign = "right";
  ctx.fillText("OPEN ↗", W - 40, 424);

  ctx.textAlign = "left";
  ctx.fillStyle = "#f3efe4";
  ctx.font = '600 66px "Fraunces", Georgia, serif';
  ctx.fillText(project.title, 38, 500);

  ctx.fillStyle = "#b7b1a3";
  ctx.font = '400 27px "Outfit", system-ui, sans-serif';
  ctx.fillText(project.org, 40, 544);

  ctx.fillStyle = "#f3efe4";
  ctx.font = '400 27px "Outfit", system-ui, sans-serif';
  wrap(ctx, project.line, 40, 590, W - 80, 32, 1);
}

function wrap(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  for (let i = 0; i < words.length; i += 1) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      if (lines === maxLines - 1) {
        ctx.fillText(`${line}…`, x, y + lines * lineHeight);
        return;
      }
      ctx.fillText(line, x, y + lines * lineHeight);
      lines += 1;
      line = words[i];
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y + lines * lineHeight);
}

function drawSketch(ctx, kind, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "rgba(243,239,228,0.08)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx <= w; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 0; gy <= h; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  ctx.lineWidth = 3;
  if (kind === "buggy") {
    ctx.strokeStyle = "rgba(214,255,74,0.5)";
    ctx.fillStyle = "rgba(214,255,74,0.06)";
    roundRect(ctx, 40, 40, w - 80, 110, 16);
    ctx.fill();
    ctx.stroke();
    roundRect(ctx, 40, h - 150, w - 80, 110, 16);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(90, 95);
    ctx.lineTo(w / 2, 95);
    ctx.lineTo(w / 2, h - 95);
    ctx.lineTo(w - 90, h - 95);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const [cx, cy, c] of [[240, 95, SIGNAL_CSS], [w / 2, h / 2, "#efe8d8"], [w - 220, h - 95, SIGNAL_CSS]]) {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#b7b1a3";
    ctx.font = '500 18px "IBM Plex Mono", monospace';
    ctx.fillText("UPPER FLOOR", 62, 70);
    ctx.fillText("LOWER FLOOR", 62, h - 124);
  } else if (kind === "bridge") {
    const box = (bx, label, sub) => {
      roundRect(ctx, bx, h / 2 - 70, 300, 140, 22);
      ctx.fillStyle = "rgba(214,255,74,0.1)";
      ctx.fill();
      ctx.strokeStyle = "rgba(214,255,74,0.6)";
      ctx.stroke();
      ctx.fillStyle = "#f3efe4";
      ctx.font = '600 46px "Fraunces", Georgia, serif';
      ctx.fillText(label, bx + 28, h / 2 + 4);
      ctx.fillStyle = SIGNAL_CSS;
      ctx.font = '500 18px "IBM Plex Mono", monospace';
      ctx.fillText(sub, bx + 30, h / 2 + 42);
    };
    box(90, "Mailchimp", "AUDIENCES");
    box(w - 390, "Carbon", "CONTACTS");
    ctx.strokeStyle = SIGNAL_CSS;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(410, h / 2);
    ctx.lineTo(w - 410, h / 2);
    ctx.lineTo(w - 430, h / 2 - 14);
    ctx.moveTo(w - 410, h / 2);
    ctx.lineTo(w - 430, h / 2 + 14);
    ctx.stroke();
  } else if (kind === "path") {
    ctx.strokeStyle = SIGNAL_CSS;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(110, h - 60);
    ctx.bezierCurveTo(260, h - 60, 300, 170, 470, 160);
    ctx.bezierCurveTo(640, 150, 700, 70, w - 120, 70);
    ctx.stroke();
    ctx.fillStyle = SIGNAL_CSS;
    ctx.beginPath();
    ctx.arc(110, h - 60, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#efe8d8";
    ctx.beginPath();
    ctx.arc(w - 120, 70, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '500 20px "IBM Plex Mono", monospace';
    ctx.fillText("YOU", 140, h - 52);
    ctx.fillText("GATE", w - 220, 110);
  } else {
    ctx.fillStyle = "rgba(214,255,74,0.7)";
    ctx.font = '500 22px "IBM Plex Mono", monospace';
    ctx.fillText("VIDEO INSIDE · CLICK TO OPEN", 40, h / 2);
  }
  ctx.restore();
}

/* ---------- Dialog ---------- */

const dialog = document.getElementById("dialog");
const dialogMedia = document.getElementById("dialog-media");

document.getElementById("dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
let funCleanup = null;

dialog.addEventListener("close", () => {
  dialogMedia.replaceChildren();
  if (funCleanup) funCleanup();
  funCleanup = null;
});

function openFun(key) {
  const fun = FUN[key];
  if (!fun) return;
  document.getElementById("dialog-kicker").textContent = fun.kicker;
  document.getElementById("dialog-title").textContent = fun.title;
  document.getElementById("dialog-org").textContent = fun.intro;
  document.getElementById("dialog-stack").textContent = "";
  document.getElementById("dialog-links").replaceChildren();
  dialogMedia.hidden = true;

  const body = document.getElementById("dialog-body");
  if (key === "music") funCleanup = renderMusic(body, fun);
  else if (key === "games") funCleanup = renderGames(body);
  else funCleanup = renderTravel(body, fun);
  dialog.showModal();
}

function renderMusic(body, fun) {
  body.innerHTML = `
    <div class="player is-playing">
      <div class="vinyl" aria-hidden="true"><span></span></div>
      <div class="player-main">
        <p class="np-label">Now playing</p>
        <p class="np-artist"></p>
        <div class="eq" aria-hidden="true">${"<i></i>".repeat(16)}</div>
        <div class="player-controls">
          <button type="button" data-act="prev" aria-label="Previous artist">⏮</button>
          <button type="button" data-act="play" class="play" aria-label="Pause">⏸</button>
          <button type="button" data-act="next" aria-label="Next artist">⏭</button>
        </div>
      </div>
    </div>
    <ol class="tracklist">
      ${fun.artists.map((a, i) => `<li><button type="button" data-i="${i}"><span>${pad(i + 1)}</span>${a.name}</button></li>`).join("")}
    </ol>
    <a class="spotify-link" target="_blank" rel="noopener">Find them on Spotify ↗</a>`;

  const player = body.querySelector(".player");
  const artistEl = body.querySelector(".np-artist");
  const playBtn = body.querySelector(".play");
  const link = body.querySelector(".spotify-link");
  const rows = Array.from(body.querySelectorAll(".tracklist button"));
  let current = 0;

  const show = (i) => {
    current = (i + fun.artists.length) % fun.artists.length;
    const artist = fun.artists[current];
    artistEl.textContent = artist.name;
    player.style.setProperty("--disc", artist.color);
    link.href = `https://open.spotify.com/search/${encodeURIComponent(artist.name)}`;
    rows.forEach((row, k) => row.classList.toggle("is-on", k === current));
  };
  body.querySelector("[data-act=prev]").addEventListener("click", () => show(current - 1));
  body.querySelector("[data-act=next]").addEventListener("click", () => show(current + 1));
  playBtn.addEventListener("click", () => {
    const playing = player.classList.toggle("is-playing");
    playBtn.textContent = playing ? "⏸" : "▶";
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  });
  rows.forEach((row) => row.addEventListener("click", () => show(Number(row.dataset.i))));
  show(0);
  return null;
}

function renderGames(body) {
  body.innerHTML = `
    <div class="tiles">
      <div class="tile tile-cr"><span class="elixir" aria-hidden="true">4</span><b>Clash Royale</b><small>game · on the phone</small></div>
      <div class="tile tile-cricket"><span class="tile-icon" aria-hidden="true">🏏</span><b>Cricket</b><small>sport</small></div>
      <div class="tile tile-football"><span class="tile-icon" aria-hidden="true">⚽</span><b>Football</b><small>sport</small></div>
    </div>
    <div class="keepy">
      <canvas width="720" height="260" aria-label="Keepy-uppy mini game. Click the ball to keep it in the air."></canvas>
      <p class="keepy-score"><span>Keepy-uppy: click the ball, don’t let it drop.</span><b>0</b><small>best 0</small></p>
    </div>`;
  return startKeepy(body.querySelector(".keepy canvas"), body.querySelector(".keepy-score b"), body.querySelector(".keepy-score small"));
}

function startKeepy(cv, scoreEl, bestEl) {
  const ctx = cv.getContext("2d");
  const W = cv.width;
  const H = cv.height;
  const R = 24;
  const ground = H - 18;
  const ball = { x: W / 2, y: ground - R, vx: 0, vy: 0, spin: 0 };
  let score = 0;
  let best = Number(localStorage.getItem("keepy-best") || 0);
  let airborne = false;
  let last = performance.now();
  let raf = 0;
  bestEl.textContent = `best ${best}`;

  const onDown = (event) => {
    const rect = cv.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * W;
    const y = ((event.clientY - rect.top) / rect.height) * H;
    if (Math.hypot(x - ball.x, y - ball.y) > R * 1.9) return;
    ball.vy = -(520 + Math.random() * 120);
    ball.vx = (ball.x - x) * 9 + (Math.random() - 0.5) * 120;
    airborne = true;
    score += 1;
    if (score > best) {
      best = score;
      localStorage.setItem("keepy-best", String(best));
      bestEl.textContent = `best ${best}`;
    }
    scoreEl.textContent = String(score);
  };
  cv.addEventListener("pointerdown", onDown);

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;
    if (airborne) {
      ball.vy += 1300 * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.spin += ball.vx * dt * 0.05;
      if (ball.x < R || ball.x > W - R) {
        ball.x = clamp(ball.x, R, W - R);
        ball.vx *= -0.8;
      }
      if (ball.y < R) {
        ball.y = R;
        ball.vy = Math.abs(ball.vy) * 0.5;
      }
      if (ball.y >= ground - R) {
        ball.y = ground - R;
        ball.vx = 0;
        ball.vy = 0;
        airborne = false;
        score = 0;
        scoreEl.textContent = "0";
      }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#123d22";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W / 2, H + 40, 120, Math.PI, 0);
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(0, ground, W, 2);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    const shadow = 1 - clamp((ground - R - ball.y) / 220, 0, 0.7);
    ctx.beginPath();
    ctx.ellipse(ball.x, ground + 2, R * shadow, 5 * shadow, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.spin);
    ctx.fillStyle = "#f3efe4";
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1b1c19";
    for (let k = 0; k < 6; k += 1) {
      const a = (k / 5) * Math.PI * 2;
      const cx = k === 5 ? 0 : Math.cos(a) * R * 0.72;
      const cy = k === 5 ? 0 : Math.sin(a) * R * 0.72;
      ctx.beginPath();
      for (let s = 0; s < 5; s += 1) {
        const b = (s / 5) * Math.PI * 2 + a;
        ctx.lineTo(cx + Math.cos(b) * R * 0.26, cy + Math.sin(b) * R * 0.26);
      }
      ctx.fill();
    }
    ctx.restore();

    if (!airborne) {
      ctx.fillStyle = "rgba(243,239,228,0.7)";
      ctx.font = '500 16px "IBM Plex Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText("tap the ball", W / 2, ground - R * 2 - 16);
    }
    raf = requestAnimationFrame(tick);
  };
  tick(last);

  return () => {
    cancelAnimationFrame(raf);
    cv.removeEventListener("pointerdown", onDown);
  };
}

const PASS_ART = {
  Mountains: `<svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="200" height="90" fill="#bcd3e6"/><circle cx="160" cy="24" r="12" fill="#fff6d8"/><path d="M0 90 L55 25 L85 60 L120 15 L200 90Z" fill="#4a6670"/><path d="M55 25 L66 38 L48 34Z M120 15 L134 32 L110 30Z" fill="#fff"/><path d="M0 90 L40 62 L80 90Z" fill="#2f4b3a"/></svg>`,
  Beaches: `<svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="200" height="90" fill="#ffd9a8"/><circle cx="100" cy="52" r="20" fill="#ff8a5b"/><rect y="52" width="200" height="38" fill="#3d7ea6"/><path d="M0 64 Q25 58 50 64 T100 64 T150 64 T200 64 V90 H0Z" fill="#5ac8fa" opacity="0.6"/><path d="M0 80 Q40 70 80 80 T200 78 V90 H0Z" fill="#f2d49b"/></svg>`,
  Deserts: `<svg viewBox="0 0 200 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="200" height="90" fill="#2b2545"/><circle cx="40" cy="20" r="1.5" fill="#fff"/><circle cx="90" cy="12" r="1" fill="#fff"/><circle cx="150" cy="26" r="1.5" fill="#fff"/><circle cx="120" cy="16" r="1" fill="#fff"/><path d="M178 14 a10 10 0 1 0 6 18 a8 8 0 1 1 -6 -18Z" fill="#fff6d8"/><path d="M0 70 Q50 45 100 68 T200 60 V90 H0Z" fill="#c98b4f"/><path d="M0 82 Q60 64 120 80 T200 76 V90 H0Z" fill="#a8663a"/></svg>`
};

function renderTravel(body, fun) {
  body.innerHTML = `
    <div class="passes">
      ${fun.passes.map((pass) => `
        <article class="pass">
          <div class="pass-art">${PASS_ART[pass.name]}</div>
          <div class="pass-body">
            <p class="pass-route"><span>DEL</span><i aria-hidden="true">✈</i><span>${pass.code}</span></p>
            <h3>${pass.name}</h3>
            <dl>
              <div><dt>Gate</dt><dd>${pass.gate}</dd></div>
              <div><dt>Seat</dt><dd>${pass.seat}</dd></div>
              <div><dt>Boarding</dt><dd>Anytime</dd></div>
            </dl>
          </div>
          <span class="pass-stamp" aria-hidden="true">Next up</span>
        </article>`).join("")}
    </div>
    <button type="button" class="pick-trip">Pick my next trip</button>
    <p class="pick-result" aria-live="polite"></p>`;

  const passes = Array.from(body.querySelectorAll(".pass"));
  const result = body.querySelector(".pick-result");
  let timer = 0;
  body.querySelector(".pick-trip").addEventListener("click", () => {
    clearInterval(timer);
    let hops = 0;
    const final = Math.floor(Math.random() * passes.length);
    const total = 9 + final;
    passes.forEach((pass) => pass.classList.remove("is-picked"));
    result.textContent = "";
    timer = setInterval(() => {
      passes.forEach((pass, k) => pass.classList.toggle("is-hover", k === hops % passes.length));
      hops += 1;
      if (hops > total) {
        clearInterval(timer);
        passes.forEach((pass) => pass.classList.remove("is-hover"));
        passes[final].classList.add("is-picked");
        result.textContent = `Next trip: ${fun.passes[final].name.toLowerCase()}. Bags are already packed.`;
      }
    }, 110);
  });
  return () => clearInterval(timer);
}

function openProject(i) {
  dialogMedia.hidden = false;
  dialogMedia.classList.remove("is-embed");
  const project = PROJECTS[i];
  document.getElementById("dialog-kicker").textContent = `${pad(i + 1)} / ${pad(PROJECTS.length)} · ${project.kind}`;
  document.getElementById("dialog-title").textContent = project.title;
  document.getElementById("dialog-org").textContent = project.org;
  document.getElementById("dialog-stack").textContent = project.stack;

  const body = document.getElementById("dialog-body");
  body.replaceChildren(...project.body.map((text) => {
    const para = document.createElement("p");
    para.textContent = text;
    return para;
  }));

  const links = document.getElementById("dialog-links");
  links.replaceChildren(...(project.links || []).map((link) => {
    const a = document.createElement("a");
    a.href = link.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = link.label;
    return a;
  }));

  if (project.video) {
    const frameEl = document.createElement("iframe");
    frameEl.src = `https://www.youtube.com/embed/${project.video}?autoplay=1&rel=0`;
    frameEl.title = `${project.title} video`;
    frameEl.allow = "autoplay; fullscreen; picture-in-picture";
    frameEl.allowFullscreen = true;
    dialogMedia.replaceChildren(frameEl);
  } else if (project.image) {
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = `${project.title} screenshot`;
    dialogMedia.replaceChildren(img);
  } else {
    const sketchCanvas = document.createElement("canvas");
    sketchCanvas.width = 1280;
    sketchCanvas.height = 720;
    const ctx = sketchCanvas.getContext("2d");
    ctx.fillStyle = "#05070a";
    ctx.fillRect(0, 0, 1280, 720);
    ctx.scale(1280 / 964, 720 / 350);
    drawSketch(ctx, project.sketch, 0, 0, 964, 350);
    sketchCanvas.setAttribute("role", "img");
    sketchCanvas.setAttribute("aria-label", `${project.title} diagram`);
    dialogMedia.replaceChildren(sketchCanvas);
  }

  dialog.showModal();
}

/* ---------- Fallback ---------- */

function showFallback(title, body) {
  const el = document.getElementById("fallback");
  document.getElementById("fallback-title").textContent = title;
  document.getElementById("fallback-body").textContent = body;
  el.hidden = false;
}
