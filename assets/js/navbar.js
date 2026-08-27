/* ============================================================
   navbar.js — AVIVA
   Controla:
     1) La aparición del navbar fijo al salir del hero.
     2) La apertura / cierre del menú hamburguesa.
     3) El scroll-reveal general de las secciones (.reveal).

   Requiere en el HTML:
     #hero, #navbar, #hamburger, #hamburger-close, #nav-overlay,
     enlaces con clase .nav-link, y elementos con clase .reveal.
   ============================================================ */

(() => {

  /* ---------- 1) Navbar fijo tras el hero ---------- */

  const hero = document.getElementById('hero');
  const navbar = document.getElementById('navbar');

  if (hero && navbar) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          navbar.classList.add('show');
        } else {
          navbar.classList.remove('show');
        }
      });
    }, { threshold: 0.05 });

    navIO.observe(hero);
  }

  /* ---------- 2) Menú hamburguesa ---------- */

  const hamburger = document.getElementById('hamburger');
  const closeBtn = document.getElementById('hamburger-close');
  const overlay = document.getElementById('nav-overlay');

  const openNav = () => {
    document.body.classList.add('nav-open');

    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
    }

    if (overlay) {
      overlay.setAttribute('aria-hidden', 'false');
    }
  };

  const closeNav = () => {
    document.body.classList.remove('nav-open');

    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
    }

    if (overlay) {
      overlay.setAttribute('aria-hidden', 'true');
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.body.classList.contains('nav-open')
        ? closeNav()
        : openNav();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });

  /* ---------- 3) Scroll-reveal de secciones ---------- */

  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => {
      revealIO.observe(el);
    });
  }

})();