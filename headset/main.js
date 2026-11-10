import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

window.__headset = true;

const SIGNAL = 0xd6ff4a;
const SIGNAL_CSS = "#d6ff4a";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const FUN = {
  music: {
    kicker: "Off the clock · Music",
    title: "On repeat",
    intro: "What plays while the build runs.",
    spotify: "",
    items: [
      { name: "Seedhe Maut" },
      { name: "Nanku" },
      { name: "Eminem" }
    ]
  },
  games: {
    kicker: "Off the clock · Games & sports",
    title: "Games & sports",
    intro: "On the phone, on the pitch, or on the TV.",
    items: [
      { name: "Clash Royale", note: "game" },
      { name: "Cricket", note: "sport" },
      { name: "Football", note: "sport" }
    ]
  },
  travel: {
    kicker: "Off the clock · Travel",
    title: "Anywhere works",
    intro: "Not a list of places. Just the kind of place.",
    items: [
      { name: "Mountains" },
      { name: "Beaches" },
      { name: "Deserts" }
    ]
  }
};

const P = {
  ringStart: 0.3,
  ringEnd: 0.74,
  labStart: 0.745,
  labEnd: 0.84,
  roomSwitch: 0.24,
  exitSwitch: 0.877,
  funEnd: 0.955
};

const DESK_TOP = 0.9;
const DESK_BOUNDS = { minX: -1.27, maxX: 1.27, minZ: -0.97, maxZ: 0.28 };
const DESK_OBSTACLES = [
  { x: 0.05, z: -0.15, r: 0.3 },
  { x: 0.85, z: -0.5, r: 0.3 },
  { x: 0.42, z: 0.16, r: 0.1 },
  { x: 0.98, z: 0.02, r: 0.14 },
  { x: -0.42, z: -0.62, r: 0.09 },
  { x: -0.45, z: 0.05, r: 0.055 },
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
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

document.querySelectorAll("[data-jump]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Number(el.dataset.jump) * max, behavior: reduceMotion ? "auto" : "smooth" });
  });
});

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

canvas.addEventListener("click", () => {
  if (hovered !== null) openProject(hovered);
  else if (hoveredProp === "lamp") toggleLamp();
  else if (hoveredProp === "football" || hoveredProp === "cricket") kickBall(hoveredProp);
  else if (hoveredProp) openFun(hoveredProp);
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
  progress += (target - progress) * (reduceMotion ? 1 : 1 - Math.pow(0.002, dt));
  const p = progress;

  progressBar.style.width = `${(p * 100).toFixed(2)}%`;
  updateBeats(p);

  fade.style.opacity = Math.max(band(p, 0.19, 0.225, 0.255, 0.3), band(p, 0.85, 0.872, 0.882, 0.9)).toFixed(3);
  vignette.style.opacity = (range(p, 0.12, 0.2) * (p < P.roomSwitch ? 1 : 0)).toFixed(3);

  if (p < P.roomSwitch || p >= P.exitSwitch) {
    setFov(p < P.roomSwitch ? 42 : roomExitFov());
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
  return Math.round(Math.min(78, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(halfH) / aspect))));
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
  mug.position.set(-0.45, 0.955, 0.05);
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
  globe.group.position.set(-0.42, 0.9, -0.62);
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
    { key: "travel", group: globe.group, hit: globe.group, anchor: new THREE.Vector3(-0.42, 1.25, -0.62) },
    { key: "lamp", group: null, hit: lampHit, anchor: null },
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
  ctx.fillStyle = "#10110e";
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = SIGNAL_CSS;
  ctx.fillRect(28, 32, 18, 18);
  ctx.fillStyle = "#f3efe4";
  ctx.font = "600 34px Georgia, serif";
  ctx.fillText("Daman Ahuja", 58, 50);
  ctx.fillStyle = "#b7b1a3";
  ctx.font = "20px monospace";
  ctx.fillText("$ git commit -m \"one last thing\"", 28, 110);
  ctx.fillStyle = SIGNAL_CSS;
  ctx.fillText("build passing ✓", 28, 144);
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;

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
  if (!reduceMotion) room.globe.sphere.rotation.y += dt * (hoveredProp === "travel" ? 1.4 : 0.25);
  updateBalls(dt);
  if (p < P.roomSwitch) {
    const lift = smooth(range(p, 0.03, 0.2));
    const turn = smooth(range(p, 0.05, 0.2));
    group.position.lerpVectors(H_REST, H_UP, lift);
    group.rotation.set(lerp(-0.04, 0, lift), lerp(0.6, Math.PI, turn), lerp(0.05, 0, lift));
    if (!reduceMotion && p < 0.03) group.position.y += Math.sin(time * 1.4) * 0.004;

    const approach = range(p, 0, 0.235);
    camera.position.lerpVectors(CAM_START, CAM_END, smooth(approach) * 0.35 + Math.pow(approach, 3) * 0.65);
    tmpA.copy(group.position);
    camera.lookAt(tmpA);
    lensMat.emissiveIntensity = lerp(0.08, 2.6, range(p, 0.14, 0.22));
  } else {
    group.position.copy(H_REST);
    group.rotation.set(-0.04, 0.6, 0.05);
    lensMat.emissiveIntensity = 0.1;
    const drift = reduceMotion ? 0 : Math.sin(time * 0.3) * 0.06;
    const leave = smooth(range(p, P.funEnd, P.funEnd + 0.015));
    camera.position.lerpVectors(CAM_FUN, CAM_EXIT, leave);
    camera.position.x += drift;
    tmpC.lerpVectors(FUN_LOOK, EXIT_LOOK, leave);
    camera.lookAt(tmpC);
    camera.updateMatrixWorld();
    updateProps(p, time);
  }
}

function updateProps(p, time) {
  const active = p > P.exitSwitch + 0.02 && p < P.funEnd + 0.004;
  let hit = null;
  if (active) {
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
      if (prop.key === "games" && !reduceMotion) prop.group.position.y = 0.9 + (hit === "games" ? 0.03 + Math.sin(time * 6) * 0.006 : 0);
    }
    if (!prop.anchor) return;
    const tag = funTags.find((el) => el.dataset.fun === prop.key);
    if (!tag) return;
    tmpC.copy(prop.anchor).project(camera);
    const x = clamp((tmpC.x * 0.5 + 0.5) * w, 56, w - 56);
    const y = (-tmpC.y * 0.5 + 0.5) * h;
    const bob = reduceMotion ? 0 : Math.sin(time * 1.6 + i) * 4;
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

  const pedestal = new THREE.Group();
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.85, 0.3, 48),
    new THREE.MeshStandardMaterial({ color: 0x14170f, roughness: 0.6, metalness: 0.3 })
  );
  plinth.position.y = 0.15;
  const plinthEdge = new THREE.Mesh(
    new THREE.TorusGeometry(0.75, 0.012, 8, 96),
    new THREE.MeshBasicMaterial({ color: SIGNAL })
  );
  plinthEdge.rotation.x = Math.PI / 2;
  plinthEdge.position.y = 0.3;
  const scanLine = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.006, 8, 96),
    new THREE.MeshBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.85 })
  );
  scanLine.rotation.x = Math.PI / 2;
  const exhibit = new THREE.Group();
  exhibit.position.y = 0.3;
  pedestal.add(plinth, plinthEdge, scanLine, exhibit);
  pedestal.position.y = -3;
  scene.add(pedestal);

  const placeholder = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.5, 1),
    new THREE.MeshBasicMaterial({ color: SIGNAL, wireframe: true })
  );
  placeholder.position.y = 0.6;
  exhibit.add(placeholder);

  new GLTFLoader().load(
    "../models/310.glb",
    (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const scale = 1.25 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      const scaled = new THREE.Box3().setFromObject(model);
      const center = scaled.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -scaled.min.y, -center.z);
      exhibit.remove(placeholder);
      exhibit.add(model);
    },
    undefined,
    () => {}
  );

  return { scene, panels, step, dust, pedestal, exhibit, scanLine };
}

const LOOK = new THREE.Vector3();
const LAB_CAM = new THREE.Vector3(0, 4.4, 7.6);
const LAB_TARGET = new THREE.Vector3(0, 0.9, 0);
let yaw = 0;
let yawReady = false;

function updateVR(p, time, dt) {
  const n = PROJECTS.length;
  const ringT = range(p, P.ringStart, P.ringEnd);
  const x = ringT * (n - 1);
  const base = Math.floor(x);
  const eased = Math.min(n - 1, base + smooth(range(x - base, 0.3, 0.7)));
  const targetYaw = -eased * vr.step;
  if (!yawReady || reduceMotion) {
    yaw = targetYaw;
    yawReady = true;
  } else {
    yaw += (targetYaw - yaw) * (1 - Math.pow(0.0005, dt));
  }

  const spawn = smooth(range(p, 0.24, 0.31));
  const eye = new THREE.Vector3(0, lerp(0.5, 1.6, spawn), 0);
  const pitch = lerp(0.35, 0, spawn);
  tmpA.set(-Math.sin(yaw), Math.sin(pitch), -Math.cos(yaw));

  const lab = smooth(range(p, P.labStart, P.labStart + 0.055));
  camera.position.lerpVectors(eye, LAB_CAM, lab);
  tmpB.copy(eye).addScaledVector(tmpA, 4);
  LOOK.lerpVectors(tmpB, LAB_TARGET, lab);
  if (p > P.labEnd) {
    const drift = range(p, P.labEnd, P.exitSwitch);
    camera.position.z += drift * 1.2;
    camera.position.y += drift * 0.6;
  }
  camera.lookAt(LOOK);

  const rise = smooth(range(p, P.labStart + 0.01, P.labStart + 0.06));
  vr.pedestal.position.y = lerp(-3, 0, rise);
  if (!reduceMotion) vr.exhibit.rotation.y += dt * 0.35;
  vr.scanLine.position.y = 0.35 + (reduceMotion ? 0.6 : (Math.sin(time * 1.6) * 0.5 + 0.5) * 1.2);

  if (!reduceMotion) vr.dust.rotation.y += dt * 0.01;

  const inRing = p >= P.ringStart - 0.01 && p <= P.ringEnd + 0.004;
  let hit = null;
  if (inRing) {
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
    panel.group.position.y = panel.baseY + (reduceMotion ? 0 : Math.sin(time * 0.8 + i * 1.3) * 0.035);
  });

  if (p < P.ringStart) {
    setPhase("Booting");
  } else if (p <= P.ringEnd + 0.004) {
    setPhase(`Projects ${pad(current + 1)} / ${pad(n)}`);
    if (current !== activeIndex) setActive(current);
  } else {
    setPhase("Record");
  }
}

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
dialog.addEventListener("close", () => {
  dialogMedia.replaceChildren();
});

function openFun(key) {
  const fun = FUN[key];
  if (!fun) return;
  document.getElementById("dialog-kicker").textContent = fun.kicker;
  document.getElementById("dialog-title").textContent = fun.title;
  document.getElementById("dialog-org").textContent = fun.intro;
  document.getElementById("dialog-stack").textContent = "";
  document.getElementById("dialog-links").replaceChildren();

  const list = document.createElement("ul");
  list.className = "fun-list";
  list.replaceChildren(...fun.items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    if (item.note) {
      const note = document.createElement("small");
      note.textContent = item.note;
      li.appendChild(note);
    }
    return li;
  }));
  document.getElementById("dialog-body").replaceChildren(list);

  if (fun.spotify) {
    const frameEl = document.createElement("iframe");
    frameEl.src = fun.spotify;
    frameEl.title = "Spotify playlist";
    frameEl.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    frameEl.loading = "lazy";
    dialogMedia.replaceChildren(frameEl);
    dialogMedia.classList.add("is-embed");
    dialogMedia.hidden = false;
  } else {
    dialogMedia.hidden = true;
  }
  dialog.showModal();
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
