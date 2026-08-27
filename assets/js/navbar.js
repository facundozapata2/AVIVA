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
(function () {

  /* ---------- 1) Navbar fijo tras el hero ---------- */
  var hero = document.getElementById('hero');
  var navbar = document.getElementById('navbar');

  if (hero && navbar) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
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
  var hamburger = document.getElementById('hamburger');
  var closeBtn = document.getElementById('hamburger-close');
  var overlay = document.getElementById('nav-overlay');

  function openNav() {
    document.body.classList.add('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.setAttribute('aria-hidden', 'false');
  }

  function closeNav() {
    document.body.classList.remove('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      document.body.classList.contains('nav-open') ? closeNav() : openNav();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- 3) Scroll-reveal de secciones ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      revealIO.observe(el);
    });
  }

})();