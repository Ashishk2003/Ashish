// =============================================
//  ASHISH KUMAR PORTFOLIO — script.js
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     1. PARTICLE CANVAS (Hero background)
  ───────────────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function Particle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.6 + 0.1;
    }
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    };

    for (let i = 0; i < 90; i++) particles.push(new Particle());

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,229,192,${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,192,${p.a})`;
        ctx.fill();
        p.update();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─────────────────────────────────────────
     2. TYPING EFFECT
  ───────────────────────────────────────── */
  const typedEl = document.getElementById('typed');
  const roles = [
    'Software Developer',
    'Java | Python | SQL',
    'Problem Solver',
    'IoT Enthusiast'
  ];
  let rIndex = 0, cIndex = 0, deleting = false;

  function tick() {
    if (!typedEl) return;
    const full = roles[rIndex];
    if (deleting) {
      cIndex--;
      typedEl.textContent = full.slice(0, cIndex);
      if (cIndex <= 0) {
        deleting = false;
        rIndex = (rIndex + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 50);
    } else {
      cIndex++;
      typedEl.textContent = full.slice(0, cIndex);
      if (cIndex >= full.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
      setTimeout(tick, 100);
    }
  }
  tick();

  /* ─────────────────────────────────────────
     3. INTERSECTION OBSERVER — reveal + active nav
  ───────────────────────────────────────── */
  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  // Active nav + accent color per section
  const sectionColors = {
    home:       '#00e5c0',
    about:      '#00bcd4',
    skills:     '#74b9ff',
    projects:   '#55efc4',
    experience: '#ffeaa7',
    contact:    '#a29bfe'
  };
  const navLinks = document.querySelectorAll('.main-nav .nav-link, .mobile-nav .nav-link');

  function setActiveNav(id) {
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  }

  const sections = document.querySelectorAll('.section[id]');
  if (sections.length) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (sectionColors[id]) {
            document.documentElement.style.setProperty('--accent', sectionColors[id]);
          }
          setActiveNav(id);
        }
      });
    }, { threshold: 0.45 });
    sections.forEach(s => secObs.observe(s));
  }

  /* ─────────────────────────────────────────
     4. SMOOTH SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target && target.startsWith('#') && target.length > 1) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        // close mobile nav if open
        closeMobileNav();
      }
    });
  });

  /* ─────────────────────────────────────────
     5. MOBILE HAMBURGER
  ───────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  /* ─────────────────────────────────────────
     6. CERTIFICATE MODAL
  ───────────────────────────────────────── */
  const modal   = document.getElementById('certificateModal');
  const certImg = document.getElementById('certImage');

  window.openCertificate = function (imgSrc) {
    if (!modal || !certImg) return;
    certImg.src = imgSrc;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
  };

  window.closeCertificate = function () {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    if (certImg) certImg.src = '';
  };

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCertificate();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertificate();
  });

  /* ─────────────────────────────────────────
     7. KEYBOARD ACCESSIBILITY for clickable cards
  ───────────────────────────────────────── */
  document.querySelectorAll('.edu-card, .exp-card').forEach(el => {
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const match = el.getAttribute('onclick') && el.getAttribute('onclick').match(/openCertificate\(['"](.+?)['"]\)/);
        if (match) openCertificate(match[1]);
      }
    });
  });

  /* ─────────────────────────────────────────
     8. HEADER SCROLL SHADOW
  ───────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,0.5)'
        : 'none';
    }, { passive: true });
  }

}); // DOMContentLoaded
                        
