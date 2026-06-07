/* ─── app.js ─── */

gsap.registerPlugin(ScrollTrigger);

// ─── DEFAULT SKILLS DATA ───
const DEFAULT_SKILLS = [
  { name: "HTML5 / CSS3", pct: 90, level: "Expert" },
  { name: "JavaScript", pct: 82, level: "Advanced" },
  { name: "React", pct: 70, level: "Comfortable" },
  { name: "Node.js", pct: 68, level: "Comfortable" },
  { name: "C++", pct: 80, level: "Advanced" },
  { name: "MongoDB", pct: 65, level: "Comfortable" },
  { name: "Express.js", pct: 66, level: "Comfortable" },
  { name: "GSAP", pct: 72, level: "Comfortable" },
  { name: "Python", pct: 60, level: "Familiar" },
  { name: "Java", pct: 58, level: "Familiar" },
  { name: "Git / GitHub", pct: 85, level: "Advanced" },
  { name: "Figma", pct: 55, level: "Familiar" },
];

let skills = JSON.parse(localStorage.getItem("ajay_skills") || "null") || DEFAULT_SKILLS;

// ─── CUSTOM CURSOR ───
const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + "px";
  cursor.style.top = cy + "px";
  cursorDot.style.left = mx + "px";
  cursorDot.style.top = my + "px";
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll("a, button, input, textarea, .skill-card, .project-card, .stat-card").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ─── HAMBURGER ───
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

// ─── HERO GSAP ENTRANCE ───
const heroTl = gsap.timeline({ delay: 0.2 });
heroTl
  .from(".hero-badge", { opacity: 0, y: 24, duration: .7, ease: "power3.out" })
  .from(".hero-title", { opacity: 0, y: 40, duration: .8, ease: "power3.out" }, "-=.4")
  .from(".hero-sub", { opacity: 0, y: 28, duration: .7, ease: "power3.out" }, "-=.45")
  .from(".hero-desc", { opacity: 0, y: 24, duration: .65, ease: "power3.out" }, "-=.4")
  .from(".hero-cta", { opacity: 0, y: 20, duration: .6, ease: "power3.out" }, "-=.35")
  .from(".hero-socials", { opacity: 0, y: 16, duration: .5, ease: "power3.out" }, "-=.3")
  .from(".stat-card", { opacity: 0, x: 30, stagger: .1, duration: .55, ease: "power3.out" }, "-=.4")
  .from(".scroll-indicator", { opacity: 0, duration: .5 }, "-=.2");

// Remove reveal-up/right from hero children (already handled by GSAP)
document.querySelectorAll(".hero .reveal-up, .hero .reveal-right").forEach(el => {
  el.classList.add("revealed");
});

// ─── SCROLL REVEAL (non-hero) ───
function revealOnScroll() {
  const targets = document.querySelectorAll(".reveal-up:not(.revealed), .reveal-right:not(.revealed)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("revealed"), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => observer.observe(el));
}
revealOnScroll();

// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1600;
  const start = performance.now();
  (function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(start);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".stat-num").forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".hero-stats").forEach(el => statsObserver.observe(el));

// ─── RENDER SKILLS ───
function getLevelLabel(pct) {
  if (pct >= 85) return "Expert";
  if (pct >= 70) return "Advanced";
  if (pct >= 55) return "Comfortable";
  return "Familiar";
}

function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  grid.innerHTML = "";
  skills.forEach((sk, i) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `
      <div class="skill-top">
        <span class="skill-name">${sk.name}</span>
        <span class="skill-pct">${sk.pct}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-pct="${sk.pct}" style="width:0%"></div>
      </div>
      <div class="skill-level">${getLevelLabel(sk.pct)}</div>
    `;
    grid.appendChild(card);
  });
  animateSkillBars();
}

function animateSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.width = e.target.dataset.pct + "%";
        }, 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

renderSkills();

// ─── SKILL EDITOR MODAL ───
const skillModal = document.getElementById("skillModal");
const editSkillsBtn = document.getElementById("editSkillsBtn");
const modalClose = document.getElementById("modalClose");
const saveSkillsBtn = document.getElementById("saveSkillsBtn");
const addSkillBtn = document.getElementById("addSkillBtn");
const newSkillName = document.getElementById("newSkillName");
const newSkillPct = document.getElementById("newSkillPct");

let tempSkills = [];

function openModal() {
  tempSkills = skills.map(s => ({ ...s }));
  renderEditorList();
  skillModal.classList.add("open");
}

function closeModal() {
  skillModal.classList.remove("open");
}

function renderEditorList() {
  const list = document.getElementById("skillEditorList");
  list.innerHTML = "";
  tempSkills.forEach((sk, i) => {
    const row = document.createElement("div");
    row.className = "editor-skill-row";
    row.innerHTML = `
      <span>${sk.name}</span>
      <input type="number" min="1" max="100" value="${sk.pct}" data-index="${i}" class="editor-pct-input"/>
      <button data-index="${i}" class="editor-remove-btn">✕</button>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll(".editor-pct-input").forEach(inp => {
    inp.addEventListener("change", e => {
      const idx = parseInt(e.target.dataset.index);
      tempSkills[idx].pct = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
    });
  });
  list.querySelectorAll(".editor-remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.dataset.index);
      tempSkills.splice(idx, 1);
      renderEditorList();
    });
  });
}

addSkillBtn.addEventListener("click", () => {
  const name = newSkillName.value.trim();
  const pct = Math.min(100, Math.max(1, parseInt(newSkillPct.value) || 50));
  if (!name) { newSkillName.focus(); return; }
  tempSkills.push({ name, pct, level: getLevelLabel(pct) });
  newSkillName.value = "";
  newSkillPct.value = "";
  renderEditorList();
});

saveSkillsBtn.addEventListener("click", () => {
  skills = tempSkills.map(s => ({ ...s, level: getLevelLabel(s.pct) }));
  localStorage.setItem("ajay_skills", JSON.stringify(skills));
  renderSkills();
  closeModal();

  // GSAP flash confirmation
  gsap.fromTo("#editSkillsBtn", { background: "rgba(34,197,94,0.25)", borderColor: "#22c55e" },
    { background: "", borderColor: "", duration: 1.2, ease: "power2.out" });
});

editSkillsBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
skillModal.addEventListener("click", e => { if (e.target === skillModal) closeModal(); });

// ─── GSAP SCROLL ANIMATIONS ───
// Section titles
gsap.utils.toArray(".section-title").forEach(el => {
  if (el.closest(".hero")) return;
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
    opacity: 0, y: 35, duration: .8, ease: "power3.out"
  });
});

// Project cards stagger
gsap.utils.toArray(".project-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
    opacity: 0, y: 40, duration: .7, delay: i * 0.08, ease: "power3.out"
  });
});

// Skill cards stagger
ScrollTrigger.create({
  trigger: "#skillsGrid",
  start: "top 80%",
  onEnter: () => {
    gsap.from(".skill-card", {
      opacity: 0, y: 28, stagger: 0.06, duration: .55, ease: "power3.out"
    });
  }
});

// About section parallax orbs
gsap.to(".orb-1", {
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 },
  y: -120, x: 40
});
gsap.to(".orb-2", {
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 2 },
  y: -80, x: -30
});

// ─── CONTACT FORM ───
document.getElementById("sendBtn").addEventListener("click", () => {
  const name = document.getElementById("formName").value.trim();
  const email = document.getElementById("formEmail").value.trim();
  const msg = document.getElementById("formMsg").value.trim();
  const note = document.getElementById("formNote");

  if (!name || !email || !msg) {
    note.textContent = "Please fill in all fields.";
    note.style.color = "#f87171";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.textContent = "Please enter a valid email.";
    note.style.color = "#f87171";
    return;
  }

  // Simulate send
  const btn = document.getElementById("sendBtn");
  btn.textContent = "Sending…";
  btn.disabled = true;
  setTimeout(() => {
    note.textContent = "✓ Message sent! I'll get back to you soon.";
    note.style.color = "#22c55e";
    btn.textContent = "Send Message →";
    btn.disabled = false;
    document.getElementById("formName").value = "";
    document.getElementById("formEmail").value = "";
    document.getElementById("formMsg").value = "";
    gsap.from(note, { opacity: 0, y: 8, duration: .4 });
  }, 1200);
});

// ─── ACTIVE NAV LINK HIGHLIGHT ───
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.style.color = "");
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = "var(--accent2)";
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => navObserver.observe(s));

// ─── SMOOTH ANCHOR SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
