// ⚠️ REEMPLAZAR con los nombres reales del curso antes de publicar
const PLACEHOLDER_STUDENTS = [
  'Alumno 1', 'Alumna 2', 'Alumno 3', 'Alumna 4', 'Alumno 5',
  'Alumna 6', 'Alumno 7', 'Alumna 8', 'Alumno 9', 'Alumna 10',
];

// Las 19 imágenes de la decoración (Monsters, Inc. / Ratatouille), repartidas
// como "stickers" entre las secciones en vez de una galería aparte.
// Los dos archivos más pesados (sullivan.png, juiciomateytermo.png) quedan
// en las últimas secciones para que el lazy-load difiera su descarga.
const DECOR_IMAGES = [
  { src: 'public/images/boo.jpg', alt: 'Boo', section: 'hero' },
  { src: 'public/images/remy.jpg', alt: 'Remy', section: 'hero' },
  { src: 'public/images/monsters-inc.jpg', alt: 'Monsters, Inc.', section: 'hero' },
  { src: 'public/images/linguini.jpg', alt: 'Linguini', section: 'hero' },

  { src: 'public/images/collette.jpg', alt: 'Colette', section: 'welcome' },
  { src: 'public/images/papaderemy.jpg', alt: 'Papá de Remy', section: 'welcome' },
  { src: 'public/images/pelosullivan.jpg', alt: 'Sullivan', section: 'welcome' },

  { src: 'public/images/remy-linguini.jpg', alt: 'Remy y Linguini', section: 'countdown' },
  { src: 'public/images/remylocoqueso.jpg', alt: 'Remy y el queso', section: 'countdown' },
  { src: 'public/images/remyuesa.jpg', alt: 'Remy', section: 'countdown' },

  { src: 'public/images/smb.jpg', alt: 'Monsters, Inc.', section: 'students' },
  { src: 'public/images/smr.jpg', alt: 'Ratatouille', section: 'students' },
  { src: 'public/images/sullivangrito.jpg', alt: 'Sullivan', section: 'students' },
  { src: 'public/images/sybtristedespedida.jpg', alt: 'Despedida', section: 'students' },
  { src: 'public/images/symcinta.jpg', alt: 'Monsters, Inc.', section: 'students' },
  { src: 'public/images/sullivan.png', alt: 'Sullivan', section: 'students' },

  { src: 'public/images/symestudio.jpg', alt: 'Estudio', section: 'footer' },
  { src: 'public/images/symsustomiedo.jpg', alt: 'Sustos', section: 'footer' },
  { src: 'public/images/juiciomateytermo.png', alt: 'Decoración del salón', section: 'footer' },
];

// El hero tiene mucho espacio vacío (92vh, contenido centrado), así que ahí
// los stickers se ubican sueltos en las esquinas (posición absoluta). El
// resto de las secciones los muestra en una "tira" dentro del flujo normal
// (ver .decor-layer en style.css), así nunca tapan texto sin importar el
// largo del contenido.
const SLOTS = {
  hero: [
    { top: '6%', left: '4%' },
    { top: '8%', right: '5%' },
    { bottom: '10%', left: '6%' },
    { bottom: '8%', right: '6%' },
  ],
};

const EVENT_DATE = new Date('2026-09-18T08:00:00-03:00');

let lightboxOrder = [];
let lightboxIndex = 0;

function initStudents() {
  const list = document.getElementById('students-list');
  PLACEHOLDER_STUDENTS.forEach((name) => {
    const li = document.createElement('li');
    li.textContent = name;
    list.appendChild(li);
  });
}

function initDecorImages() {
  const slotCounters = {};
  DECOR_IMAGES.forEach((item) => {
    const layer = document.querySelector(`[data-decor="${item.section}"]`);
    if (!layer) return;

    const i = slotCounters[item.section] || 0;
    slotCounters[item.section] = i + 1;
    const slot = (SLOTS[item.section] && SLOTS[item.section][i]) || {};

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'decor-img';
    img.tabIndex = 0;

    Object.entries(slot).forEach(([prop, value]) => {
      img.style[prop] = value;
    });

    const rot = (Math.random() * 14 - 7).toFixed(1);
    img.style.setProperty('--rot', `${rot}deg`);

    const order = lightboxOrder.length;
    lightboxOrder.push({ src: item.src, alt: item.alt });
    img.addEventListener('click', () => openLightbox(order));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(order);
      }
    });

    layer.appendChild(img);
  });
}

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;
  const root = document.getElementById('countdown-root');
  const msg = document.getElementById('cd-message');

  if (diff <= 0 && now - EVENT_DATE < 24 * 60 * 60 * 1000) {
    root.className = 'countdown-root today';
    msg.textContent = '¡Hoy es el Día de la Primavera! 🌸 ¡Feliz día, 1ro A!';
    return;
  }

  if (diff > 0) {
    root.className = 'countdown-root pre';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    document.getElementById('cd-days').textContent = pad(d);
    document.getElementById('cd-hours').textContent = pad(h);
    document.getElementById('cd-minutes').textContent = pad(m);
    document.getElementById('cd-seconds').textContent = pad(s);
    msg.textContent = 'Faltan para la Primavera...';
  } else {
    root.className = 'countdown-root post';
    msg.textContent = '¡Ya pasamos un lindo Día de la Primavera! 🌷 Nos vemos en la próxima 💛';
  }
}

const PETAL_EMOJIS = ['🌸', '🌷', '🦋', '🌼', '✨'];
const MAX_PETALS = 10;

function spawnPetal() {
  const layer = document.querySelector('.floaties');
  if (layer.children.length >= MAX_PETALS) return;

  const el = document.createElement('span');
  el.className = 'petal';
  el.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
  el.style.left = Math.random() * 92 + 'vw';
  el.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
  const duration = 7 + Math.random() * 6;
  el.style.animationDuration = duration + 's';

  el.addEventListener('click', () => {
    el.classList.add('popped');
  });
  el.addEventListener('animationend', () => el.remove());

  layer.appendChild(el);
}

function initEasterEggs() {
  document.querySelectorAll('[data-easter]').forEach((el) => {
    const key = el.dataset.easter;
    const target = document.querySelector(`[data-reveal="${key}"]`);
    if (!target) return;

    const toggle = () => target.classList.toggle('revealed');
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section').forEach((el) => observer.observe(el));
}

function initParallax() {
  const layer = document.querySelector('.floaties');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      layer.style.transform = `translateY(${window.scrollY * -0.08}px)`;
      ticking = false;
    });
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  const item = lightboxOrder[lightboxIndex];
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = item.src;
  img.alt = item.alt;
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  const box = document.getElementById('lightbox');
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
}

function showLightboxDelta(delta) {
  if (!lightboxOrder.length) return;
  lightboxIndex = (lightboxIndex + delta + lightboxOrder.length) % lightboxOrder.length;
  const item = lightboxOrder[lightboxIndex];
  const img = document.getElementById('lightbox-img');
  img.src = item.src;
  img.alt = item.alt;
}

function initLightbox() {
  const box = document.getElementById('lightbox');
  box.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  box.addEventListener('click', (e) => {
    if (e.target === box) closeLightbox();
  });

  let touchStartX = 0;
  box.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  box.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      showLightboxDelta(deltaX < 0 ? 1 : -1);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStudents();
  initDecorImages();
  initEasterEggs();
  initScrollReveal();
  initParallax();
  initLightbox();

  updateCountdown();
  setInterval(updateCountdown, 1000);
  setInterval(spawnPetal, 1800);
});
