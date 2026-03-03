/* ============================================================
   AUTOVENT '26 — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── Active nav link on scroll ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── Smooth close mobile nav on link click ─────────────────
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navMenu');
      if (collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // ─── Animated stat counters ─────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  const animateCounters = () => {
    statNums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
        if (target > 99) el.textContent = Math.floor(current) + '+';
      }, 16);
    });
  };

  const statsSection = document.getElementById('section-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // ─── Schedule day tabs ──────────────────────────────────────
  const schedTabs = document.querySelectorAll('.schedule-tabs .nav-link');
  const schedDays = document.querySelectorAll('.schedule-day');

  schedTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const dayId = tab.dataset.day;

      schedTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      schedDays.forEach(day => {
        if (day.id === dayId) {
          day.style.display = 'block';
          day.style.opacity = '0';
          day.style.transform = 'translateY(10px)';
          setTimeout(() => {
            day.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            day.style.opacity = '1';
            day.style.transform = 'translateY(0)';
          }, 10);
        } else {
          day.style.display = 'none';
        }
      });
    });
  });

  // ─── Testimonial Swiper ─────────────────────────────────────
  if (document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  // ─── Gallery lightbox ───────────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // ─── Scroll-down hint ───────────────────────────────────────
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const about = document.getElementById('section-about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ─── Fade-in animations on scroll ──────────────────────────
  const fadeEls = document.querySelectorAll(
    '.expert-card, .ticket-card, .stat-card, .schedule-item, .gallery-item, .sponsor-logo, .contact-item, .feature-item'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // ─── Contact form ───────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
      setTimeout(() => {
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane ms-2"></i>';
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

});

// ─── Lightbox close (global, called from HTML) ──────────────
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
