// =============================================
//  ASHISH KUMAR PORTFOLIO — script.js
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     1. TERMINAL / CODE RAIN BACKGROUND
  ───────────────────────────────────────── */
  const canvas = document.getElementById('terminal-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    // Code snippets that scroll down
    const codeLines = [
      'const dev = new Developer("Ashish");',
      'import java.util.*;',
      'def solve(n): return n * 2',
      'SELECT * FROM projects WHERE status="done";',
      'git commit -m "feat: portfolio v2"',
      'console.log("Hello, World!");',
      'for i in range(len(data)):',
      'public static void main(String[] args){',
      'npm install && npm start',
      'pip install flask pandas numpy',
      'aws s3 sync . s3://my-bucket/',
      'int main() { return 0; }',
      'if err != nil { log.Fatal(err) }',
      'curl -X POST /api/v1/deploy',
      '#include <stdio.h>',
      'System.out.println("Build OK");',
      'docker build -t app:latest .',
      'ssh ubuntu@ec2-instance',
      'while(true) { keepLearning(); }',
      'SELECT name, CGPA FROM students;',
      'class Solution { solve() {} }',
      'echo "Deploying to production..."',
      'mqtt.publish("notice/board", msg)',
      'esp8266.connect(SSID, PASSWORD)',
      'response.status(200).json(data)',
    ];

    let W, H, cols, drops, fontSize;

    function init() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      fontSize = 13;
      cols = Math.floor(W / (fontSize * 22)); // one column per ~22 chars wide
      drops = [];
      for (let i = 0; i < cols; i++) {
        drops[i] = {
          y: Math.random() * -50,
          lineIndex: Math.floor(Math.random() * codeLines.length),
          speed: 0.3 + Math.random() * 0.5,
          opacity: 0.15 + Math.random() * 0.35,
        };
      }
    }
    init();
    window.addEventListener('resize', init);

    function draw() {
      // Dark fade trail
      ctx.fillStyle = 'rgba(8,13,20,0.06)';
      ctx.fillRect(0, 0, W, H);

      drops.forEach((drop, i) => {
        const x = i * (W / cols);
        const line = codeLines[drop.lineIndex];

        // Dim older text
        ctx.font = `${fontSize}px 'Space Mono', monospace`;
        ctx.fillStyle = `rgba(0,229,192,${drop.opacity * 0.4})`;
        ctx.fillText(line, x, drop.y - fontSize * 2);

        // Bright current line
        ctx.fillStyle = `rgba(0,229,192,${drop.opacity})`;
        ctx.fillText(line, x, drop.y);

        // Brightest leading character highlight
        ctx.fillStyle = `rgba(180,255,240,${drop.opacity + 0.2})`;
        ctx.fillText(line.charAt(0), x, drop.y);

        drop.y += fontSize * drop.speed;

        // Reset when off screen
        if (drop.y > H + fontSize * 3) {
          drop.y = -fontSize * 2;
          drop.lineIndex = Math.floor(Math.random() * codeLines.length);
          drop.speed = 0.3 + Math.random() * 0.5;
          drop.opacity = 0.15 + Math.random() * 0.35;
        }
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
    'IoT Enthusiast',
    'Cloud Learner'
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
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 100);
    }
  }
  tick();

  /* ─────────────────────────────────────────
     3. SCROLL REVEAL
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ─────────────────────────────────────────
     4. ACTIVE NAV + ACCENT COLOR PER SECTION
  ───────────────────────────────────────── */
  const sectionColors = {
    home:       '#00e5c0',
    about:      '#00bcd4',
    skills:     '#74b9ff',
    projects:   '#55efc4',
    experience: '#ffd166',
    contact:    '#a29bfe'
  };
  const navLinks = document.querySelectorAll('.main-nav .nav-link, .mobile-nav .nav-link');

  function setActiveNav(id) {
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
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
     5. SMOOTH SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target && target.startsWith('#') && target.length > 1) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        closeMobileNav();
      }
    });
  });

  /* ─────────────────────────────────────────
     6. MOBILE HAMBURGER
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
     7. CERTIFICATE MODAL
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

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCertificate();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCertificate();
  });

  /* ─────────────────────────────────────────
     8. KEYBOARD ACCESSIBILITY
  ───────────────────────────────────────── */
  document.querySelectorAll('.edu-card, .exp-card').forEach(el => {
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const attr = el.getAttribute('onclick') || '';
        const match = attr.match(/openCertificate\(['"](.+?)['"]\)/);
        if (match) openCertificate(match[1]);
      }
    });
  });

  /* ─────────────────────────────────────────
     9. HEADER SHADOW ON SCROLL
  ───────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,0.6)'
        : 'none';
    }, { passive: true });
  }

}); // end DOMContentLoaded
