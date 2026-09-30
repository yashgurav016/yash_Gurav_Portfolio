const $ = (s) => document.querySelector(s);
/* start + menu */
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches,
  calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
document
  .querySelectorAll(".hero>.rv:first-child>*")
  .forEach((e, i) => e.style.setProperty("--i", i));
function counts() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const to = +el.dataset.count,
      dec = +el.dataset.dec || 0,
      t0 = performance.now();
    (function s(t) {
      const p = Math.min(1, (t - t0) / 1500),
        e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(s);
    })(t0);
  });
}
$("#go").onclick = () => {
  $("#start").classList.add("gone");
  document.body.classList.add("ready");
  if (!calm) counts();
};
$("#mb").onclick = (e) => {
  e.stopPropagation();
  const o = $("#menu").classList.toggle("open");
  $("#mb").textContent = o ? "✕" : "☰";
};
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav")) {
    $("#menu").classList.remove("open");
    $("#mb").textContent = "☰";
  }
});
document.querySelectorAll("#menu a").forEach(
  (a) =>
    (a.onclick = () => {
      $("#menu").classList.remove("open");
      $("#mb").textContent = "☰";
    }),
);
/* typing */
const roles = [
  "Full Stack Python Web Developer",
  "Web Developer",
  "Front-End Developer",
  "Back-End Developer",
  "AI Engineer",
  "Problem Solver",
  "Computer Science Engineer",
];
let ri = 0,
  ci = 0,
  dl = false;
(function t() {
  const w = roles[ri];
  $("#ty").textContent = w.slice(0, ci);
  let d = dl ? 35 : 75;
  if (!dl && ci === w.length) {
    dl = true;
    d = 1500;
  } else if (dl && ci === 0) {
    dl = false;
    ri = (ri + 1) % roles.length;
    d = 350;
  } else ci += dl ? -1 : 1;
  setTimeout(t, d);
})();
/* progress + level */
const secs = [$("#home"), ...document.querySelectorAll("section[data-lv]")];
secs[0].dataset.lv = "Start";
const links = [...document.querySelectorAll("#menu a")];
function prog() {
  const h = document.documentElement.scrollHeight - innerHeight;
  $("#bar").style.width = Math.min(100, (scrollY / h) * 100) + "%";
  let i = 0;
  secs.forEach((s, k) => {
    if (s.getBoundingClientRect().top < innerHeight * 0.5) i = k;
  });
  links.forEach((a) =>
    a.classList.toggle("act", a.getAttribute("href") === "#" + secs[i].id),
  );
}
addEventListener("scroll", prog, { passive: true });
prog();
/* reveal */
const io = new IntersectionObserver(
  (e) =>
    e.forEach((x) => {
      if (x.isIntersecting) {
        x.target.classList.add("in");
        io.unobserve(x.target);
      }
    }),
  { threshold: 0.1 },
);
document.querySelectorAll(".rv").forEach((e) => io.observe(e));
/* project reveal */
document.querySelectorAll(".proj").forEach(
  (p) =>
    (p.onclick = () => {
      p.classList.toggle("open");
      p.setAttribute("aria-expanded", p.classList.contains("open"));
    }),
);
document
  .querySelectorAll(".flip")
  .forEach((f) => (f.onclick = () => f.classList.toggle("on")));
/* particles */
const cv = $("#fx"),
  cx = cv.getContext("2d");
let W,
  H,
  P = [],
  B = [],
  M = { x: -999, y: -999 };
const cols = ["94,225,255", "47,123,255", "124,108,255"];
function rs() {
  const r = devicePixelRatio || 1;
  W = innerWidth;
  H = innerHeight;
  cv.width = W * r;
  cv.height = H * r;
  cx.setTransform(r, 0, 0, r, 0, 0);
  const n = Math.min(90, Math.floor((W * H) / 14000));
  P = Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.8 + 0.6,
    c: cols[Math.floor(Math.random() * 3)],
  }));
}
rs();
addEventListener("resize", rs);
addEventListener("pointermove", (e) => {
  M.x = e.clientX;
  M.y = e.clientY;
});
function burst(x, y) {
  for (let i = 0; i < 22; i++) {
    const a = Math.random() * 6.28,
      s = Math.random() * 3 + 1;
    B.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      l: 1,
      c: cols[i % 3],
    });
  }
}
function fr() {
  cx.clearRect(0, 0, W, H);
  for (const p of P) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    const dx = p.x - M.x,
      dy = p.y - M.y,
      d = Math.hypot(dx, dy);
    if (d < 110) {
      p.x += (dx / d) * 1.2;
      p.y += (dy / d) * 1.2;
    }
    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, 6.28);
    cx.fillStyle = "rgba(" + p.c + ",.85)";
    cx.shadowBlur = 8;
    cx.shadowColor = "rgba(" + p.c + ",1)";
    cx.fill();
  }
  cx.shadowBlur = 0;
  for (let i = 0; i < P.length; i++)
    for (let j = i + 1; j < P.length; j++) {
      const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
      if (d < 115) {
        cx.strokeStyle = "rgba(90,162,255," + 0.22 * (1 - d / 115) + ")";
        cx.lineWidth = 0.7;
        cx.beginPath();
        cx.moveTo(P[i].x, P[i].y);
        cx.lineTo(P[j].x, P[j].y);
        cx.stroke();
      }
    }
  B = B.filter((b) => b.l > 0);
  for (const b of B) {
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.96;
    b.vy *= 0.96;
    b.l -= 0.025;
    cx.beginPath();
    cx.arc(b.x, b.y, 2, 0, 6.28);
    cx.fillStyle = "rgba(" + b.c + "," + b.l + ")";
    cx.fill();
  }
  requestAnimationFrame(fr);
}
if (!matchMedia("(prefers-reduced-motion:reduce)").matches) fr();
/* glowing skill chips */
document.querySelectorAll(".chip").forEach((c) =>
  c.addEventListener("click", (e) => {
    c.classList.toggle("on");
    const r = c.getBoundingClientRect(),
      s = Math.max(r.width, r.height) * 2,
      rp = document.createElement("span");
    rp.className = "rp";
    rp.style.cssText =
      "width:" +
      s +
      "px;height:" +
      s +
      "px;left:" +
      (e.clientX - r.left - s / 2) +
      "px;top:" +
      (e.clientY - r.top - s / 2) +
      "px";
    c.appendChild(rp);
    setTimeout(() => rp.remove(), 650);
    if (c.classList.contains("on"))
      burst(r.left + r.width / 2, r.top + r.height / 2);
  }),
);

/* ---- theme toggle ---- */
const tg = $("#tg"),
  root = document.documentElement;
function paintTheme() {
  const l = root.dataset.theme === "light";
  tg.setAttribute("aria-checked", !l);
  tg.setAttribute(
    "aria-label",
    l ? "Switch to dark mode" : "Switch to light mode",
  );
  document.querySelector("meta[name=theme-color]").content = l
    ? "#eef3fc"
    : "#040b1c";
}
paintTheme();
tg.onclick = () => {
  const n = root.dataset.theme === "light" ? "dark" : "light";
  tg.classList.add("pop");
  setTimeout(() => tg.classList.remove("pop"), 500);
  root.classList.add("theme-anim");
  root.dataset.theme = n;
  paintTheme();
  setTimeout(() => root.classList.remove("theme-anim"), 450);
};
/* ---- back to top + timeline progress ---- */
const topb = $("#top");
topb.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
function extra() {
  topb.classList.toggle("show", scrollY > 700);
  const tl = $(".tl");
  if (tl) {
    const r = tl.getBoundingClientRect();
    tl.style.setProperty(
      "--p",
      Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / r.height)),
    );
  }
}
addEventListener("scroll", extra, { passive: true });
extra();
/* ---- staggered chips ---- */
document
  .querySelectorAll(".cat")
  .forEach((c) =>
    c
      .querySelectorAll(".chip")
      .forEach((x, i) => x.style.setProperty("--i", i)),
  );
/* ---- desktop-only effects: cursor glow, tilt, spotlight, magnetic buttons ---- */
if (fine && !calm) {
  const gl = $("#glow");
  addEventListener("pointermove", (e) => {
    gl.style.opacity = 1;
    gl.style.transform =
      "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
  });
  document.querySelectorAll(".card:not(.ff),.pc,.stats div").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", x * 100 + "%");
      el.style.setProperty("--my", y * 100 + "%");
      if (!el.classList.contains("pj") && !el.classList.contains("ct"))
        el.style.transform =
          "perspective(900px) rotateY(" +
          (x - 0.5) * 9 +
          "deg) rotateX(" +
          (0.5 - y) * 9 +
          "deg) translateY(-3px)";
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
  document.querySelectorAll(".btn,.soc a").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.translate =
        (e.clientX - r.left - r.width / 2) * 0.22 +
        "px " +
        (e.clientY - r.top - r.height / 2) * 0.3 +
        "px";
    });
    el.addEventListener("pointerleave", () => {
      el.style.translate = "";
    });
  });
}
