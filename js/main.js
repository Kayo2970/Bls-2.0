/* ================================================================
   AUTOVENT '26  —  Main JavaScript
   ================================================================ */

/* ── PRELOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('de-loader');
  if (loader) {
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 600);
  }
  // Trigger initial WOW animations
  triggerWow();
});

/* ── NAVBAR SCROLL ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('transparent');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.add('transparent');
  }
  highlightNavLink();
  toggleBackToTop();
}, { passive: true });

/* ── ACTIVE NAV LINK ────────────────────────────────────────────── */
const navLinks = document.querySelectorAll('#mainmenu .nav-link');
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

// Close mobile nav on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const el = document.getElementById('mainmenu');
    if (el && el.classList.contains('show')) {
      const bsc = bootstrap.Collapse.getInstance(el);
      if (bsc) bsc.hide();
    }
  });
});

/* ── COUNTDOWN TIMER ────────────────────────────────────────────── */
const eventDate = new Date('December 3, 2026 08:00:00').getTime();

function updateCountdown() {
  const now  = Date.now();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '000';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(3, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ── STAT COUNTERS ──────────────────────────────────────────────── */
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  document.querySelectorAll('.timer[data-to]').forEach(el => {
    const target = parseInt(el.dataset.to, 10);
    const speed  = parseInt(el.dataset.speed, 10) || 2000;
    const step   = target / (speed / 16);
    let current  = 0;

    const tick = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(tick);
      }
      el.textContent = Math.floor(current);
    }, 16);
  });
  countersAnimated = true;
}

/* ── SCHEDULE TABS ──────────────────────────────────────────────── */
const tabLinks  = document.querySelectorAll('.de_nav.de_nav_dark li a');
const dayPanels = document.querySelectorAll('.tab_single_content');

tabLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const dayId = link.dataset.day;

    // Update active tab
    tabLinks.forEach(l => l.closest('li').classList.remove('active'));
    link.closest('li').classList.add('active');

    // Swap content panel
    dayPanels.forEach(panel => {
      if (panel.id === dayId) {
        panel.style.display = 'block';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          panel.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
        });
      } else {
        panel.style.display = 'none';
      }
    });
  });
});

/* ── TESTIMONIAL SWIPER ─────────────────────────────────────────── */
if (document.querySelector('.testimonial-swiper')) {
  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 5500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      768:  { slidesPerView: 2 },
      1200: { slidesPerView: 3 },
    },
  });
}

/* ── WOW-LIKE SCROLL ANIMATIONS ─────────────────────────────────── */
function triggerWow() {
  const wowEls = document.querySelectorAll('.wow');
  if (!wowEls.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.wowDelay || 0) * 1000;
        setTimeout(() => {
          entry.target.classList.add('animated');
          entry.target.style.transitionDelay = '';
        }, delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  wowEls.forEach(el => {
    el.style.transitionDelay = '0ms';
    obs.observe(el);
  });
}

/* Reuse the same observer to trigger counters */
const statsSection = document.querySelector('#section-stats, .counter-wrap');
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObs.disconnect();
    }
  }, { threshold: 0.2 });
  statsObs.observe(statsSection.closest('section') || statsSection);
}

/* ── BACK TO TOP ────────────────────────────────────────────────── */
const btt = document.getElementById('back-to-top');
function toggleBackToTop() {
  if (!btt) return;
  if (window.scrollY > 400) btt.classList.add('visible');
  else btt.classList.remove('visible');
}
if (btt) {
  btt.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── HERO PARALLAX (subtle) ─────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.35;
    heroBg.style.transform = `translateY(${offset}px) scale(1.05)`;
  }, { passive: true });
}

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  if (!anchor.getAttribute('href').startsWith('#section') &&
      anchor.getAttribute('href') !== '#' &&
      !anchor.closest('#scheduleTabs')) return;

  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
