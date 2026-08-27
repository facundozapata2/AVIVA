/* ============================================================
   loader.js — AVIVA
   Controla la intro de carga (flame + AVIVA + año).
   Requiere: #loader en el HTML.
   ============================================================ */
(function () {
  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('hide');
    }, 900);
  });
})();