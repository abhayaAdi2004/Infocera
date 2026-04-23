/* ============================================================
   js/main.js — Infocera Website JavaScript (Single Page)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behaviour ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ── Mobile hamburger ─────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Smooth Scroll for Anchor Links ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navHeight = navbar ? navbar.offsetHeight : 0;
        window.scrollTo({
          top: targetElement.offsetTop - navHeight,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Dark / Light Theme Toggle ───────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('infocera-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('infocera-theme', next);
    });
  }

  // ── Global Page Grid — Mouse-Reveal Effect ──────────────────
  const pageGrid = document.getElementById('pageGrid');

  if (pageGrid) {
    const RADIUS = 350; // Larger radius for global effect

    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Smooth spotlight reveal
      const mask = `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)`;
      pageGrid.style.maskImage = mask;
      pageGrid.style.webkitMaskImage = mask;
    });

    window.addEventListener('mouseleave', () => {
      pageGrid.style.maskImage = 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)';
      pageGrid.style.webkitMaskImage = 'radial-gradient(circle 0px at 50% 50%, black 100%, transparent 100%)';
    });
  }


  // ── Animated counter ─────────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 16);
    });
    countersStarted = true;
  };

  // ── Intersection Observer for reveal & counters ──────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.querySelector && entry.target.querySelector('[data-count]')) {
          startCounters();
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, section, .service-card, .insight-card, .tech-item').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ── Active Section Tracker ───────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
          item.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // ── Hero particle background ─────────────────────────────────
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    createParticles(particlesContainer, 40);
  }

  function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, ${Math.random() > 0.5 ? '102' : '212'}, 255, ${Math.random() * 0.4 + 0.1});
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        left: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 15 + 10}s ${Math.random() * 10}s linear infinite;
        pointer-events: none;
      `;
      container.appendChild(particle);
    }
  }

  // ── Contact Form simulation ──────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const original = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #00c853, #1fdd85)';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = original;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

});
