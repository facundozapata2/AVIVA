/* ============================================================
   cronograma.js — AVIVA
   Acordeón editorial de la sección Cronograma.
   Regla: nunca puede haber más de un día abierto a la vez.

   Requiere en el HTML:
     .crono-day-toggle  → button con aria-expanded + aria-controls
     .crono-day-panel   → panel referenciado por aria-controls,
                           con aria-hidden inicial en "true"

   El estado visual (abierto/cerrado) lo maneja el CSS leyendo
   el atributo aria-hidden del panel — este script solo actualiza
   los atributos de accesibilidad.
   ============================================================ */
(function () {

  var toggles = document.querySelectorAll('.crono-day-toggle');
  if (!toggles.length) return;

  function setOpen(toggle, isOpen) {
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (panel) panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var wasOpen = toggle.getAttribute('aria-expanded') === 'true';

      // Cierra cualquier otro día abierto.
      toggles.forEach(function (t) {
        if (t !== toggle) setOpen(t, false);
      });

      // Si ya estaba abierto, lo cierra; si no, lo abre.
      setOpen(toggle, !wasOpen);
    });
  });

})();